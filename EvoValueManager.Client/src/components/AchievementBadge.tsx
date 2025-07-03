import { Award, Shield, BookOpen, Gem, Swords, Heart } from "lucide-react";
import { Achievement } from "../interfaces/Achievement";

interface AchievementBadgeProps {
    achievement: Achievement;
}

const Tooltip = ({ content, children }: { content: string, children: React.ReactNode }) => (
    <div className="relative group">
        {children}
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-sm bg-slate-900 text-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-slate-700">
            {content}
        </div>
    </div>
);


const iconMap: Record<string, React.ReactElement> = {
    bravery: <Swords className="w-4 h-4 text-red-400" />,
    trust: <Shield className="w-4 h-4 text-sky-400" />,
    presence: <Gem className="w-4 h-4 text-yellow-400" />,
    growth: <BookOpen className="w-4 h-4 text-green-400" />,
    care: <Heart className="w-4 h-4 text-purple-400" />,
    completionist: <Award className="w-4 h-4 text-amber-400" />,
};

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
    const icon = iconMap[achievement.iconType] || <Award className="w-4 h-4 text-slate-400" />;

    return (
        <Tooltip content={achievement.description}>
            <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md border border-slate-600/50 cursor-default">
                {icon}
                <span className="text-sm font-medium text-slate-200">{achievement.name}</span>
            </div>
        </Tooltip>
    );
}