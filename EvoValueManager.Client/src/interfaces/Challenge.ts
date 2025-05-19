export interface Challenge {
    id: number;
    title: string;
    requiredBravery?: number | null;
    requiredTrust?: number | null;
    requiredPresence?: number | null;
    requiredGrowth?: number | null;
    requiredCare?: number | null;
    gainableBravery?: number | null;
    gainableTrust?: number | null;
    gainablePresence?: number | null;
    gainableGrowth?: number | null;
    gainableCare?: number | null;
}
