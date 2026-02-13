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
        <AppBar position="static" color="primary" elevation={0} sx={{
            borderRadius: 0
        }} >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Economia Familiare
                </Typography>
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