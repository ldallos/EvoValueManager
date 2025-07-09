import Modal from "../ui/Modal";
import ManagementDashboard from "./ManagementDashboard";
import { Character } from "@/interfaces/Character";
import { useTranslation } from "react-i18next";

interface ChallengeManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

export default function ChallengeManagementModal({
    isOpen,
    onClose,
    character,
}: ChallengeManagementModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${t("characterDashboard.challengeManagementTitle")} - ${character.name}`}
            size="5xl"
        >
            <ManagementDashboard
                characterId={character.id}
                character={character}
            />
        </Modal>
    );
}
