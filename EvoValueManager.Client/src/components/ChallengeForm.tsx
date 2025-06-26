import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Challenge } from "../interfaces/Challenge";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";
import { ErrorDictionary } from "../types/common";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface ChallengeFormProps {
    initialData?: Challenge | null;
    onSubmit: (challengeData: Omit<Challenge, "id"> | Challenge) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

type ChallengeStatKey = Exclude<keyof Omit<Challenge, "id" | "title">, undefined>;

const defaultFormData: Omit<Challenge, "id"> = {
    title: "",
    requiredBravery: null,
    requiredTrust: null,
    requiredPresence: null,
    requiredGrowth: null,
    requiredCare: null,
    gainableBravery: null,
    gainableTrust: null,
    gainablePresence: null,
    gainableGrowth: null,
    gainableCare: null,
};

function ChallengeForm({ initialData, onSubmit, onCancel, isSaving }: ChallengeFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<Challenge, "id"> | Challenge>(
        initialData ? { ...initialData } : { ...defaultFormData }
    );
    const [errors, setErrors] = useState<ErrorDictionary>({});

    useEffect(() => {
        setFormData(initialData ? { ...initialData } : { ...defaultFormData });
        setErrors({});
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: ErrorDictionary = {};
        if (!formData.title || formData.title.trim().length === 0) {
            newErrors.title = t("titleRequiredError");
        }

        TRAITS.forEach((trait) => {
            const reqKey = `required${capitalize(trait.property)}` as ChallengeStatKey;
            const gainKey = `gainable${capitalize(trait.property)}` as ChallengeStatKey;
            const reqValue = formData[reqKey];
            const gainValue = formData[gainKey];

            if (reqValue != null && reqValue < 0) {
                newErrors[reqKey] = t("valueCannotBeNegativeError", {
                    trait: t(trait.property),
                    type: t("required"),
                });
            }
            if (gainValue != null && gainValue < 0) {
                newErrors[gainKey] = t("valueCannotBeNegativeError", {
                    trait: t(trait.property),
                    type: t("gainable"),
                });
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let processedValue: string | number | null = value;
        if (type === "number") {
            processedValue = value === "" ? null : parseInt(value, 10);
            if (isNaN(processedValue as number)) {
                processedValue = null;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (initialData && initialData.id) {
                onSubmit({ ...formData, id: initialData.id } as Challenge);
            } else {
                onSubmit(formData);
            }
        }
    };

    const renderStatInput = (statType: "required" | "gainable", traitProperty: string) => {
        const name = (`${statType}` + capitalize(traitProperty)) as ChallengeStatKey;
        const value = formData[name];

        return (
            <div className="form-group form-group-stat" key={name}>
                <label htmlFor={name}>
                    {t(traitProperty)}({statType === "required" ? t("required") : t("gainable")}):
                </label>
                <input
                    className="form-control"
                    type="number"
                    id={name}
                    name={name}
                    value={value ?? ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                />
                {errors[name] && <span className="error-message">{errors[name]}</span>}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="challenge-form">
            <h3>{initialData ? t("editChallenge") : t("addNewChallenge")}</h3>

            <div className="form-group">
                <label htmlFor="title">{t("challengeName")}</label>
                <input
                    className="form-control"
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={100}
                    required
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <fieldset className="stats-fieldset">
                <legend>{t("requiredValues")}</legend>
                <div className="stats-grid">
                    {TRAITS.map((trait) => renderStatInput("required", trait.property))}
                </div>
            </fieldset>

            <fieldset className="stats-fieldset">
                <legend>{t("gainableValues")}</legend>
                <div className="stats-grid">
                    {TRAITS.map((trait) => renderStatInput("gainable", trait.property))}
                </div>
            </fieldset>

            <div className="form-actions">
                <button type="submit" disabled={isSaving} className="btn primary">
                    {isSaving ? t("saving") : initialData ? t("saveChanges") : t("addChallenge")}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={isSaving} className="btn">
                        {t("cancel")}
                    </button>
                )}
            </div>
        </form>
    );
}

export default ChallengeForm;
