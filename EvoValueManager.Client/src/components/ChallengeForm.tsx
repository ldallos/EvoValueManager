import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Challenge } from "../interfaces/Challenge";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import Input from "./ui/Input";

const challengeSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    requiredBravery: z.coerce.number().min(0).optional().nullable(),
    requiredTrust: z.coerce.number().min(0).optional().nullable(),
    requiredPresence: z.coerce.number().min(0).optional().nullable(),
    requiredGrowth: z.coerce.number().min(0).optional().nullable(),
    requiredCare: z.coerce.number().min(0).optional().nullable(),
    gainableBravery: z.coerce.number().min(0).optional().nullable(),
    gainableTrust: z.coerce.number().min(0).optional().nullable(),
    gainablePresence: z.coerce.number().min(0).optional().nullable(),
    gainableGrowth: z.coerce.number().min(0).optional().nullable(),
    gainableCare: z.coerce.number().min(0).optional().nullable(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
    initialData?: Challenge | null;
    onSubmit: (data: ChallengeFormData & { id?: number }) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

function ChallengeForm({ initialData, onSubmit, onCancel, isSaving }: ChallengeFormProps) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChallengeFormData>({
        resolver: zodResolver(challengeSchema),
        defaultValues: initialData || { title: "" },
    });

    useEffect(() => {
        reset(initialData || { title: "" });
    }, [initialData, reset]);

    const handleFormSubmit = (data: ChallengeFormData) => {
        onSubmit({ ...data, id: initialData?.id });
    };

    const renderStatInput = (statType: "required" | "gainable", property: string) => {
        const name = `${statType}${property.charAt(0).toUpperCase() + property.slice(1)}` as keyof ChallengeFormData;
        return (
            <Input
                key={name}
                label={`${t(property)} (${t(statType)})`}
                type="number"
                min="0"
                placeholder="0"
                error={errors[name]}
                {...register(name)}
            />
        )
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
                {initialData ? t("editChallenge") : t("addNewChallenge")}
            </h3>

            <Input label={t("challengeName")} error={errors.title} {...register("title")} />

            <fieldset className="space-y-4 rounded-lg border border-slate-700 p-4">
                <legend className="px-2 font-medium text-slate-300">{t("requiredValues")}</legend>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TRAITS.map((trait) => renderStatInput("required", trait.property))}
                </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border border-slate-700 p-4">
                <legend className="px-2 font-medium text-slate-300">{t("gainableValues")}</legend>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TRAITS.map((trait) => renderStatInput("gainable", trait.property))}
                </div>
            </fieldset>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button type="submit" variant="primary" isLoading={isSaving} loadingText={t("saving")}>
                    {isSaving ? t("saving") : initialData ? t("saveChanges") : t("addChallenge")}
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

export default ChallengeForm;