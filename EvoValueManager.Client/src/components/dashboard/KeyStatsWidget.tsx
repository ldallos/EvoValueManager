import { Loader2, Zap, Wrench, Trophy } from "lucide-react";
import Card from "@/components/ui/Card.tsx";
import { DashboardSummary } from "@/api/api.ts";
import React from "react";
import { useTranslation } from "react-i18next";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
    isLoading: boolean;
}

const StatCard = ({ icon, label, value, isLoading }: StatCardProps) => {
    return (
        <Card className="p-4 flex items-center gap-4 bg-slate-800">
            <div className="bg-slate-700 p-3 rounded-lg">{icon}</div>
            <div>
                <p className="text-sm text-slate-400">{label}</p>
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                ) : (
                    <p className="text-xl font-bold text-white truncate">
                        {value}
                    </p>
                )}
            </div>
        </Card>
    );
};

interface KeyStatsWidgetProps {
    summary?: DashboardSummary;
    isLoading: boolean;
}

export default function KeyStatsWidget({
    summary,
    isLoading,
}: KeyStatsWidgetProps) {
    const { t } = useTranslation();

    const mostEquippedToolValue = summary?.mostEquippedTool
        ? t(summary.mostEquippedTool)
        : t("common.notAvailable");

    const topContributorValue =
        summary?.topContributor ?? t("common.notAvailable");

    const challengesInProgressValue =
        summary?.challengesInProgress ?? t("common.notAvailable");

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                label={t("stats.challengesInProgress")}
                value={challengesInProgressValue}
                isLoading={isLoading}
            />
            <StatCard
                icon={<Wrench className="w-6 h-6 text-sky-400" />}
                label={t("stats.mostEquippedTool")}
                value={mostEquippedToolValue}
                isLoading={isLoading}
            />
            <StatCard
                icon={<Trophy className="w-6 h-6 text-amber-400" />}
                label={t("stats.topContributor")}
                value={topContributorValue}
                isLoading={isLoading}
            />
        </div>
    );
}
