import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Tool } from "../interfaces/Tool";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";

interface ToolFormProps {
    initialData?: Tool | null;
    onSubmit: (toolData: Omit<Tool, "id"> | Tool) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

type ToolBonusKey = "braveryBonus" | "trustBonus" | "presenceBonus" | "growthBonus" | "careBonus";

const defaultFormData: Omit<Tool, "id"> = {
    name: "",
    description: "",
    braveryBonus: null,
    trustBonus: null,
    presenceBonus: null,
    growthBonus: null,
    careBonus: null,
};

function ToolForm({
                      initialData,
                      onSubmit,
                      onCancel,
                      isSaving,
                  }: ToolFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<Tool, "id"> | Tool>(
        initialData ? { ...initialData } : { ...defaultFormData },
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setFormData(initialData ? { ...initialData } : { ...defaultFormData });
        setErrors({});
    }, [initialData]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name || formData.name.trim().length === 0) {
            newErrors.name = "Eszköz azonosító (név) kötelező.";
        }

        TRAITS.forEach(trait => {
            const bonusValueKey = `${trait.property}Bonus` as ToolBonusKey;
            const bonusValue = formData[bonusValueKey];

            if (bonusValue != null && bonusValue < 0) {
                newErrors[bonusValueKey] = `${trait.title} bónusz nem lehet negatív.`;
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
            onSubmit(formData);
        }
    };

    const renderBonusInput = (traitProperty: string, traitTitle: string) => {
        const name = `${traitProperty}Bonus` as ToolBonusKey;
        const value = formData[name];

        return (
            <div className="form-group form-group-stat" key={name}>
                <label htmlFor={name}>{traitTitle} bónusz:</label>
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
            <h3>{initialData ? t("toolEdit") : t("toolAdd")}</h3>

            <div className="form-group">
                <label htmlFor="name">{t("toolIdentifier")}:</label>
                <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={1}
                    maxLength={100}
                    required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="description">{t("description")}:</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description ?? ""}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <fieldset className="stats-fieldset">
                <legend>{t("valueBonuses")}</legend>
                <div className="stats-grid">
                    {TRAITS.map((trait) =>
                        renderBonusInput(trait.property, trait.title),
                    )}
                </div>
            </fieldset>

            <div className="form-actions">
                <button type="submit" disabled={isSaving} className="btn primary">
                    {isSaving
                        ? t("saving")
                        : initialData
                            ? t("saveChanges")
                            : t("toolAddButton")}
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

export default ToolForm;