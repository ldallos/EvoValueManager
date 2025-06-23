export interface Tool {
    id: number;
    name: string;
    description?: string | null;
    braveryBonus?: number | null;
    trustBonus?: number | null;
    presenceBonus?: number | null;
    growthBonus?: number | null;
    careBonus?: number | null;
}