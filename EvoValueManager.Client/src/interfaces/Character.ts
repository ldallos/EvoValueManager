import { Achievement } from "./Achievement";
import { Tool } from "@/interfaces/Tool.ts";

export interface Character {
    id: number;
    name: string;
    title?: string;
    hasAvatar: boolean;
    achievements: Achievement[];
    bravery: number;
    trust: number;
    presence: number;
    growth: number;
    care: number;
    appliedTools: Tool[];
}
