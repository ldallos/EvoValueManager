import { Tool } from "./Tool";
import { Achievement } from "./Achievement";

export interface StatDetail {
    base: number;
    bonus: number;
    effective: number;
}

export interface RichCharacter {
    id: number;
    name: string;
    title?: string;
    hasAvatar: boolean;
    bravery: StatDetail;
    trust: StatDetail;
    presence: StatDetail;
    growth: StatDetail;
    care: StatDetail;
    appliedTools: Tool[];
    achievements: Achievement[];
}
