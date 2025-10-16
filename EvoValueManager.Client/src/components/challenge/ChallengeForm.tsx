import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TRAITS } from "@/constants/traits.ts";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button.tsx";
import Input from "../ui/Input";
import { Challenge } from "@/interfaces/Challenge.ts";
import StatInput from "../ui/StatInput.tsx";
import { StatName } from "../shared/stat-types.ts";

// Helper to capitalize strings for field names
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function createChallengeSchema(t: (key: string) => string) {
    return z.object({
        title: z.string().min(3, t("validation.titleMinLength")),
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
}

type ChallengeFormData = z.infer<ReturnType<typeof createChallengeSchema>>;

interface ChallengeFormProps {
    initialData?: Challenge | null;
    onSubmit: (data: ChallengeFormData & { id?: number }) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

function ChallengeForm({
    initialData,
    onSubmit,
    onCancel,
    isSaving,
}: ChallengeFormProps) {
    const { t } = useTranslation();
    const challengeSchema = createChallengeSchema(t);

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

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
        >
            <h3 className="text-xl font-semibold text-white">
                {initialData
                    ? t("modal.editChallengeTitle")
                    : t("modal.addChallengeTitle")}
            </h3>

            <Input
                label={t("form.challengeName")}
                error={errors.title}
                {...register("title")}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                    <h4 className="font-medium text-slate-300">
                        {t("form.requiredValues")}
                    </h4>
                    {TRAITS.map((trait) => {
                        const fieldName =
                            `required${capitalize(trait.property)}` as keyof ChallengeFormData;
                        return (
                            <StatInput
                                key={fieldName}
                                statName={trait.property as StatName}
                                label={t(trait.property)}
                                error={errors[fieldName]}
                                {...register(fieldName)}
                            />
                        );
                    })}
                </div>

                <div className="space-y-4">
                    <h4 className="font-medium text-slate-300">
                        {t("form.gainableValues")}
                    </h4>
                    {TRAITS.map((trait) => {
                        const fieldName =
                            `gainable${capitalize(trait.property)}` as keyof ChallengeFormData;
                        return (
                            <StatInput
                                key={fieldName}
                                statName={trait.property as StatName}
                                label={t(trait.property)}
                                error={errors[fieldName]}
                                {...register(fieldName)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText={t("common.saving")}
                >
                    {isSaving
                        ? t("common.saving")
                        : initialData
                          ? t("common.saveChanges")
                          : t("form.addChallenge")}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        {t("common.cancel")}
                    </Button>
                )}
            </div>
        </form>
    );
}

export default ChallengeForm;
