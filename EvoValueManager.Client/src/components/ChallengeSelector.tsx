import { ChangeEvent } from "react";
import { Challenge } from "../interfaces/Challenge";
import Select from "./ui/Select";
import { useTranslation } from "react-i18next";

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
    label,
    disabled = false,
}: ChallengeSelectorProps) {
    const { t } = useTranslation();
    const displayLabel = label || t("challengeSelect");

    return (
        <Select
            label={displayLabel}
            name="challenge-selector"
            onChange={onChange}
            value={selectedId ?? ""}
            disabled={disabled || challenges.length === 0}
        >
            <option value="" disabled>
                {t("selectAChallenge")}
            </option>
            {challenges.map((chal) => (
                <option key={chal.id} value={chal.id}>
                    {chal.title}
                </option>
            ))}
        </Select>
    );
}

export default ChallengeSelector;
