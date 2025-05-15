import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Főoldal
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/characters"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Csapattagok
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/challenges"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Kihívások
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/management"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Vezetés/Fejlesztés
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
