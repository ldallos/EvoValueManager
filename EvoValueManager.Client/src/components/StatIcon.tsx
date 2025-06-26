import { Swords, BookOpen, Shield, Wand, Gem } from "lucide-react";
import { Character } from "../interfaces/Character";

export type StatName = Exclude<keyof Character, "id" | "name">;

export const STAT_NAMES: StatName[] = ["bravery", "trust", "presence", "growth", "care"];

interface StatIconProps {
    stat: StatName;
    className?: string;
}

const StatIcon = ({ stat, className = "w-4 h-4" }: StatIconProps) => {
    const iconMap: Record<StatName, React.ReactElement> = {
        bravery: <Swords className={`${className} text-red-400`} />,
        trust: <Shield className={`${className} text-sky-400`} />,
        presence: <Gem className={`${className} text-yellow-400`} />,
        growth: <BookOpen className={`${className} text-green-400`} />,
        care: <Wand className={`${className} text-purple-400`} />,
    };

    return iconMap[stat] || null;
};

export default StatIcon;
