import { ChangeEvent } from "react";
import { Character } from "../interfaces/Character.ts";

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
    label = "Csapattag kiválasztása:",
    disabled = false,
}: CharacterSelectorProps) {
    const selectorId = "character-selector";
    return (
        <div className="evo-margin evo-flex">
            <label htmlFor={selectorId} className="evo-character-label">{label}</label>
            <select
                id={selectorId}
                name={selectorId}
                className="evo-dropdown"
                onChange={onChange}
                value={selectedId ?? ""}
                disabled={disabled || characters.length === 0}
            >
                <option value="" disabled>
                    Válassz egy csapattagot
                </option>
                {characters.map((char) => (
                    <option key={char.id} value={char.id}>
                        {char.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CharacterSelector;
