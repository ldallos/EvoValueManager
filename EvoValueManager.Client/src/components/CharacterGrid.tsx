import { useState, useMemo, memo } from "react";
import { Search } from "lucide-react";
import { Character } from "../interfaces/Character";
import Card from "./ui/Card";
import { useDebounce } from "../hooks/useDebounce";
import CharacterCard from "./CharacterCard";

interface CharacterGridProps {
    characters: Character[];
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
    characters,
    isLoading,
    selectedCharacterId,
    onCharacterSelect,
}: CharacterGridProps) {
    const [inputValue, setInputValue] = useState("");

    const debouncedSearchTerm = useDebounce(inputValue, 300);

    const filteredCharacters = useMemo(() => {
        if (!characters) return [];
        return characters
            .filter((char) => char.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [characters, debouncedSearchTerm]);

    return (
        <Card className="p-4 sm:p-6 flex flex-col h-[calc(100vh-10rem)] min-h-[600px] text-slate-200">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Select Character</h2>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
            </div>

            <div className="flex-grow overflow-y-auto -m-2 p-2">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredCharacters.length > 0 ? (
                            filteredCharacters.map((char) => (
                                <CharacterCard
                                    key={char.id}
                                    character={char}
                                    isSelected={selectedCharacterId === char.id}
                                    onClick={() => onCharacterSelect(char.id)}
                                />
                            ))
                        ) : (
                            <div className="sm:col-span-2 text-center text-slate-400 pt-10">
                                <p>No characters match your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}

export default memo(CharacterGrid);
