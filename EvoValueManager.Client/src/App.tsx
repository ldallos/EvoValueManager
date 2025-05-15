import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CharacterPage from "./pages/CharacterPage";
import Navigation from "./components/Navigation";
import "./App.css";
import ManagementPage from "./pages/ManagementPage.tsx";
import ChallengePage from "./pages/ChallengePage.tsx";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/characters" element={<CharacterPage />} />
                        <Route path="/challenges" element={<ChallengePage />} />
                        <Route
                            path="/management"
                            element={<ManagementPage />}
                        />
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
