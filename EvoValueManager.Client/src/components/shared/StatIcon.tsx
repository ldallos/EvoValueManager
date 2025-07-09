import {
    AlignEndHorizontal,
    Sprout,
    Moon,
    ShieldCheck,
    Origami,
} from "lucide-react";
import { StatName } from "./stat-types";
import { statColorsMap } from "./stat-types";
import React from "react";

interface StatIconProps {
    stat: StatName;
    className?: string;
}

const StatIcon = ({ stat, className = "w-6 h-6" }: StatIconProps) => {
    const { bonus: iconColor } = statColorsMap[stat];

    const iconMap: Record<StatName, React.ReactElement> = {
        growth: (
            <AlignEndHorizontal
                className={`${className}`}
                color={iconColor}
            />
        ),
        care: (
            <Sprout
                className={`${className}`}
                color={iconColor}
            />
        ),
        presence: (
            <Moon
                className={`${className}`}
                color={iconColor}
            />
        ),
        trust: (
            <ShieldCheck
                className={`${className}`}
                color={iconColor}
            />
        ),
        bravery: (
            <Origami
                className={`${className}`}
                color={iconColor}
            />
        ),
    };

    return iconMap[stat] || null;
};

export default StatIcon;
