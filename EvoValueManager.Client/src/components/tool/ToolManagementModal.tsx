import Modal from "../ui/Modal";
import ToolManagement from "./ToolManagement";
import { Character } from "@/interfaces/Character";
import { useTranslation } from "react-i18next";

interface ToolManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    character: Character;
}

export default function ToolManagementModal({
    isOpen,
    onClose,
    character,
}: ToolManagementModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${t("tool.managementTitle")} - ${character.name}`}
            size="5xl"
        >
            <ToolManagement characterId={character.id} />
        </Modal>
    );
}
