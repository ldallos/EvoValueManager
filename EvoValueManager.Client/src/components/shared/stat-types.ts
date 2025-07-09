import { Character } from "@/interfaces/Character";

export type StatName = keyof Omit<
    Character,
    "id" | "name" | "title" | "hasAvatar" | "achievements" | "appliedTools"
>;

export const STAT_NAMES: StatName[] = [
    "growth",
    "care",
    "presence",
    "trust",
    "bravery",
];

export const statColorsMap: { [key: string]: { base: string; bonus: string } } =
    {
        bravery: { base: "#ED563B", bonus: "#FF8C73" },
        trust: { base: "#888888", bonus: "#B0B0B0" },
        presence: { base: "#006A7A", bonus: "#0096AD" },
        growth: { base: "#B8C200", bonus: "#EFFF00" },
        care: { base: "#1A9C3F", bonus: "#2CD05C" },
    };
