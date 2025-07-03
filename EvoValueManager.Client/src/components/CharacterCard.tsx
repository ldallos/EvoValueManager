import { memo } from "react";
import { Character } from "../interfaces/Character";
import { cn } from "../utils/cn";
import { User } from "lucide-react";
import CompactStatDisplay from "./CompactStatDisplay.tsx";

interface CharacterCardProps {
    character: Character;
    isSelected: boolean;
    onClick: () => void;
}

function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
    const avatarSrc = `/api/Character/${character.id}/avatar`;

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
            <div className="flex flex-col items-center w-full">
                {/* Top Section: Avatar, Title, and Name */}
                <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-2">
                        {character.hasAvatar ? (
                            <img
                                className="w-20 h-20 rounded-full object-cover"
                                src={avatarSrc}
                                alt={character.name}
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                                <User className="w-10 h-10 text-slate-500" />
                            </div>
                        )}
                        {character.title && (
                            <div className="absolute -bottom-1 w-full flex justify-center">
                                <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded-full uppercase">
                                    {character.title}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Character Name under Avatar */}
                    <p className="font-semibold text-white text-lg text-center truncate w-full max-w-sm px-2">
                        {character.name}
                    </p>
                </div>

                {/* Bottom Section: Compact Stat Display */}
                <div className="w-full max-w-sm">
                    <CompactStatDisplay character={character} />
                </div>
            </div>
        </button>
    );
}

export default memo(CharacterCard);