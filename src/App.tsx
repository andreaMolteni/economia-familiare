import React from "react";
import {
    Box
} from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./feature/auth/RequireAuth";
import LoginPage from "./feature/auth/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import TablesPage from "./pages/TablesPage";
import { useLocation } from "react-router-dom";
import ServerWarmingBanner from "./components/ServerWarmingBanner";

const App: React.FC = () => {
    const loc = useLocation();
    console.log("ROUTE:", loc.pathname);

    //const contDown: number = 31;

    return (
        <Box
            sx={{
                borderRadius: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "background.default",
                width: "100%",
            }}
        >
            {/* HEADER */}
            <Header />
           

            {/* CONTENUTO PRINCIPALE FULL WIDTH */}
            <Box
                sx={{
                    px: 4,
                    py: 3,
                    flexGrow: 1,
                    width: "100%",
                }}
            >
                <ServerWarmingBanner />
                <Routes>
                    {/* entry point */}
                    <Route path="/" element={<Navigate to="/app" replace />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* area protetta */}
                    <Route element={<RequireAuth />}>
                        <Route path="/app" element={<TablesPage />} />
                    </Route>

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
            </Box>

            {/* FOOTER */}
            <Footer />
        </Box>
    );
};

export default App;
