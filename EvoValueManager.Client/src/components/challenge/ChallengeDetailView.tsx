import React, { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Award } from "lucide-react";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import * as api from "../../api/api";
import { ManagementDetails } from "@/interfaces/Management.ts";
import Button from "../ui/Button.tsx";
import Select from "../ui/Select.tsx";
import StatDisplay from "../shared/StatDisplay.tsx";
import GainableStatList from "../shared/GainableStatList.tsx";
import { Action as ManagementAction } from "./ManagementDashboard";
import { Character } from "@/interfaces/Character.ts";
import { Challenge } from "@/interfaces/Challenge.ts";
import { ChallengeState } from "@/api/api.ts";
import { Achievement } from "@/interfaces/Achievement.ts";
import { useTranslation } from "react-i18next";

interface ChallengeDetailViewProps {
    character: Character;
    challenge: Challenge;
    isAssigned: boolean;
    onClear: () => void;
    detailsState: {
        detailsText: string;
        selectedStateId: number;
    };
    dispatchDetails: React.Dispatch<ManagementAction>;
    challengeStates: ChallengeState[];
}

export default function ChallengeDetailView({
    character,
    challenge,
    isAssigned,
    onClear,
    detailsState,
    dispatchDetails,
    challengeStates,
}: ChallengeDetailViewProps) {
    const queryClient = useQueryClient();
    const { detailsText, selectedStateId } = detailsState;
    const { t } = useTranslation();

    const achievementsBeforeClose = useRef<Achievement[]>([]);

    const { data: currentCharacterAchievements = [] } = useQuery<Achievement[]>(
        {
            queryKey: ["characterAchievements", character.id],
            queryFn: () => api.getCharacterAchievements(character.id),
            enabled: !!character,
        }
    );

    const { data: managementDetails, isLoading: isLoadingDetails } =
        useQuery<ManagementDetails>({
            queryKey: ["managementDetails", character.id, challenge.id],
            queryFn: () => api.getManagementDetails(character.id, challenge.id),
            enabled: isAssigned && challengeStates.length > 0,
        });

    useEffect(() => {
        if (managementDetails && challengeStates.length > 0) {
            dispatchDetails({
                type: "HYDRATE_FROM_DETAILS",
                payload: {
                    details: managementDetails,
                    states: challengeStates,
                },
            });
        }
    }, [managementDetails, challengeStates, dispatchDetails]);

    const assignMutation = useMutation({
        mutationFn: () =>
            api.assignChallenge({
                characterId: character.id,
                challengeId: challenge.id,
                stateId: 1,
                details: detailsText || null,
            }),
        onSuccess: () => {
            toast.success(t("toast.challengeAssigned"));
            queryClient.invalidateQueries({
                queryKey: ["availableChallenges", character.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["assignedChallenges", character.id],
            });
            onClear();
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(
                err.response?.data?.message || t("toast.assignChallengeFailed")
            ),
    });

    const updateMutation = useMutation({
        mutationFn: () =>
            api.updateManagement(character.id, challenge.id, {
                stateId: selectedStateId,
                details: detailsText || null,
            }),
        onSuccess: () => {
            toast.success(t("toast.managementUpdated"));
            queryClient.invalidateQueries({
                queryKey: ["managementDetails", character.id, challenge.id],
            });
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(
                err.response?.data?.message || t("toast.updateDetailsFailed")
            ),
    });

    const closeMutation = useMutation({
        mutationFn: () => {
            achievementsBeforeClose.current = currentCharacterAchievements;
            return api.closeChallenge(character.id, challenge.id);
        },
        onSuccess: async () => {
            toast.success(t("toast.challengeClosed"));
            onClear();

            await queryClient.invalidateQueries({
                queryKey: ["availableChallenges", character.id],
            });
            await queryClient.invalidateQueries({
                queryKey: ["assignedChallenges", character.id],
            });
            await queryClient.invalidateQueries({
                queryKey: ["characters"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["baseCharacters"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["teamStats"],
            });

            const newAchievements = await queryClient.fetchQuery<Achievement[]>(
                {
                    queryKey: ["characterAchievements", character.id],
                    queryFn: () => api.getCharacterAchievements(character.id),
                }
            );

            const oldAchievementIds = new Set(
                achievementsBeforeClose.current.map((a) => a.id)
            );
            const newlyEarned = newAchievements.filter(
                (a) => !oldAchievementIds.has(a.id)
            );

            newlyEarned.forEach((ach, index) => {
                setTimeout(() => {
                    toast.custom(
                        (tParam) => (
                            <div
                                className={`${tParam.visible ? "animate-enter" : "animate-leave"}
                                max-w-md w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-amber-400/50`}
                            >
                                <div className="flex-1 w-0 p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 pt-0.5 text-amber-400">
                                            <Award className="h-8 w-8" />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-white">
                                                {t("toast.achievementUnlocked")}
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-slate-200">
                                                {ach.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                        { duration: 4000 }
                    );
                }, index * 500);
            });
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(
                err.response?.data?.message || t("toast.closeChallengeFailed")
            ),
    });

    const isClosed = managementDetails?.isClosed ?? false;
    const isProcessing =
        assignMutation.isPending ||
        updateMutation.isPending ||
        closeMutation.isPending ||
        isLoadingDetails;
    const isCompletedInDb = managementDetails?.stateId === 3;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-6 border-t border-slate-700"
        >
            <h3 className="text-xl font-bold text-white mb-4">
                {t(challenge.title)}
            </h3>

            {!isAssigned && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <StatDisplay
                        title={t("challenge.yourStatsTitle")}
                        stats={character}
                        isCompact
                    />
                    <StatDisplay
                        title={t("challenge.requirementsTitle")}
                        stats={character}
                        requirements={challenge}
                        isCompact
                    />
                </div>
            )}
            <div className="lg:col-span-2 gap-6 mb-6">
                <GainableStatList
                    title={t("challenge.gainsTitle")}
                    challenge={challenge}
                />
            </div>

            <div className="bg-slate-800 p-4 rounded-lg space-y-4">
                <h4 className="font-semibold text-white">
                    {isAssigned
                        ? t("challenge.updateProgressTitle")
                        : t("challenge.assignThisChallengeTitle")}
                </h4>
                {isAssigned && (
                    <Select
                        label={t("challenge.stateLabel")}
                        value={selectedStateId}
                        onChange={(e) =>
                            dispatchDetails({
                                type: "SET_STATE_ID",
                                payload: Number(e.target.value),
                            })
                        }
                        disabled={isProcessing || isClosed}
                    >
                        {challengeStates.map((state) => (
                            <option
                                key={state.id}
                                value={state.id}
                            >
                                {state.name}
                            </option>
                        ))}
                    </Select>
                )}
                <textarea
                    rows={3}
                    value={detailsText}
                    onChange={(e) =>
                        dispatchDetails({
                            type: "SET_DETAILS",
                            payload: e.target.value,
                        })
                    }
                    placeholder={t("challenge.notesPlaceholder")}
                    className="block w-full border rounded-md shadow-sm p-2 bg-slate-800 border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isProcessing || (isAssigned && isClosed)}
                />

                <div className="flex flex-wrap items-center gap-2">
                    {!isAssigned && (
                        <Button
                            variant="primary"
                            onClick={() => assignMutation.mutate()}
                            isLoading={isProcessing}
                        >
                            {t("challenge.assignButton")}
                        </Button>
                    )}
                    {isAssigned && !isClosed && (
                        <>
                            {!isCompletedInDb && (
                                <Button
                                    variant="primary"
                                    onClick={() => updateMutation.mutate()}
                                    isLoading={isProcessing}
                                >
                                    {t("challenge.updateProgressButton")}
                                </Button>
                            )}
                            {isCompletedInDb && (
                                <Button
                                    variant="primary"
                                    onClick={() => closeMutation.mutate()}
                                    isLoading={isProcessing}
                                >
                                    {t("challenge.closeAndGainStatsButton")}
                                </Button>
                            )}
                        </>
                    )}
                    {isAssigned && isClosed && (
                        <p className="text-yellow-400 font-semibold">
                            {t("challenge.isClosedMessage")}
                        </p>
                    )}
                    <Button
                        variant="ghost"
                        onClick={onClear}
                        disabled={isProcessing}
                    >
                        {t("challenge.clearSelectionButton")}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
