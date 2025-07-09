import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import Modal from "./ui/Modal";
import CharacterForm from "@/components/character/CharacterForm.tsx";
import * as api from "../api/api";
import { Character } from "../interfaces/Character";

interface CreateCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type CharacterFormData = Omit<Character, "id">;

export default function CreateCharacterModal({
    isOpen,
    onClose,
}: CreateCharacterModalProps) {
    const queryClient = useQueryClient();

    const createMutation = useMutation<
        Character,
        AxiosError,
        CharacterFormData
    >({
        mutationFn: api.createCharacter,
        onSuccess: () => {
            toast.success("Team member added successfully!");
            queryClient.invalidateQueries({
                queryKey: ["characters"],
            });
            onClose();
        },
        onError: (err) => {
            const message =
                (err.response?.data as { message: string })?.message ||
                "Failed to add member.";
            toast.error(message);
        },
    });

    const handleFormSubmit = (data: CharacterFormData) => {
        createMutation.mutate(data);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Team Member"
        >
            <CharacterForm
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                isSaving={createMutation.isPending}
            />
        </Modal>
    );
}
