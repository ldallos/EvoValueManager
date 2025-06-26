import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tool } from "../interfaces/Tool";
import { TRAITS } from "../constants/traits";
import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import Input from "./ui/Input";

const toolSchema = z.object({
    name: z.string().min(1, "Tool name is required."),
    description: z.string().max(500, "Description is too long.").optional().nullable(),
    braveryBonus: z.coerce.number().min(0, "Bonus must be positive.").optional().nullable(),
    trustBonus: z.coerce.number().min(0, "Bonus must be positive.").optional().nullable(),
    presenceBonus: z.coerce.number().min(0, "Bonus must be positive.").optional().nullable(),
    growthBonus: z.coerce.number().min(0, "Bonus must be positive.").optional().nullable(),
    careBonus: z.coerce.number().min(0, "Bonus must be positive.").optional().nullable(),
});

type ToolFormData = z.infer<typeof toolSchema>;

interface ToolFormProps {
    initialData?: Tool | null;
    onSubmit: (data: ToolFormData & { id?: number }) => void;
    onCancel?: () => void;
    isSaving: boolean;
}

function ToolForm({ initialData, onSubmit, onCancel, isSaving }: ToolFormProps) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ToolFormData>({
        resolver: zodResolver(toolSchema),
        defaultValues: initialData || {},
    });

    useEffect(() => {
        reset(initialData || {});
    }, [initialData, reset]);

    const handleFormSubmit = (data: ToolFormData) => {
        onSubmit({ ...data, id: initialData?.id });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
                {initialData ? t("toolEdit") : t("toolAdd")}
            </h3>

            <Input label={t("toolIdentifier")} error={errors.name} {...register("name")} />

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t("description")}:
                </label>
                <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-evogreen focus:border-evogreen sm:text-sm"
                    {...register("description")}
                />
            </div>

            <fieldset>
                <legend className="text-lg font-medium text-gray-900">{t("valueBonuses")}</legend>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TRAITS.map((trait) => (
                        <Input
                            key={trait.property}
                            label={`${t(trait.property)} ${t("bonus")}`}
                            type="number"
                            min="0"
                            placeholder="0"
                            error={errors[`${trait.property}Bonus` as keyof ToolFormData]}
                            {...register(`${trait.property}Bonus` as keyof ToolFormData)}
                        />
                    ))}
                </div>
            </fieldset>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    loadingText={t("saving")}
                >
                    {initialData ? t("saveChanges") : t("toolAddButton")}
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

export default ToolForm;
