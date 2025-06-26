import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Character } from "../interfaces/Character";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import Input from "./ui/Input";

const characterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long."),
    bravery: z.coerce.number().int().min(1).max(100),
    trust: z.coerce.number().int().min(1).max(100),
    presence: z.coerce.number().int().min(1).max(100),
    growth: z.coerce.number().int().min(1).max(100),
    care: z.coerce.number().int().min(1).max(100),
});

type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormProps {
    initialData?: Character | null;
    onSubmit: (data: CharacterFormData & { id?: number }) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

function CharacterForm({ initialData, onSubmit, onCancel, isSaving }: CharacterFormProps) {
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
            reset({ name: "", bravery: 1, trust: 1, presence: 1, growth: 1, care: 1 });
        }
    }, [initialData, reset]);

    const handleFormSubmit = (data: CharacterFormData) => {
        onSubmit({ ...data, id: initialData?.id });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
                {initialData ? t("editCharacter") : t("addNewCharacter")}
            </h3>

            <Input label={t("name")} error={errors.name} {...register("name")} />

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                {TRAITS.map((trait) => (
                    <Input
                        key={trait.property}
                        label={t(trait.property)}
                        type="number"
                        min="1"
                        max="100"
                        error={errors[trait.property as keyof CharacterFormData]}
                        {...register(trait.property as keyof CharacterFormData)}
                    />
                ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText={t("saving")}
                >
                    {isSaving ? t("saving") : initialData ? t("saveChanges") : t("addCharacter")}
                </Button>
                {onCancel && (
                    <Button type="button" onClick={onCancel} disabled={isSaving}>
                        {t("cancel")}
                    </Button>
                )}
            </div>
        </form>
    );
}

export default CharacterForm;
