import { NavLink, useParams } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import ChallengesTab from "./library/ChallengesTab";
import ToolsTab from "./library/ToolsTab";
import TeamMembersTab from "./library/TeamMembersTab";
import { useTranslation } from "react-i18next";

function LibraryPage() {
    const { t } = useTranslation();

    const tabs = [
        { name: t("library.tabChallenges"), href: "/library/challenges" },
        { name: t("library.tabTools"), href: "/library/tools" },
        { name: t("library.tabTeam"), href: "/library/team" },
    ];

    const { tab = "challenges" } = useParams<{
        tab: string;
    }>();

    return (
        <div className="space-y-8">
            <PageHeader
                title={t("library.title")}
                description={t("library.description")}
            />

            <div className="border-b border-slate-700">
                <nav
                    className="-mb-px flex space-x-8"
                    aria-label="Tabs"
                >
                    {tabs.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                        ? "border-indigo-500 text-indigo-400"
                                        : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div>
                {tab === "challenges" && <ChallengesTab />}
                {tab === "tools" && <ToolsTab />}
                {tab === "team" && <TeamMembersTab />}
            </div>
        </div>
    );
}

export default LibraryPage;
