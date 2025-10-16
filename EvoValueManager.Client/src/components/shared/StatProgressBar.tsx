import StatIcon from "@/components/shared/StatIcon.tsx";
import { StatName } from "@/components/shared/stat-types.ts";
import { Tool } from "@/interfaces/Tool.ts";
import Tooltip from "./../ui/Tooltip";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatProgressBarProps {
    statName: StatName;
    baseValue: number;
    bonusValue: number;
    bonusSources: Tool[];
    maxValue?: number;
}

const statColorsHex: {
    [key: string]: { base: string; bonus: string };
} = {
    bravery: { base: "#ED563B", bonus: "#FF8C73" },
    trust: { base: "#888888", bonus: "#B0B0B0" },
    presence: { base: "#006A7A", bonus: "#0096AD" },
    growth: { base: "#B8C200", bonus: "#EFFF00" },
    care: { base: "#1A9C3F", bonus: "#2CD05C" },
};

export function StatProgressBar({
    statName,
    baseValue,
    bonusValue,
    bonusSources,
    maxValue = 100,
}: StatProgressBarProps) {
    const { t } = useTranslation();

    const totalValue = baseValue + bonusValue;
    const isMastered = totalValue > maxValue;

    const basePercentage = Math.min(100, (baseValue / maxValue) * 100);
    const totalValuePercentage = Math.min(100, (totalValue / maxValue) * 100);

    const masteryColor = "gold";
    const colors = statColorsHex[statName] || {
        base: "#4A5568",
        bonus: "#718096",
    };
    const textColor = isMastered ? masteryColor : colors.bonus;

    const relevantBonusSources = bonusSources.filter(
        (tool) =>
            ((tool[`${statName}Bonus` as keyof Tool] as
                | number
                | null
                | undefined) ?? 0) > 0
    );

    const bonusTooltipContent = (
        <div>
            <p className="font-bold mb-1">{t("tooltip.bonusFrom")}</p>
            <ul className="list-disc list-inside text-left">
                {relevantBonusSources.map((tool) => (
                    <li key={tool.id}>
                        {t(tool.name)} (+
                        {tool[`${statName}Bonus` as keyof Tool]})
                    </li>
                ))}
            </ul>
        </div>
    );

    const StatRowContent = (
        <div className="w-full">
            <div
                className="flex items-center mb-1 group-hover:text-white transition-colors"
                style={{ color: textColor }}
            >
                <StatIcon
                    stat={statName}
                    className="w-4 h-4 mr-1.5"
                />
                <span className="text-sm capitalize font-medium">
                    {t(statName)}
                </span>
                {isMastered && (
                    <Sparkles
                        className="w-4 h-4 ml-auto"
                        style={{ color: masteryColor }}
                    />
                )}
            </div>

            <div className="flex items-center w-full">
                <div
                    className={`relative flex-grow h-2 bg-slate-600 rounded-full overflow-hidden ${isMastered ? "shadow-[0_0_8px_0px_rgba(255,215,0,0.7)]" : ""}`}
                >
                    <div
                        className="absolute h-full transition-all duration-300 ease-out"
                        style={{
                            width: `${totalValuePercentage}%`,
                            backgroundColor: isMastered
                                ? masteryColor
                                : colors.bonus,
                        }}
                    />
                    <div
                        className="absolute h-full group-hover:brightness-110 transition-all duration-300 ease-out"
                        style={{
                            width: `${basePercentage}%`,
                            backgroundColor: isMastered
                                ? colors.bonus
                                : colors.base,
                        }}
                    />
                </div>
                <span
                    className="text-sm font-monospace ml-3 w-8 text-right group-hover:text-white transition-colors"
                    style={{ color: textColor }}
                >
                    {totalValue}
                </span>
            </div>
        </div>
    );

    return bonusValue > 0 || isMastered ? (
        <Tooltip
            content={bonusTooltipContent}
            className="w-full cursor-help py-1"
        >
            {StatRowContent}
        </Tooltip>
    ) : (
        <div className="w-full py-1">{StatRowContent}</div>
    );
}
