import { NavLink, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ChallengesTab from "./library/ChallengesTab";
import ToolsTab from "./library/ToolsTab";

const tabs = [
    { name: "Challenges", href: "/library/challenges" },
    { name: "Tools", href: "/library/tools" },
];

function LibraryPage() {
    const { tab = 'challenges' } = useParams<{ tab: string }>();

    return (
        <div className="space-y-8">
            <PageHeader
                title="Resource Library"
                description="Manage all available Challenges and Tools that can be assigned to your team."
            />

            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                        ? 'border-indigo-500 text-indigo-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div>
                {tab === 'challenges' && <ChallengesTab />}
                {tab === 'tools' && <ToolsTab />}
            </div>
        </div>
    );
}

export default LibraryPage;