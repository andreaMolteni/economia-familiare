
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ServerWarmingBanner from "./ServerWarmingBanner";
import SessionExpiredGuard from "./SessionExpiredGuard";
import LoginFailedBanner from "./LoginFailedBanner";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                bgcolor: "background.default",
            }}
        >
            <Header />

            <SessionExpiredGuard />
            <LoginFailedBanner />
            <ServerWarmingBanner />

            <Box component="main" sx={{ flexGrow: 1, width: "100%", px: 2, py: 3 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
}