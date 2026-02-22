import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./feature/auth/RequireAuth";
import LoginPage from "./feature/auth/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import TablesPage from "./pages/TablesPage";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/AppLayout";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />

            {/* PUBBLICO */}
            <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* PRIVATO */}
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route path="/app" element={<TablesPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
    );
};

export default App;