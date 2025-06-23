import { ChangeEvent } from 'react';
import { Tool } from '../interfaces/Tool';
import { useTranslation } from 'react-i18next';

interface ToolSelectorProps {
    tools: Tool[];
    selectedId: number | null;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    disabled?: boolean;
}

function ToolSelector({
                          tools,
                          selectedId,
                          onChange,
                          label,
                          disabled = false
                      }: ToolSelectorProps) {
    const { t } = useTranslation();
    const displayLabel = label || t('selectTool');
    const selectorId = "tool-selector";
    return (
        <div className="evo-margin evo-flex">
            <label htmlFor={selectorId} className="evo-character-label">{displayLabel}</label>
            <select
                id={selectorId}
                name={selectorId}
                className="evo-dropdown evo-margin"
                onChange={onChange}
                value={selectedId ?? ""}
                disabled={disabled || tools.length === 0}
            >
                <option value="" disabled>{t('selectATool')}</option>
                {tools.map(tool => (
                    <option key={tool.id} value={tool.id}>
                        {tool.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ToolSelector;