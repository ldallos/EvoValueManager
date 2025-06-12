import axios from 'axios';
import {Character} from "../interfaces/Character.ts";
import {Challenge} from "../interfaces/Challenge.ts";
import {ManagementDetails, AssignChallenge, UpdateManagement} from "../interfaces/Management.ts";
import {Tool} from "../interfaces/Tool.ts";

const API_BASE_URL = '/api';

const apiClient = axios.create(
    {
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    }
);

// CHARACTER API

export const getCharacters = (): Promise<Character[]> =>
    apiClient.get('/Character').then(res => res.data);

export const getCharacterById = (id: number): Promise<Character> =>
    apiClient.get(`/Character/${id}`).then(res => res.data);

export const createCharacter = (characterData: Omit<Character, 'id'>): Promise<Character> =>
    apiClient.post('/Character', characterData).then(res => res.data);

export const updateCharacter = (id: number, characterData: Character): Promise<void> =>
    apiClient.put(`/Character/${id}`, characterData);



// CHALLENGE API

export const getChallenges = (): Promise<Challenge[]> =>
    apiClient.get('Challenge/').then(res => res.data);

export const getChallengeById = (id: number): Promise<Challenge> =>
    apiClient.get(`Challenge/${id}`).then(res => res.data);

export const createChallenge = (challengeData: Omit<Challenge, 'id'>): Promise<Challenge> =>
    apiClient.post('Challenge/', challengeData).then(res => res.data);

export const updateChallenge = (id:number, challengeData: Challenge): Promise<void> =>
    apiClient.put(`Challenge/${id}`, challengeData);



// MANAGEMENT API

export const getAvailableChallengesForCharacter = (characterId: number): Promise<Challenge[]> =>
    apiClient.get(`Management/available/${characterId}`).then(res => res.data);

export const getAssignedChallengesForCharacter = (characterId: number): Promise<Challenge[]> =>
    apiClient.get(`/Management/assigned/${characterId}`).then(res => res.data);

export const getManagementDetails = (characterId: number, challengeId: number): Promise<ManagementDetails> =>
    apiClient.get(`/Management/${characterId}/${challengeId}`).then(res => res.data);

export const assignChallenge = (payload: AssignChallenge): Promise<void> =>
    apiClient.post('/Management', payload);

export const updateManagement = (characterId: number, challengeId: number, payload: UpdateManagement): Promise<void> =>
    apiClient.put(`/Management/${characterId}/${challengeId}`, payload);

export const closeChallenge = (characterId: number, challengeId: number): Promise<Character> =>
    apiClient.post(`/Management/close/${characterId}/${challengeId}`).then(res => res.data);



// TOOL API
export const getTools = (): Promise<Tool[]> =>
    apiClient.get('/Tool').then(res => res.data);

export const getToolById = (id: number): Promise<Tool> =>
    apiClient.get(`/Tool/${id}`).then(res => res.data);

export const createTool = (toolData: Omit<Tool, 'id'>): Promise<Tool> =>
    apiClient.post('/Tool', toolData).then(res => res.data);

export const updateTool = (id: number, toolData: Tool): Promise<void> =>
    apiClient.put(`/Tool/${id}`, toolData);



// CHARACTER-TOOL API
export const getAssignedToolsForCharacter = (characterId: number): Promise<Tool[]> =>
    apiClient.get(`/charactertool/${characterId}/assigned`).then(res => res.data);

export const getAvailableToolsForCharacter = (characterId: number): Promise<Tool[]> =>
    apiClient.get(`/charactertool/${characterId}/available`).then(res => res.data);

export const assignToolToCharacter = (characterId: number, toolId: number): Promise<{ message: string }> =>
    apiClient.post(`/charactertool/${characterId}/assign/${toolId}`).then(res => res.data);

export const unassignToolFromCharacter = (characterId: number, toolId: number): Promise<{ message: string }> =>
    apiClient.delete(`/charactertool/${characterId}/unassign/${toolId}`).then(res => res.data);