import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Challenge } from "../interfaces/Challenge";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface ChallengeFormProps {
  initialData?: Challenge | null;
  onSubmit: (challengeData: Omit<Challenge, "id"> | Challenge) => void;
  onCancel?: () => void;
  isSaving: boolean;
}

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

function ChallengeForm({
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: ChallengeFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<Challenge, "id"> | Challenge>(
    initialData ? { ...initialData } : { ...defaultFormData },
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(initialData ? { ...initialData } : { ...defaultFormData });
    setErrors({});
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = "Title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // @ts-ignore
  const renderStatInput = (
    statType: "required" | "gainable",
    traitProperty: string,
    traitTitle: string,
  ) => {
    const name = (`${statType}` +
      capitalize(`${traitProperty}`)) as keyof Challenge;
    const value = (formData as Challenge)[name] as number | null | undefined;

    return (
      <div className="form-group form-group-stat" key={name}>
        <label htmlFor={name}>{traitTitle}:</label>
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
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="challenge-form">
      <h3>{initialData ? "Kihívás szerkesztése" : "Új kihivás hozzáadása"}</h3>

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
        <legend>Kötelező értékek</legend>
        <div className="stats-grid">
          {TRAITS.map((trait) =>
            renderStatInput("required", trait.property, trait.title),
          )}
        </div>
      </fieldset>

      <fieldset className="stats-fieldset">
        <legend>Szerezhető értékek</legend>
        <div className="stats-grid">
          {TRAITS.map((trait) =>
            renderStatInput("gainable", trait.property, trait.title),
          )}
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : initialData
              ? "Változtatások mentése"
              : "Kihivás hozzáadása"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSaving}>
            Mégsem
          </button>
        )}
      </div>
    </form>
  );
}

export default ChallengeForm;
