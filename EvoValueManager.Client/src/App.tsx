import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navigation from "./components/shared/Navigation.tsx";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TeamPage from "./pages/TeamPage";
import LibraryPage from "./pages/LibraryPage";
import ScrollToTop from "./components/shared/ScrollToTop.tsx";

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route
                            path="/"
                            element={<HomePage />}
                        />
                        <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                        />
                        <Route
                            path="/team"
                            element={<TeamPage />}
                        />
                        <Route
                            path="/library/:tab"
                            element={<LibraryPage />}
                        />
                        <Route
                            path="/library"
                            element={
                                <Navigate
                                    to="/library/challenges"
                                    replace
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
