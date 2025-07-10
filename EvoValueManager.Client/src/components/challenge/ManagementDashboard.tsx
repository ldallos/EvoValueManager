import { useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as api from "../../api/api";
import { Challenge } from "@/interfaces/Challenge.ts";
import { Character } from "@/interfaces/Character.ts";
import { ManagementDetails } from "@/interfaces/Management.ts";
import AvailableChallenges from "./AvailableChallenges";
import AssignedChallenges from "./AssignedChallenges";
import ChallengeDetailView from "./ChallengeDetailView";
import { ChallengeState } from "@/api/api.ts";
import {useTranslation} from "react-i18next";

type State = {
    selectedChallengeId: number | null;
    detailsText: string;
    selectedStateId: number;
};

export type Action =
    | { type: "SET_CHALLENGE"; payload: number | null }
    | { type: "SET_DETAILS"; payload: string }
    | { type: "SET_STATE_ID"; payload: number }
    | {
          type: "HYDRATE_FROM_DETAILS";
          payload: {
              details: ManagementDetails;
              states: ChallengeState[];
          };
      };

const initialState: State = {
    selectedChallengeId: null,
    detailsText: "",
    selectedStateId: 1,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_CHALLENGE":
            return {
                ...state,
                selectedChallengeId: action.payload,
                detailsText: "",
                selectedStateId: 1,
            };
        case "SET_DETAILS":
            return {
                ...state,
                detailsText: action.payload,
            };
        case "SET_STATE_ID":
            return {
                ...state,
                selectedStateId: action.payload,
            };
        case "HYDRATE_FROM_DETAILS": {
            return {
                ...state,
                detailsText: action.payload.details.details || "",
                selectedStateId: action.payload.details.stateId,
            };
        }
        default:
            return state;
    }
}

interface ManagementDashboardProps {
    characterId: number;
    character: Character;
}

export default function ManagementDashboard({
    characterId,
    character,
}: ManagementDashboardProps) {
    const { t } = useTranslation();
    
    const [state, dispatch] = useReducer(reducer, initialState);

    const { data: availableChallenges = [], isLoading: isLoadingAvailable } =
        useQuery<Challenge[]>({
            queryKey: ["availableChallenges", characterId],
            queryFn: () => api.getAvailableChallengesForCharacter(characterId),
        });
    const { data: assignedChallenges = [], isLoading: isLoadingAssigned } =
        useQuery<Challenge[]>({
            queryKey: ["assignedChallenges", characterId],
            queryFn: () => api.getAssignedChallengesForCharacter(characterId),
        });

    const { data: challengeStates = [], isLoading: isLoadingStates } = useQuery<
        ChallengeState[]
    >({
        queryKey: ["challengeStates"],
        queryFn: api.getChallengeStates,
        staleTime: Infinity,
    });

    const isLoading =
        isLoadingAvailable || isLoadingAssigned || isLoadingStates;
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>{t("challenge.loading")}</span>
            </div>
        );
    }

    const allChallenges = [...availableChallenges, ...assignedChallenges];
    const selectedChallenge = allChallenges.find(
        (c) => c.id === state.selectedChallengeId
    );
    const isSelectedChallengeAssigned = assignedChallenges.some(
        (c) => c.id === state.selectedChallengeId
    );

    const handleSelectChallenge = (id: number) => {
        dispatch({ type: "SET_CHALLENGE", payload: id });
    };
    const handleClearSelection = () => {
        dispatch({ type: "SET_CHALLENGE", payload: null });
    };

    return (
        <div className="space-y-8">
            <AvailableChallenges
                character={character}
                challenges={availableChallenges}
                selectedId={
                    !isSelectedChallengeAssigned
                        ? state.selectedChallengeId
                        : null
                }
                onSelect={handleSelectChallenge}
                isProcessing={false}
            />
            <AssignedChallenges
                challenges={assignedChallenges}
                selectedId={
                    isSelectedChallengeAssigned
                        ? state.selectedChallengeId
                        : null
                }
                onSelect={handleSelectChallenge}
                isProcessing={false}
            />
            {selectedChallenge && (
                <ChallengeDetailView
                    character={character}
                    challenge={selectedChallenge}
                    isAssigned={isSelectedChallengeAssigned}
                    onClear={handleClearSelection}
                    detailsState={state}
                    dispatchDetails={dispatch}
                    challengeStates={challengeStates}
                />
            )}
        </div>
    );
}
