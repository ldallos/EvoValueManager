import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { getCharacters } from "../api/api";
import { Character } from "../interfaces/Character";
import { Loader2 } from "lucide-react";
import { getTeamStats } from "../api/api";
import { TeamStat } from "../interfaces/Dashboard";

const NeedsAttentionWidget = () => {
    const { data: characters = [] } = useQuery<Character[]>({
        queryKey: ['characters'],
        queryFn: getCharacters
    });

    const attentionNeeded = characters.filter(c =>
        c.bravery < 40 || c.trust < 40 || c.presence < 40 || c.growth < 40 || c.care < 40
    ).slice(0, 5);

    return (
        <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Needs Attention</h3>
            {attentionNeeded.length > 0 ? (
                <ul className="space-y-3">
                    {attentionNeeded.map(char => (
                        <li key={char.id} className="text-sm text-slate-300 bg-slate-700/50 p-2 rounded-md">
                            {char.name} <span className="text-xs text-slate-400">(Low stats detected)</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-400">The team is looking great!</p>
            )}
        </Card>
    )
}

function DashboardPage() {
    const { data: teamStatsData = [], isLoading, error } = useQuery<TeamStat[]>({
        queryKey: ['teamStats'],
        queryFn: getTeamStats,
    });

    return (
        <div className="space-y-8">
            <PageHeader
                title="Dashboard"
                description="A high-level overview of your team's development and progress."
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6 h-[400px]">
                        <h3 className="font-semibold text-white mb-4">Team Values Radar</h3>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-full text-red-400">Failed to load chart data.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="90%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamStatsData}>
                                    <PolarGrid stroke="#475569" />
                                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                                    <Radar name="Team Average" dataKey="average" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(224 71% 4% / 0.8)', borderColor: '#334155' }} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <NeedsAttentionWidget />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;