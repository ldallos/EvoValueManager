import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TeamPage from "./pages/TeamPage";
import LibraryPage from "./pages/LibraryPage";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/library/:tab" element={<LibraryPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;