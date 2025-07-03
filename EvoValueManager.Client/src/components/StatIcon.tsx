import { AlignEndHorizontal, Sprout, Moon, ShieldCheck, Origami } from "lucide-react";
import { Character } from "../interfaces/Character";

export type StatName = keyof Omit<Character, "id" | "name" | "title" | "hasAvatar" | "achievements">;

export const STAT_NAMES: StatName[] = ["growth", "care", "presence", "trust", "bravery"];

const statColorsMap: { [key: string]: string } = {
    growth: "#EFFF00",
    care: "#2CD05C",
    presence: "#007A8A",
    trust: "#A0A0A0",
    bravery: "#FF8C73",
};


interface StatIconProps {
    stat: StatName;
    className?: string;
}

const StatIcon = ({ stat, className = "w-6 h-6" }: StatIconProps) => {
    const iconColor = statColorsMap[stat];

    const iconMap: Record<StatName, React.ReactElement> = {
        growth: <AlignEndHorizontal className={`${className}`} fill={iconColor} color={iconColor} />,
        care: <Sprout className={`${className}`} fill={iconColor} color={iconColor} />,
        presence: <Moon className={`${className}`} color={iconColor} />,
        trust: <ShieldCheck className={`${className}`} color={iconColor} />,
        bravery: <Origami className={`${className}`} color={iconColor} />,
    };

    return iconMap[stat] || null;
};

export default StatIcon;