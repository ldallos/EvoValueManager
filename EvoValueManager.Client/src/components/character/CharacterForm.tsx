import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Character } from "@/interfaces/Character.ts";
import { TRAITS } from "@/constants/traits.ts";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import Input from "../ui/Input";
import StatInput from "../ui/StatInput";
import { StatName } from "../shared/stat-types";

const characterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    title: z.string().optional().nullable(),
    bravery: z.coerce.number().int().min(1).max(100),
    trust: z.coerce.number().int().min(1).max(100),
    presence: z.coerce.number().int().min(1).max(100),
    growth: z.coerce.number().int().min(1).max(100),
    care: z.coerce.number().int().min(1).max(100),
});

type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormProps {
    initialData?: Character | null;
    onSubmit: (data: CharacterFormData) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

function CharacterForm({
    initialData,
    onSubmit,
    onCancel,
    isSaving,
}: CharacterFormProps) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CharacterFormData>({
        resolver: zodResolver(characterSchema),
        defaultValues: initialData || {
            name: "",
            title: "",
            bravery: 1,
            trust: 1,
            presence: 1,
            growth: 1,
            care: 1,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: "",
                title: "",
                bravery: 1,
                trust: 1,
                presence: 1,
                growth: 1,
                care: 1,
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: CharacterFormData) => {
        onSubmit(data);
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            <h3 className="text-xl font-semibold text-white">
                {initialData ? t("editCharacter") : t("addNewCharacter")}
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                    label={t("name")}
                    error={errors.name}
                    {...register("name")}
                />
                <Input
                    label={t("title", "Title")}
                    error={errors.title}
                    {...register("title")}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TRAITS.map((trait) => (
                    <StatInput
                        key={trait.property}
                        statName={trait.property as StatName}
                        label={t(trait.property)}
                        error={
                            errors[trait.property as keyof CharacterFormData]
                        }
                        {...register(trait.property as keyof CharacterFormData)}
                    />
                ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText={t("saving")}
                >
                    {isSaving
                        ? t("saving")
                        : initialData
                          ? t("saveChanges")
                          : t("addCharacter")}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        {t("cancel")}
                    </Button>
                )}
            </div>
        </form>
    );
}

export default CharacterForm;
