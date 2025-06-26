import { useQuery } from "@tanstack/react-query";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import { Tool } from "../interfaces/Tool";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";

interface CharacterDetailsProps {
    character: Character;
}

function CharacterDetails({ character }: CharacterDetailsProps) {
    const { t } = useTranslation();

    const { data: assignedTools = [], isLoading: isLoadingTools } = useQuery<Tool[]>({
        queryKey: ["assignedTools", character.id],
        queryFn: () => api.getAssignedToolsForCharacter(character.id),
        enabled: !!character,
    });

    const calculateTotalBonus = (traitProperty: keyof Tool): number => {
        return assignedTools.reduce((sum, tool) => {
            const bonus = tool[traitProperty];
            return sum + (typeof bonus === "number" ? bonus : 0);
        }, 0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                    {t("statsTitleEffective")}
                </h4>
                <div className="space-y-3">
                    {TRAITS.map((trait) => {
                        const baseStat = character[trait.property as keyof Character] as number;
                        const bonus = calculateTotalBonus(`${trait.property}Bonus` as keyof Tool);
                        const effectiveStat = baseStat + bonus;

                        return (
                            <div
                                key={trait.property}
                                className="flex justify-between items-center text-sm"
                            >
                                <span className="font-medium text-gray-600">
                                    {t(trait.property)}:
                                </span>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-800">
                                        {effectiveStat}
                                    </span>
                                    {bonus !== 0 && (
                                        <span className="ml-2 text-xs text-green-600">
                                            ({baseStat}
                                            {bonus > 0 ? "+" : ""}
                                            {bonus})
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                    {t("assignedToolsTitle")}:
                </h4>
                {isLoadingTools ? (
                    <p className="text-sm text-gray-500">{t("loadingToolsForCharacter")}</p>
                ) : (
                    <>
                        {assignedTools.length > 0 ? (
                            <ul className="space-y-2">
                                {assignedTools.map((tool) => (
                                    <li
                                        key={tool.id}
                                        className="p-2 bg-gray-50 rounded-md text-sm text-gray-700"
                                    >
                                        {tool.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">
                                {t("noToolsAssignedToCharacter")}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CharacterDetails;
