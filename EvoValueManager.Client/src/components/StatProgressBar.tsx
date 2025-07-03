import StatIcon from './StatIcon';
import { StatName } from './StatIcon';

interface StatProgressBarProps {
    statName: StatName;
    value: number;
    maxValue?: number;
}

const statColorsHex: { [key: string]: { text: string; bg: string } } = {
    bravery: { text: "#FF8C73", bg: "rgba(237,106,83,0.3)" },
    trust: { text: "#A0A0A0", bg: "rgba(87,86,86,0.3)" },
    presence: { text: "#007A8A", bg: "rgba(0,77,87,0.3)" },
    growth: { text: "#EFFF00", bg: "rgba(211,216,0,0.3)" },
    care: { text: "#2CD05C", bg: "rgba(25,114,48,0.3)" },
};

export function StatProgressBar({ statName, value, maxValue = 100 }: StatProgressBarProps) {
    const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

    const colors = statColorsHex[statName] || { text: "#94A3B8", bg: "rgba(100,116,139,0.3)" };

    return (
        <div className="w-full mb-1">
            {/* Stat Icon and Name */}
            <div className="flex items-center mb-1" style={{ color: colors.text }}>
                <StatIcon stat={statName} className="w-4 h-4 mr-1" />
                <span className="text-sm capitalize font-medium">{statName}</span>
            </div>

            {/* Progress Bar and Value */}
            <div className="flex items-center w-full">
                <div className="relative flex-grow h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: colors.text }}
                    ></div>
                </div>
                <span className="text-xl-center font-monospace ml-2 w-4" style={{ color: colors.text }}>{value}</span>
            </div>
        </div>
    );
}