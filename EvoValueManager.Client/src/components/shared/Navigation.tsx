import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher.tsx";

function Navigation() {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClasses =
        "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "bg-indigo-600 text-white";
    const inactiveClass = "text-slate-300 hover:bg-slate-700 hover:text-white";

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink
                            to="/"
                            className="font-semibold text-xl text-white"
                            onClick={closeMobileMenu}
                        >
                            <span className="text-indigo-400">Evo</span>
                            ValueManager
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
                                {t("nav.dashboard")}
                            </NavLink>
                            <NavLink
                                to="/team"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("nav.team")}
                            </NavLink>
                            <NavLink
                                to="/library"
                                end={false}
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                {t("nav.library")}
                            </NavLink>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center ml-auto pl-6">
                        <LanguageSwitcher />
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <span className="sr-only">
                                {t("nav.openMainMenu")}
                            </span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/dashboard"
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block ${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                            }
                        >
                            {t("nav.dashboard")}
                        </NavLink>
                        <NavLink
                            to="/team"
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block ${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                            }
                        >
                            {t("nav.team")}
                        </NavLink>
                        <NavLink
                            to="/library"
                            end={false}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `block ${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                            }
                        >
                            {t("nav.library")}
                        </NavLink>
                    </div>
                    <div className="px-3 py-3 border-t border-slate-700">
                        <LanguageSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navigation;
