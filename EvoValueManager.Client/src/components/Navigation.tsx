import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navigation() {
    const { t } = useTranslation();
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "bg-indigo-600 text-white";
    const inactiveClass = "text-slate-300 hover:bg-slate-700 hover:text-white";

    return (
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="font-semibold text-xl text-white">
                            <span className="text-indigo-400">Evo</span>ValueManager
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("navDashboard")}
                            </NavLink>
                            <NavLink
                                to="/team"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("navTeam")}
                            </NavLink>
                            <NavLink
                                to="/library/challenges"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("navChallenges")}
                            </NavLink>
                            <NavLink
                                to="/library/tools"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("navTools")}
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navigation;