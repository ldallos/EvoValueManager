import { useState, useEffect, ChangeEvent } from 'react';
import * as api from '../api/api';
import { Character } from '../interfaces/Character';
import { Tool } from '../interfaces/Tool';
import CharacterSelector from '../components/CharacterSelector';
import ToolSelector from '../components/ToolSelector';
import { useTranslation } from 'react-i18next';

function ToolAssignmentPage() {
    const { t } = useTranslation();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);

    const [availableTools, setAvailableTools] = useState<Tool[]>([]);
    const [assignedTools, setAssignedTools] = useState<Tool[]>([]);
    const [selectedToolToAssign, setSelectedToolToAssign] = useState<Tool | null>(null);
    const [isLoadingTools, setIsLoadingTools] = useState(false);
    const [isProcessingAssignment, setIsProcessingAssignment] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCharacters = async () => {
            setIsLoadingCharacters(true);
            setError(null);
            try {
                const data = await api.getCharacters();
                setCharacters(data);
            } catch (err) {
                setError(t("failedToLoadCharactersError"));
                console.error(err);
            } finally {
                setIsLoadingCharacters(false);
            }
        };
        loadCharacters();
    }, [t]);

    useEffect(() => {
        if (!selectedCharacter) {
            setAvailableTools([]);
            setAssignedTools([]);
            setSelectedToolToAssign(null);
            return;
        }

        const loadToolDataForCharacter = async () => {
            setIsLoadingTools(true);
            setError(null);
            try {
                const [availTools, assTools] = await Promise.all([
                    api.getAvailableToolsForCharacter(selectedCharacter.id),
                    api.getAssignedToolsForCharacter(selectedCharacter.id)
                ]);
                setAvailableTools(availTools);
                setAssignedTools(assTools);
            } catch (err) {
                setError(t("failedToLoadToolDataError"));
                console.error(err);
                setAvailableTools([]);
                setAssignedTools([]);
            } finally {
                setIsLoadingTools(false);
            }
        };

        loadToolDataForCharacter();
    }, [selectedCharacter, t]);

    const handleCharacterSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const charId = Number(event.target.value);
        const character = characters.find((c) => c.id === charId) || null;
        setSelectedCharacter(character);
        setSelectedToolToAssign(null);
        setError(null);
    };

    const handleToolToAssignSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const toolId = Number(event.target.value);
        const tool = availableTools.find(t => t.id === toolId) || null;
        setSelectedToolToAssign(tool);
    };

    const handleAssignTool = async () => {
        if (!selectedCharacter || !selectedToolToAssign) return;
        setIsProcessingAssignment(true);
        setError(null);
        try {
            await api.assignToolToCharacter(selectedCharacter.id, selectedToolToAssign.id);
            alert(`'${selectedToolToAssign.name}' ${t('toolAssignedMsg')} '${selectedCharacter.name}'.`);
            
            const [availTools, assTools] = await Promise.all([
                api.getAvailableToolsForCharacter(selectedCharacter.id),
                api.getAssignedToolsForCharacter(selectedCharacter.id)
            ]);
            setAvailableTools(availTools);
            setAssignedTools(assTools);
            setSelectedToolToAssign(null);

        } catch (err: any) {
            const message = err.response?.data?.message 
                || err.response?.data 
                || t("failedToAssignToolError");
            setError(message);
            console.error(err);
        } finally {
            setIsProcessingAssignment(false);
        }
    };

    const handleUnassignTool = async (toolId: number, toolName: string) => {
        if (!selectedCharacter) return;
        if (!confirm(`${t('confirmUnassignMsg1')} '${toolName}' ${t('confirmUnassignMsg2')} '${selectedCharacter.name}'?`)) return;

        setIsProcessingAssignment(true);
        setError(null);
        try {
            await api.unassignToolFromCharacter(selectedCharacter.id, toolId);
            alert(`'${toolName}' ${t('toolUnassignedMsg')} '${selectedCharacter.name}'.`);
            
            const [availTools, assTools] = await Promise.all([
                api.getAvailableToolsForCharacter(selectedCharacter.id),
                api.getAssignedToolsForCharacter(selectedCharacter.id)
            ]);
            setAvailableTools(availTools);
            setAssignedTools(assTools);

        } catch (err: any) {
            const message = err.response?.data?.message || err.response?.data || t("failedToUnassignToolError");
            setError(message);
            console.error(err);
        } finally {
            setIsProcessingAssignment(false);
        }
    };


    if (isLoadingCharacters) return <p>{t('loadingCharacters')}</p>;

    return (
        <div className="page-container management-page">
            <h1>{t('toolAssignTitle')}</h1>

            {error && !isProcessingAssignment && <p className="error-message">Error: {error}</p>}

            <div className="selectors-row">
                <CharacterSelector
                    characters={characters}
                    selectedId={selectedCharacter?.id ?? null}
                    onChange={handleCharacterSelect}
                    label={t("selectCharacterLabel")}
                    disabled={isProcessingAssignment}
                />
            </div>

            {selectedCharacter && (
                <div className="details-action-row">
                    <div className="character-summary">
                        <h4>{t('assignedToolsFor', { name: selectedCharacter.name })}</h4>
                        {isLoadingTools ? <p>{t('loadingTools')}</p> : (
                            <>
                                {assignedTools.length === 0 && <p>{t('noToolsAssigned')}</p>}
                                {assignedTools.length > 0 && (
                                    <ul>
                                        {assignedTools.map(tool => (
                                            <li key={tool.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                                <span>{tool.name}</span>
                                                <button
                                                    onClick={() => handleUnassignTool(tool.id, tool.name)}
                                                    disabled={isProcessingAssignment}
                                                    className="btn btn-sm"
                                                    style={{marginLeft: '10px'}}
                                                >
                                                    {t('unassign')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>

                    <div className="management-form">
                        <h4>{t('assignNewTool')}:</h4>
                        {isLoadingTools ? <p>{t('loadingAvailableTools')}</p> : (
                            <>
                                <ToolSelector
                                    tools={availableTools}
                                    selectedId={selectedToolToAssign?.id ?? null}
                                    onChange={handleToolToAssignSelect}
                                    label={t('availableToolsLabel')}
                                    disabled={availableTools.length === 0 || isProcessingAssignment}
                                />
                                {availableTools.length === 0 && <p>{t('noAvailableToolsToAssign')}</p>}
                                <div className="action-buttons">
                                    <button onClick={handleAssignTool}
                                            disabled={!selectedToolToAssign || isProcessingAssignment}
                                            className="btn primary">
                                        {isProcessingAssignment ? t('assigning') : t('assignSelectedTool')}
                                    </button>
                                </div>
                            </>
                        )}
                        {error && isProcessingAssignment && <p className="error-message">
                            {t("errorProcessingAssignment")}: {error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToolAssignmentPage;