import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Character } from "../interfaces/Character";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";
import { ErrorDictionary } from "../types/common";

interface CharacterFormProps {
    initialData?: Character | null;
    onSubmit: (characterData: Omit<Character, "id"> | Character) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

type CharacterFormData = Omit<Character, "id">;

const defaultFormData: CharacterFormData = {
    name: "",
    bravery: 1,
    trust: 1,
    presence: 1,
    growth: 1,
    care: 1,
};

function CharacterForm({
    initialData,
    onSubmit,
    onCancel,
    isSaving,
}: CharacterFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<CharacterFormData>(() => {
        if (initialData) {
            const { id, ...rest } = initialData;
            return rest;
        }
        return { ...defaultFormData };
    });
    const [errors, setErrors] = useState<ErrorDictionary>({});

    useEffect(() => {
        if (initialData) {
            const { id, ...rest } = initialData;
            setFormData(rest);
        } else {
            setFormData({ ...defaultFormData });
        }
        setErrors({});
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: ErrorDictionary = {};
        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = t("characterNameMinLengthError");
        }
        TRAITS.forEach((trait) => {
            const value = formData[
                trait.property as keyof CharacterFormData
                ];
            if (typeof value === 'number' 
                && (value < 1 || value > 100)) 
            {
                newErrors[trait.property] = t("traitValueError", 
                    { trait: t(trait.property) });
            } else if (typeof value !== 'number') {
                newErrors[trait.property] = t("traitValueNumberError", 
                    { trait: t(trait.property) });
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? 0 : parseInt(value, 10)) || 0 : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (initialData && initialData.id) {
                onSubmit({ ...formData, id: initialData.id });
            } else {
                onSubmit(formData);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="character-form">
            <h3>
                {initialData ? t("editCharacter") : t("addNewCharacter")}
            </h3>

            <div className="form-group">
                <label htmlFor="name">{t("name")}</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={50}
                    required
                />
                {errors.name && (
                    <span className="error-message">{errors.name}</span>
                )}
            </div>

            {TRAITS.map((trait) => (
                <div className="form-group" key={trait.property}>
                    <label htmlFor={trait.property}>{t(trait.property)}:</label>
                    <input
                        type="number"
                        id={trait.property}
                        name={trait.property}
                        className="form-control"
                        value={
                            formData[trait.property as keyof CharacterFormData]
                        }
                        onChange={handleChange}
                        min="1"
                        max="100"
                        required
                    />
                    {errors[trait.property] && (
                        <span className="error-message">
                            {errors[trait.property]}
                        </span>
                    )}
                </div>
            ))}

            <div className="form-actions">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="btn primary"
                >
                    {isSaving
                        ? t("saving")
                        : initialData
                            ? t("saveChanges")
                            : t("addCharacter")}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="btn"
                    >
                        {t("cancel")}
                    </button>
                )}
            </div>
            {errors.form && <p className="error-message">{errors.form}</p>}
        </form>
    );
}
export default CharacterForm;
