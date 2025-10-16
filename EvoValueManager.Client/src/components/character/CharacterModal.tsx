import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import Modal from "../ui/Modal";
import CharacterForm from "./CharacterForm";
import * as api from "../../api/api";
import { Character } from "@/interfaces/Character.ts";

interface CharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: Character | null;
}

type CharacterFormData = Omit<Character, "id" | "hasAvatar" | "achievements">;

export default function CharacterModal({
    isOpen,
    onClose,
    character,
}: CharacterModalProps) {
    const queryClient = useQueryClient();
    const isEditMode = character !== null;

    const mutation = useMutation<Character, AxiosError, Character>({
        mutationFn: (characterData: Character) => {
            if (characterData.id) {
                return api.updateCharacter(characterData.id, characterData);
            }
            return api.createCharacter(characterData);
        },
        onSuccess: () => {
            toast.success(
                `Team member ${isEditMode ? "updated" : "added"} successfully!`
            );
            queryClient.invalidateQueries({ queryKey: ["characters"] });
            queryClient.invalidateQueries({ queryKey: ["baseCharacters"] });
            onClose();
        },
        onError: (err) => {
            const message =
                (err.response?.data as { message: string })?.message ||
                `Failed to ${isEditMode ? "update" : "add"} member.`;
            toast.error(message);
        },
    });

    const handleFormSubmit = (data: CharacterFormData) => {
        if (isEditMode && character) {
            const updatedCharacter: Character = {
                ...character,
                ...data,
            };
            mutation.mutate(updatedCharacter);
        } else {
            const newCharacter: Character = {
                id: 0,
                hasAvatar: false,
                achievements: [],
                ...data,
            };
            mutation.mutate(newCharacter);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Team Member" : "Add New Team Member"}
        >
            <CharacterForm
                key={character?.id ?? "new-char"}
                initialData={character}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                isSaving={mutation.isPending}
            />
        </Modal>
    );
}
