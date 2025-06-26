import { memo } from "react";
import { Character } from "../interfaces/Character";
import { cn } from "../utils/cn";
import { User } from "lucide-react";
import StatIcon, { STAT_NAMES } from "./StatIcon";

interface CharacterCardProps {
    character: Character;
    isSelected: boolean;
    onClick: () => void;
}

function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left rounded-xl border-2 p-4 transition-all duration-200 focus:outline-none focus:ring-4",
                isSelected
                    ? "bg-slate-700 border-indigo-500 shadow-lg ring-indigo-500/50"
                    : "bg-slate-800 border-slate-700 hover:border-slate-600 hover:-translate-y-1"
            )}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 mb-4 flex items-center justify-center border-2 border-slate-600">
                    <User className="w-12 h-12 text-slate-500" />
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg text-white truncate w-full">{character.name}</h3>
                
                <div className="w-full mt-4 grid grid-cols-5 gap-2">
                    {STAT_NAMES.map((stat) => (
                        <div
                            key={stat}
                            className="flex flex-col items-center p-1 bg-slate-900/50 rounded-md"
                        >
                            <StatIcon stat={stat} className="w-5 h-5" />
                            <span className="text-xs font-bold text-slate-300 mt-1">
                                {character[stat]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </button>
    );
}

export default memo(CharacterCard);
