import { ChangeEvent } from "react";
import { Character } from "../interfaces/Character.ts";
import Select from "./ui/Select";
import { useTranslation } from "react-i18next";

interface CharacterSelectorProps {
    characters: Character[];
    selectedId: number | null;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    disabled?: boolean;
}

function CharacterSelector({
    characters,
    selectedId,
    onChange,
    label,
    disabled = false,
}: CharacterSelectorProps) {
    const { t } = useTranslation();
    const displayLabel = label || t("characterSelect");

    return (
        <Select
            label={displayLabel}
            name="character-selector"
            onChange={onChange}
            value={selectedId ?? ""}
            disabled={disabled || characters.length === 0}
        >
            <option value="" disabled>
                {t("selectACharacter")}
            </option>
            {characters.map((char) => (
                <option key={char.id} value={char.id}>
                    {char.name}
                </option>
            ))}
        </Select>
    );
}

export default CharacterSelector;
