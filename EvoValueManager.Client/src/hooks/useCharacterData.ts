import { useQuery } from "@tanstack/react-query";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";
import { RichCharacter } from "../interfaces/RichCharacter";
import { useMemo } from "react";
import { Tool } from "@/interfaces/Tool.ts";

const FIVE_MINUTES_IN_MS = 1000 * 60 * 5;

export function useCharacterData() {
    const {
        data: richCharacters = [],
        isLoading,
        error,
    } = useQuery<RichCharacter[]>({
        queryKey: ["characters"],
        queryFn: api.getCharacters,
        staleTime: FIVE_MINUTES_IN_MS,
    });

    const baseCharacters = useMemo<Character[]>(() => {
        return richCharacters.map((rc) => ({
            id: rc.id,
            name: rc.name,
            title: rc.title,
            hasAvatar: rc.hasAvatar,
            bravery: rc.bravery.base,
            trust: rc.trust.base,
            presence: rc.presence.base,
            growth: rc.growth.base,
            care: rc.care.base,
            achievements: [],
            appliedTools: [],
        }));
    }, [richCharacters]);

    const effectiveCharacters = useMemo<Character[]>(() => {
        return richCharacters.map((rc) => ({
            id: rc.id,
            name: rc.name,
            title: rc.title,
            hasAvatar: rc.hasAvatar,
            bravery: rc.bravery.effective,
            trust: rc.trust.effective,
            presence: rc.presence.effective,
            growth: rc.growth.effective,
            care: rc.care.effective,
            achievements: [],
            appliedTools: rc.appliedTools,
        }));
    }, [richCharacters]);

    const toolsByCharacterId = useMemo(() => {
        const map = new Map<number, Tool[]>();
        richCharacters.forEach((character) => {
            map.set(character.id, character.appliedTools || []);
        });
        return map;
    }, [richCharacters]);

    return {
        richCharacters,
        baseCharacters,
        effectiveCharacters,
        toolsByCharacterId,
        isLoading,
        error,
    };
}
