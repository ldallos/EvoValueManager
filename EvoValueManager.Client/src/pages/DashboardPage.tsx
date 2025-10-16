import { useQuery } from "@tanstack/react-query";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    Tooltip,
    Legend,
    PolarRadiusAxis,
} from "recharts";
import { Loader2, Zap } from "lucide-react";
import * as api from "@/api/api";
import { TeamStat } from "@/interfaces/Dashboard";
import { useCharacterData } from "@/hooks/useCharacterData";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import KeyStatsWidget from "@/components/dashboard/KeyStatsWidget.tsx";
import StatLeadersWidget from "@/components/dashboard/StatLeadersWidget.tsx";
import NeedsAttentionWidget from "@/components/dashboard/NeedsAttentionWidget.tsx";
import { DashboardSummary } from "@/api/api";
import { useTranslation } from "react-i18next";

interface CustomTickPayload {
    value: string | number;
}
interface CustomTickProps {
    x?: number | string;
    y?: number | string;
    payload?: CustomTickPayload;
    cx?: number | string;
    cy?: number | string;
}

const CustomAngleAxisTick = (props: CustomTickProps) => {
    const x =
        typeof props.x === "string" ? parseFloat(props.x) : (props.x ?? 0);
    const y =
        typeof props.y === "string" ? parseFloat(props.y) : (props.y ?? 0);
    const cx =
        typeof props.cx === "string" ? parseFloat(props.cx) : (props.cx ?? 0);
    const cy =
        typeof props.cy === "string" ? parseFloat(props.cy) : (props.cy ?? 0);
    const { payload } = props;
    if (!payload) {
        return <text />;
    }
    const offset = 15;
    const angle = Math.atan2(y - cy, x - cx);
    const newX = x + offset * Math.cos(angle);
    const newY = y + offset * Math.sin(angle);

    return (
        <text
            x={newX}
            y={newY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#94a3b8"
            fontSize={12}
        >
            {payload.value}
        </text>
    );
};

function DashboardPage() {
    const { t } = useTranslation();

    const {
        data: teamStatsData = [],
        isLoading: isLoadingStats,
        error: statsError,
    } = useQuery<TeamStat[]>({
        queryKey: ["teamStats"],
        queryFn: api.getTeamStats,
    });

    const {
        baseCharacters,
        effectiveCharacters,
        isLoading: isLoadingCharacters,
        error: charactersError,
    } = useCharacterData();

    const { data: summaryData, isLoading: isLoadingSummary } =
        useQuery<DashboardSummary>({
            queryKey: ["dashboardSummary"],
            queryFn: api.getDashboardSummary,
        });

    const isLoading = isLoadingStats || isLoadingCharacters || isLoadingSummary;
    const error = statsError || charactersError;

    return (
        <div className="space-y-8">
            <PageHeader
                title={t("dashboard.title")}
                description={t("dashboard.description")}
            />

            <KeyStatsWidget
                summary={summaryData}
                isLoading={isLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6 h-[450px]">
                        <h3 className="font-semibold text-white mb-4">
                            {t("dashboard.radarChartTitle")}
                        </h3>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-full text-red-400">
                                {t("dashboard.chartError")}
                            </div>
                        ) : (
                            <ResponsiveContainer
                                width="100%"
                                height="90%"
                            >
                                <RadarChart
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                    data={teamStatsData}
                                >
                                    <PolarGrid stroke="#475569" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={CustomAngleAxisTick}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 100]}
                                        stroke="#94a3b8"
                                        fontSize={"small"}
                                    />
                                    <Radar
                                        name={t("dashboard.radarChartLegend")}
                                        dataKey="average"
                                        stroke="#818cf8"
                                        fill="#818cf8"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "hsl(224 71% 4% / 0.8)",
                                            borderColor: "#334155",
                                        }}
                                    />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <StatLeadersWidget
                        characters={baseCharacters}
                        isLoading={isLoadingCharacters}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NeedsAttentionWidget
                    characters={effectiveCharacters}
                    isLoading={isLoadingCharacters}
                />
                <Card className="p-6">
                    <h3 className="font-semibold text-white mb-4">
                        {t("dashboard.recentActivityTitle")}
                    </h3>
                    <div className="flex flex-col items-center justify-center h-32 text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
                        <Zap className="w-8 h-8 mb-2" />
                        <p className="font-medium">
                            {t("dashboard.activityComingSoon")}
                        </p>
                        <p className="text-sm">
                            {t("dashboard.activityDescription")}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;
