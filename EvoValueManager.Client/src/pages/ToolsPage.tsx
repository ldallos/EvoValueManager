﻿import { useState, useEffect, ChangeEvent } from "react";
import * as api from "../api/api";
import { Tool } from "../interfaces/Tool";
import ToolSelector from "../components/ToolSelector";
import ToolForm from "../components/ToolForm";
import { useTranslation } from "react-i18next";

function ToolsPage() {
    const { t } = useTranslation();
    const [tools, setTools] = useState<Tool[]>([]);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        const loadTools = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await api.getTools();
                setTools(data);
            } catch (err) {
                setError("Failed to load tools.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTools();
    }, []);

    const handleSelectTool = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(event.target.value);
        const tool = tools.find((t) => t.id === selectedId) || null;
        setSelectedTool(tool);
        setShowAddForm(false);
    };

    const toggleAddToolForm = () => {
        setShowAddForm((prev) => !prev);
        setSelectedTool(null);
    };

    const handleFormSubmit = async (toolData: Omit<Tool, "id"> | Tool) => {
        setIsSaving(true);
        setError(null);
        try {
            if ("id" in toolData) {
                await api.updateTool(toolData.id, toolData);
                setTools((prev) =>
                    prev.map((t) => (t.id === toolData.id ? toolData : t)),
                );
                setSelectedTool(toolData);
                alert(t('toolUpdatedAlert'));
            } else {
                const newTool = await api.createTool(toolData);
                setTools((prev) => [...prev, newTool]);
                setShowAddForm(false);
                alert(t('toolAddedAlert'));
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                t('failedToSaveToolError');
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <p>{t('loadingTools')}</p>;

    return (
        <div className="page-container">
            <h1>{t('toolsTitle')}</h1>
            {error && !isSaving && (
                <p className="error-message">{t('errorLoadingPage')}: {error}</p>
            )}

            <ToolSelector
                tools={tools}
                selectedId={selectedTool?.id ?? null}
                onChange={handleSelectTool}
                disabled={isLoading || isSaving}
            />

            <button
                onClick={toggleAddToolForm}
                disabled={isLoading || isSaving}
                className="evo-margin btn"
            >
                {showAddForm ? t('back') : t('addNewToolButton')}
            </button>

            {error && isSaving && <p className="error-message">{error}</p>}

            {(showAddForm || (selectedTool && !showAddForm)) && (
                <ToolForm
                    key={selectedTool?.id ?? "new-tool"}
                    initialData={showAddForm ? null : selectedTool}
                    onSubmit={handleFormSubmit}
                    onCancel={showAddForm ? toggleAddToolForm : undefined}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}

export default ToolsPage;