import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, PlusCircle } from "lucide-react";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import CharacterGrid from "../components/CharacterGrid";
import CharacterDashboard from "../components/CharacterDashboard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function CharacterPage() {
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

    const {
        data: characters = [],
        isLoading,
        error,
    } = useQuery<Character[], Error>({
        queryKey: ["characters"],
        queryFn: api.getCharacters,
        staleTime: 1000 * 60 * 5,
    });

    const handleSelectCharacter = (id: number) => {
        setSelectedCharacterId((prevId) => (prevId === id ? null : id));
    };

    if (error) {
        return (
            <div className="text-center text-red-400 p-10">
                Error loading characters: {error.message}
            </div>
        );
    }

    return (
        <div className="bg-slate-900 text-slate-200 font-sans -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-screen-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Characters
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Select a character
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 xl:col-span-4">
                        {!isLoading && characters.length === 0 ? (
                            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[600px]">
                                <h3 className="text-xl font-semibold text-white">
                                    No Characters Found
                                </h3>
                                <p className="text-slate-400 mt-1">
                                    Get started by creating a new character.
                                </p>
                                <Button
                                    variant="primary"
                                    className="mt-4"
                                    onClick={() => {
                                    }}
                                >
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Create Character
                                </Button>
                            </Card>
                        ) : (
                            <CharacterGrid
                                characters={characters}
                                isLoading={isLoading}
                                selectedCharacterId={selectedCharacterId}
                                onCharacterSelect={handleSelectCharacter}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-7 xl:col-span-8">
                        {selectedCharacterId ? (
                            <CharacterDashboard
                                key={selectedCharacterId}
                                characterId={selectedCharacterId}
                            />
                        ) : (
                            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[600px] border-2 border-dashed border-slate-700 bg-slate-800/30">
                                <User className="w-16 h-16 text-slate-500 mb-4" />
                                <h3 className="text-2xl font-semibold text-white">
                                    Select a Character
                                </h3>
                                <p className="text-slate-400 mt-2 max-w-sm">
                                    Select a character
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharacterPage;
