import { Award, Shield, BookOpen, Gem, Swords, Heart } from "lucide-react";
import { Achievement } from "@/interfaces/Achievement.ts";
import Tooltip from "./../ui/Tooltip.tsx";
import { useTranslation } from "react-i18next";

interface AchievementBadgeProps {
    achievement: Achievement;
}

const iconMap: Record<string, React.ReactElement> = {
    bravery: <Swords className="w-4 h-4 text-red-400" />,
    trust: <Shield className="w-4 h-4 text-sky-400" />,
    presence: <Gem className="w-4 h-4 text-yellow-400" />,
    growth: <BookOpen className="w-4 h-4 text-green-400" />,
    care: <Heart className="w-4 h-4 text-purple-400" />,
    completionist: <Award className="w-4 h-4 text-amber-400" />,
};

export default function AchievementBadge({
    achievement,
}: AchievementBadgeProps) {
    const { t } = useTranslation();

    const icon = iconMap[achievement.iconType] || (
        <Award className="w-4 h-4 text-slate-400" />
    );

    return (
        <Tooltip content={t(achievement.description)}>
            <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md border border-slate-600/50 cursor-default">
                {icon}
                <span className="text-sm font-medium text-slate-200">
                    {t(achievement.name)}
                </span>
            </div>
        </Tooltip>
    );
}
