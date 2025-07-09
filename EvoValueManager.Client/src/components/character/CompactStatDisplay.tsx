import { STAT_NAMES } from "@/components/shared/stat-types.ts";
import { Character } from "@/interfaces/Character.ts";
import { Tool } from "@/interfaces/Tool.ts";
import { StatProgressBar } from "../shared/StatProgressBar.tsx";

interface CompactStatDisplayProps {
    baseCharacter: Character;
    effectiveCharacter: Character;
    toolSources: Tool[];
}

export default function CompactStatDisplay({
    baseCharacter,
    effectiveCharacter,
    toolSources,
}: CompactStatDisplayProps) {
    return (
        <div className="flex flex-col items-start w-full">
            {STAT_NAMES.map((stat) => {
                const baseValue = baseCharacter[stat];
                const effectiveValue = effectiveCharacter[stat];
                const bonusValue = effectiveValue - baseValue;

                return (
                    <StatProgressBar
                        key={stat}
                        statName={stat}
                        baseValue={baseValue}
                        bonusValue={bonusValue}
                        bonusSources={toolSources}
                    />
                );
            })}
        </div>
    );
}
