import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useLogout } from "../feature/auth/useLogout";

const Header: React.FC = () => {
    const token = useSelector((s: RootState) => s.auth.accessToken);
    const doLogout = useLogout();

    return (
        <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 0, width: "100%" }} >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Box
                        component="img"
                        src="/logo.svg"
                        alt="Economia Familiare"
                        sx={{
                            height: 54,   // 👈 più grande
                            width: "auto",
                            display: "block",
                        }}
                    />

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            letterSpacing: 0.5,
                        }}
                    >
                        Economia Familiare
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                        variant="body1"
                        sx={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                        header
                    </Typography>
                    <Typography>
                        {token && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={doLogout}>
                                Logout
                            </Button>
                        )}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}


    export default Header;