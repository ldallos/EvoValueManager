export interface ManagementAssignment {
    characterId: number;
    challengeId: number;
    state: string;
    details?: string | null;
    isClosed: boolean;
}

export interface ManagementDetails {
    state: string;
    details?: string | null;
    isClosed: boolean;
}

export interface AssignChallenge {
    characterId: number;
    challengeId: number;
    stateId: number;
    details?: string | null;
}

export interface UpdateManagement {
    details?: string | null;
    stateId: number;
}