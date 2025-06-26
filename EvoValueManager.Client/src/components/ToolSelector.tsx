import { ChangeEvent } from "react";
import { Tool } from "../interfaces/Tool";
import { useTranslation } from "react-i18next";
import Select from "./ui/Select";

interface ToolSelectorProps {
    tools: Tool[];
    selectedId: number | null;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    disabled?: boolean;
}

function ToolSelector({ tools, selectedId, onChange, label, disabled = false }: ToolSelectorProps) {
    const { t } = useTranslation();
    const displayLabel = label || t("selectTool");

    return (
        <Select
            label={displayLabel}
            name="tool-selector"
            onChange={onChange}
            value={selectedId ?? ""}
            disabled={disabled || tools.length === 0}
        >
            <option value="" disabled>
                {t("selectATool")}
            </option>
            {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                    {tool.name}
                </option>
            ))}
        </Select>
    );
}

export default ToolSelector;
