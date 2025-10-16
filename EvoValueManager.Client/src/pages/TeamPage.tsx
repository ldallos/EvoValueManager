import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import CharacterGrid from "@/components/character/CharacterGrid.tsx";
import CharacterDashboard from "@/components/character/CharacterDashboard.tsx";
import Card from "@/components/ui/Card.tsx";
import PageHeader from "@/components/ui/PageHeader.tsx";
import { useCharacterData } from "@/hooks/useCharacterData.ts";
import { useTranslation } from "react-i18next";
import ToolManagementModal from "@/components/tool/ToolManagementModal.tsx";
import ChallengeManagementModal from "@/components/challenge/ChallengeManagementModal.tsx";

function TeamPage() {
    const [selectedCharacterId, setSelectedCharacterId] = useState<
        number | null
    >(null);
    const [isToolModalOpen, setToolModalOpen] = useState(false);
    const [isChallengeModalOpen, setChallengeModalOpen] = useState(false);

    const {
        baseCharacters,
        effectiveCharacters,
        toolsByCharacterId,
        isLoading,
    } = useCharacterData();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const charIdFromUrl = params.get("characterId");

        if (charIdFromUrl) {
            const characterId = parseInt(charIdFromUrl, 10);
            if (effectiveCharacters.some((c) => c.id === characterId)) {
                setSelectedCharacterId(characterId);
            }
        }
    }, [location.search, effectiveCharacters]);

    const selectedBaseCharacter = useMemo(() => {
        if (!selectedCharacterId) return null;
        return baseCharacters.find((c) => c.id === selectedCharacterId) || null;
    }, [selectedCharacterId, baseCharacters]);

    const handleSelectCharacter = (id: number) => {
        setSelectedCharacterId(id);
    };

    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t("team.title")}
                description={t("team.description")}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    {!isLoading && effectiveCharacters.length === 0 ? (
                        <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-[600px]">
                            <h3 className="text-xl font-semibold text-white">
                                {t("team.noMembersFound")}
                            </h3>
                            <p className="text-slate-400 mt-2">
                                {t("team.goTo")}{" "}
                                <Link
                                    to="/library/team"
                                    className="font-semibold text-indigo-400 hover:underline"
                                >
                                    {t("team.libraryLink")}
                                </Link>{" "}
                                {t("team.toAddNewMember")}
                            </p>
                        </Card>
                    ) : (
                        <CharacterGrid
                            baseCharacters={baseCharacters}
                            effectiveCharacters={effectiveCharacters}
                            toolsByCharacterId={toolsByCharacterId}
                            isLoading={isLoading}
                            selectedCharacterId={selectedCharacterId}
                            onCharacterSelect={handleSelectCharacter}
                        />
                    )}
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    {selectedCharacterId && selectedBaseCharacter ? (
                        <CharacterDashboard
                            key={selectedCharacterId}
                            characterId={selectedCharacterId}
                            initialBaseCharacter={selectedBaseCharacter}
                            onOpenToolModal={() => setToolModalOpen(true)}
                            onOpenChallengeModal={() =>
                                setChallengeModalOpen(true)
                            }
                        />
                    ) : (
                        <Card className="p-10 flex flex-col items-center justify-center text-center h-auto min-h-[600px] border-2 border-dashed border-slate-700 bg-slate-800/30">
                            <User className="w-16 h-16 text-slate-500 mb-4" />
                            <h3 className="text-2xl font-semibold text-white">
                                {t("team.selectMemberPromptTitle")}
                            </h3>
                            <p className="text-slate-400 mt-2 max-w-sm">
                                {t("team.selectMemberPromptDescription")}
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {selectedBaseCharacter && (
                <>
                    <ToolManagementModal
                        isOpen={isToolModalOpen}
                        onClose={() => setToolModalOpen(false)}
                        character={selectedBaseCharacter}
                    />
                    <ChallengeManagementModal
                        isOpen={isChallengeModalOpen}
                        onClose={() => setChallengeModalOpen(false)}
                        character={selectedBaseCharacter}
                    />
                </>
            )}
        </>
    );
}

export default TeamPage;
