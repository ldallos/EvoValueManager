import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, PlusCircle } from "lucide-react";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import CharacterGrid from "../components/CharacterGrid";
import CharacterDashboard from "../components/CharacterDashboard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import CreateCharacterModal from "../components/CreateCharacterModal";

function TeamPage() {
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

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
                Error loading team members: {error.message}
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title="Team Members"
                description="Select a team member to view their profile, manage tools, and assign challenges."
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 xl:col-span-4">
                    {!isLoading && characters.length === 0 ? (
                        <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[600px]">
                            <h3 className="text-xl font-semibold text-white">
                                No Team Members Found
                            </h3>
                            <p className="text-slate-400 mt-1">
                                Get started by adding a new team member.
                            </p>
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={() => setCreateModalOpen(true)}
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Add Member
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
                                Select a Team Member
                            </h3>
                            <p className="text-slate-400 mt-2 max-w-sm">
                                Their complete profile and management tools will appear here.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
            <CreateCharacterModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
        </>
    );
}

export default TeamPage;