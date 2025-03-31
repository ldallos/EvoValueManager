import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import './App.css';
import "./assets/lib/bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/site.css";
import "./index.css";


import Character from './Views/Character/Character';
import Home from './Views/Home/Home';
import Challenge from './Views/Challenge/Challenge';
import Management from './Views/Management/Management';

function Navbar() {
    const location = useLocation();

    const navItems = [
        { controller: "Home", action: "Home", text: "Főoldal" },
        { controller: "Character", action: "Character", text: "Csapattagok" },
        { controller: "Challenge", action: "Challenge", text: "Kihívások" },
        { controller: "Management", action: "Management", text: "Vezetés/Fejlesztés" },
    ];

    return (
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-evosoft border-bottom box-shadow mb-3">
            <div className="container-fluid">
                <button className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.controller}>
                                <Link
                                    className={`nav-link text-white ${location.pathname.includes(item.controller) ? "active" : ""}`}
                                    to={`/${item.action}`} >
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="container">
                <main role="main" className="pb-3">
                    <Routes>
                        <Route path="/" element={<Navigate to="/Home" />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Character" element={<Character />} />
                        <Route path="/Challenge" element={<Challenge/>} />
                        <Route path="/Management" element={<Management />} />
                        <Route path="*" element={<h1>404 - Az oldal nem található</h1>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
export default App;
