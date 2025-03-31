import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import './App.css';
import "./assets/lib/bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "./assets/css/site.css"; // Saját CSS
import "./index.css"; // Saját CSS


import Character from './Views/Character/Character';
import Home from './Views/Home/Home';
import Challenge from './Views/Challenge/Challenge';
import Management from './Views/Management/Management';

function Navbar() {
    const location = useLocation(); // Aktuális URL elérése

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

/*
import React from "react";
import { Link, useLocation } from "react-dom/client";
import "./assets/lib/bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS importálása
import "./assets/css/site.css"; // Saját stílusok importálása
//import "./EvoCharacterManager.styles.css"; // Saját stílusok importálása

const Navbar = () => {
    const location = useLocation(); // Aktuális URL elérhetősége

    const navItems = [
        { controller: "Home", action: "Index", text: "Főoldal" },
        { controller: "Character", action: "Character", text: "Csapattagok" },
        { controller: "Challenge", action: "Challenge", text: "Kihívások" },
        { controller: "Management", action: "Management", text: "Vezetés/Fejlesztés" },
    ];

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-evosoft border-bottom box-shadow mb-3">
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target=".navbar-collapse"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            {navItems.map((item) => (
                                <li className="nav-item" key={item.controller}>
                                    <Link
                                        className={`nav-link text-white ${location.pathname.includes(item.controller) ? "active" : ""}`}
                                        to={`/${item.controller}/${item.action}`}
                                    >
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

function ANYAD() {
    retrun(
        <h1>ANYAD</h1>
    )
}

function App() {
    return (
        <div>
            <ANYAD />
            <div className="container">
                <main role="main" className="pb-3">
                    <p>VALAKI</p>
                    {/* Renderelheted itt a komponenseket }
                </main>
            </div>
        </div>
    );
};

export default App;




import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import TestComponent from "./TestApi.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">

        </a>
        <a href="https://react.dev" target="_blank">

        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
        <TestComponent />
    </>
  )
}

export default App

         */


