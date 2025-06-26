import { NavLink } from "react-router-dom";

function Navigation() {
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClass = "bg-evogreen-dark text-white";
    const inactiveClass = "text-gray-200 hover:bg-evogreen-dark hover:text-white";

    return (
        <header className="bg-evogreen shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="font-semibold text-xl text-white">
                            EvoValueManager
                        </NavLink>
                    </div>
                    {/* Basic responsive menu for smaller screens */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink
                                to="/characters"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                Csapattagok
                            </NavLink>
                            <NavLink
                                to="/challenges"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                Kihívások
                            </NavLink>
                            <NavLink
                                to="/tools"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                Eszközök
                            </NavLink>
                            <NavLink
                                to="/management"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                Vezetés/Fejlesztés
                            </NavLink>
                            <NavLink
                                to="/tool-assignment"
                                className={({ isActive }) =>
                                    `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                Eszköz Hozzárendelés
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navigation;
