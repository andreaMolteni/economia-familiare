import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ServerWarmingBanner from "./ServerWarmingBanner";
import SessionExpiredGuard from "./SessionExpiredGuard";
import LoginFailedBanner from "./LoginFailedBanner";


export default function PublicLayout() {
    return (
        <Box sx={{ minHeight: "100dvh", width: "100%", bgcolor: "background.default" }}>
            <SessionExpiredGuard />
            <LoginFailedBanner />
            <ServerWarmingBanner />

            <Box
                sx={{
                    minHeight: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}