import { useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import * as api from "../api/api";
import { ManagementDetails } from "../interfaces/Management";
import { Challenge } from "../interfaces/Challenge";
import Select from "./ui/Select";
import Button from "./ui/Button";
import ChallengeSelector from "./ChallengeSelector";
import { useTranslation } from "react-i18next";
import { CHALLENGE_STATES, getStateId } from "../constants/traits";

type State = {
    assignmentType: "available" | "assigned";
    selectedChallengeId: number | null;
    detailsText: string;
    selectedStateId: number;
};

type Action =
    | { type: "SET_ASSIGNMENT_TYPE"; payload: "available" | "assigned" }
    | { type: "SET_CHALLENGE"; payload: number | null }
    | { type: "SET_DETAILS"; payload: string }
    | { type: "SET_STATE_ID"; payload: number }
    | { type: "HYDRATE_FROM_DETAILS"; payload: ManagementDetails };

const initialState: State = {
    assignmentType: "available",
    selectedChallengeId: null,
    detailsText: "",
    selectedStateId: 1,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_ASSIGNMENT_TYPE":
            return { ...initialState, assignmentType: action.payload };
        case "SET_CHALLENGE":
            return {
                ...state,
                selectedChallengeId: action.payload,
                detailsText: "",
                selectedStateId: 1,
            };
        case "SET_DETAILS":
            return { ...state, detailsText: action.payload };
        case "SET_STATE_ID":
            return { ...state, selectedStateId: action.payload };
        case "HYDRATE_FROM_DETAILS":
            return {
                ...state,
                detailsText: action.payload.details || "",
                selectedStateId: getStateId(action.payload.state),
            };
        default:
            return state;
    }
}

interface ManagementDashboardProps {
    characterId: number;
}

function ManagementDashboard({ characterId }: ManagementDashboardProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [state, dispatch] = useReducer(reducer, initialState);

    const challengesQuery = useQuery<Challenge[]>({
        queryKey: ["managementChallenges", characterId, state.assignmentType],
        queryFn: () =>
            state.assignmentType === "available"
                ? api.getAvailableChallengesForCharacter(characterId)
                : api.getAssignedChallengesForCharacter(characterId),
    });


    const detailsQuery = useQuery<ManagementDetails>({
        queryKey: ["managementDetails", characterId, state.selectedChallengeId],
        queryFn: () => api.getManagementDetails(characterId, state.selectedChallengeId!),
        enabled: !!state.selectedChallengeId && state.assignmentType === "assigned",
    });

    useEffect(() => {
        if (detailsQuery.data) {
            dispatch({ type: "HYDRATE_FROM_DETAILS", payload: detailsQuery.data });
        }
    }, [detailsQuery.data]);

    const assignMutation = useMutation({
        mutationFn: () =>
            api.assignChallenge({
                characterId,
                challengeId: state.selectedChallengeId!,
                stateId: state.selectedStateId,
                details: state.detailsText || null,
            }),
        onSuccess: () => {
            toast.success(t("challengeAssignedSuccess"));
            queryClient.invalidateQueries({ queryKey: ["managementChallenges", characterId] });
            dispatch({ type: "SET_ASSIGNMENT_TYPE", payload: "assigned" });
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(err.response?.data?.message || t("failedToAssignChallengeError")),
    });

    const updateMutation = useMutation({
        mutationFn: () =>
            api.updateManagement(characterId, state.selectedChallengeId!, {
                stateId: state.selectedStateId,
                details: state.detailsText || null,
            }),
        onSuccess: () => {
            toast.success(t("managementUpdatedSuccess"));
            queryClient.invalidateQueries({
                queryKey: ["managementDetails", characterId, state.selectedChallengeId],
            });
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(err.response?.data?.message || t("failedToUpdateDetailsError")),
    });

    const closeMutation = useMutation({
        mutationFn: () => api.closeChallenge(characterId, state.selectedChallengeId!),
        onSuccess: () => {
            toast.success(t("challengeClosedSuccess"));
            queryClient.invalidateQueries({ queryKey: ["characters"] });
            queryClient.invalidateQueries({ queryKey: ["managementChallenges", characterId] });
        },
        onError: (err: AxiosError<{ message: string }>) =>
            toast.error(err.response?.data?.message || t("failedToCloseChallengeError")),
    });

    const selectedChallenge = challengesQuery.data?.find((c) => c.id === state.selectedChallengeId);
    const isProcessing =
        assignMutation.isPending || updateMutation.isPending || closeMutation.isPending;

    const isClosed = detailsQuery.data?.isClosed ?? false;


    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-wrap items-center gap-4">
                <Select
                    label={t("selectAnOption")}
                    value={state.assignmentType}
                    onChange={(e) =>
                        dispatch({
                            type: "SET_ASSIGNMENT_TYPE",
                            payload: e.target.value as "available" | "assigned",
                        })
                    }
                    disabled={isProcessing}
                >
                    <option value="available">{t("assignNewChallenge")}</option>
                    <option value="assigned">{t("manageChallenges")}</option>
                </Select>
                <ChallengeSelector
                    challenges={challengesQuery.data || []}
                    selectedId={state.selectedChallengeId}
                    onChange={(e) =>
                        dispatch({
                            type: "SET_CHALLENGE",
                            payload: e.target.value ? Number(e.target.value) : null,
                        })
                    }
                    label={
                        state.assignmentType === "available"
                            ? t("availableChallengesLabel")
                            : t("assignedChallengesLabel")
                    }
                    disabled={challengesQuery.isLoading || isProcessing}
                />
            </div>

            {selectedChallenge && (
                <div className="bg-white p-6 rounded-lg shadow space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                            <h4 className="font-semibold text-lg">{selectedChallenge.title}</h4>
                            <p className="text-sm text-gray-600">
                                {state.assignmentType === "available"
                                    ? t("requirements")
                                    : t("gainableValues")}
                            </p>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <h4 className="font-semibold text-lg">{t("details")}</h4>
                            <Select
                                label={t("state")}
                                value={state.selectedStateId}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_STATE_ID",
                                        payload: Number(e.target.value),
                                    })
                                }
                                disabled={isProcessing || isClosed}
                            >
                                {Object.entries(CHALLENGE_STATES).map(([id, text]) => (
                                    <option key={id} value={id}>
                                        {text}
                                    </option>
                                ))}
                            </Select>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("notes")}
                                </label>
                                <textarea
                                    rows={4}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-evogreen focus:border-evogreen"
                                    value={state.detailsText}
                                    onChange={(e) =>
                                        dispatch({ type: "SET_DETAILS", payload: e.target.value })
                                    }
                                    disabled={isProcessing || isClosed}
                                    placeholder={t("enterDetailsPlaceholder")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-5 border-t flex items-center gap-4">
                        {isClosed ? (
                            <p className="text-sm font-semibold text-gray-500">
                                {t("challengeIsClosed")}
                            </p>
                        ) : state.assignmentType === "available" ? (
                            <Button
                                variant="primary"
                                onClick={() => assignMutation.mutate()}
                                isLoading={assignMutation.isPending}
                            >
                                {t("assignChallenge")}
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={() => updateMutation.mutate()}
                                    isLoading={updateMutation.isPending}
                                >
                                    {t("update")}
                                </Button>
                                {state.selectedStateId === 3 && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => closeMutation.mutate()}
                                        isLoading={closeMutation.isPending}
                                    >
                                        {t("closeAndGainStats")}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagementDashboard;
