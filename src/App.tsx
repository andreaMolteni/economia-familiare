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
import SessionExpiredGuard from "./components/SessionExpiredGuard";
import LoginFailedBanner from "./components/LoginFailedBanner";

const App: React.FC = () => {
    const loc = useLocation();
    console.log("ROUTE:", loc.pathname);

    //const contDown: number = 31;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
                width: "100%",
            }}
        >
            <Header />

            {/* MAIN: centra i contenuti */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    display: "flex",
                    mx: "auto",
                    justifyContent: "center",
                    px: 2,
                    py: 3,
                }}
            >
                    <SessionExpiredGuard />
                    <LoginFailedBanner />
                    <ServerWarmingBanner />

                    <Routes>
                        <Route path="/" element={<Navigate to="/app" replace />} />

                        {/* Login centrata */}
                        <Route
                            path="/login"
                            element={
                                <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <LoginPage />
                                </Box>
                            }
                        />

                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        <Route element={<RequireAuth />}>
                            <Route path="/app" element={<TablesPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/app" replace />} />
                    </Routes>
            </Box>

            <Footer />
        </Box>
    );
};

export default App;
