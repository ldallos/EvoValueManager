import { useState, useMemo, memo } from "react";
import { Search } from "lucide-react";
import { Character } from "@/interfaces/Character.ts";
import Card from "../ui/Card.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";
import CharacterCard from "./CharacterCard";
import AnimatedDiv from "../ui/AnimatedDiv.tsx";
import { Tool } from "@/interfaces/Tool.ts";
import { useTranslation } from "react-i18next";

interface CharacterGridProps {
    baseCharacters: Character[];
    effectiveCharacters: Character[];
    toolsByCharacterId: Map<number, Tool[]>;
    isLoading: boolean;
    selectedCharacterId: number | null;
    onCharacterSelect: (id: number) => void;
}

const SkeletonCard = () => (
    <div className="w-full rounded-xl bg-slate-800 p-4 animate-pulse">
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-slate-700 mb-4"></div>
            <div className="h-5 bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="w-full h-12 bg-slate-700 rounded-md"></div>
        </div>
    </div>
);

function CharacterGrid({
    baseCharacters,
    effectiveCharacters,
    isLoading,
    selectedCharacterId,
    onCharacterSelect,
    toolsByCharacterId,
}: CharacterGridProps) {
    const [inputValue, setInputValue] = useState("");
    const debouncedSearchTerm = useDebounce(inputValue, 300);

    const baseCharsById = useMemo(
        () => new Map(baseCharacters.map((c) => [c.id, c])),
        [baseCharacters]
    );

    const filteredCharacters = useMemo(() => {
        if (!effectiveCharacters) return [];
        return effectiveCharacters
            .filter((char) =>
                char.name
                    .toLowerCase()
                    .includes(debouncedSearchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [effectiveCharacters, debouncedSearchTerm]);

    const { t } = useTranslation();

    return (
        <Card className="p-4 sm:p-6 flex flex-col h-[calc(90vh-10rem)] min-h-[600px] text-slate-200">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">
                {t("characterGrid.title")}
            </h2>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder={t("characterGrid.searchPlaceholder")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
            </div>

            <div className="flex-grow overflow-y-auto -m-2 p-2 no-scrollbar">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
                        {filteredCharacters.length > 0 ? (
                            filteredCharacters.map((effectiveChar, index) => {
                                const baseChar = baseCharsById.get(
                                    effectiveChar.id
                                );
                                const toolSources =
                                    toolsByCharacterId.get(effectiveChar.id) ||
                                    [];
                                if (!baseChar) return null;

                                return (
                                    <AnimatedDiv
                                        key={effectiveChar.id}
                                        delay={index}
                                    >
                                        <CharacterCard
                                            baseCharacter={baseChar}
                                            effectiveCharacter={effectiveChar}
                                            toolSources={toolSources}
                                            isSelected={
                                                selectedCharacterId ===
                                                effectiveChar.id
                                            }
                                            onClick={() =>
                                                onCharacterSelect(
                                                    effectiveChar.id
                                                )
                                            }
                                        />
                                    </AnimatedDiv>
                                );
                            })
                        ) : (
                            <div className="text-center text-slate-400 pt-10">
                                <p>{t("characterGrid.noMatch")}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}

export default memo(CharacterGrid);
