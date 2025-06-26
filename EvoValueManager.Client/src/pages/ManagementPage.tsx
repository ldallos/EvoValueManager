import { useState, ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import CharacterSelector from "../components/CharacterSelector";
import ManagementDashboard from "../components/ManagementDashboard";
import { useTranslation } from "react-i18next";

function ManagementPage() {
    const { t } = useTranslation();
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

    const {
        data: characters = [],
        isLoading,
        error,
    } = useQuery<Character[], Error>({
        queryKey: ["characters"],
        queryFn: api.getCharacters,
    });

    const handleCharacterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const id = event.target.value ? Number(event.target.value) : null;
        setSelectedCharacterId(id);
    };

    if (isLoading) return <div className="text-center p-10">{t("loadingCharacters")}...</div>;
    if (error)
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {t("errorLoadingPage")}: {error.message}
            </div>
        );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {t("managementTitle")}
            </h1>

            <div className="bg-white p-4 rounded-lg shadow">
                <CharacterSelector
                    characters={characters}
                    selectedId={selectedCharacterId}
                    onChange={handleCharacterSelect}
                    label={t("selectCharacterToManage")}
                />
            </div>

            {selectedCharacterId && (
                <ManagementDashboard key={selectedCharacterId} characterId={selectedCharacterId} />
            )}
        </div>
    );
}

export default ManagementPage;
