﻿import { ChangeEvent } from "react";
import { Challenge } from "../interfaces/Challenge";

interface ChallengeSelectorProps {
    challenges: Challenge[];
    selectedId: number | null;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    disabled?: boolean;
}

function ChallengeSelector({
    challenges,
    selectedId,
    onChange,
    label = "Kihivás kiválasztása:",
    disabled = false,
}: ChallengeSelectorProps) {
    const selectorId = "challenge-selector";
    return (
        <div className="evo-margin evo-flex">
            <label htmlFor={selectorId} className="evo-challenge-label">{label}</label>
            <select
                id={selectorId}
                name={selectorId}
                className="evo-dropdown evo-margin"
                onChange={onChange}
                value={selectedId ?? ""}
                disabled={disabled || challenges.length === 0}
            >
                <option value="" disabled>
                    Válassz egy kihívást
                </option>
                {challenges.map((chal) => (
                    <option key={chal.id} value={chal.id}>
                        {chal.title}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ChallengeSelector;
