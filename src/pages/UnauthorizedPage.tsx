import { useDispatch } from "react-redux";
import { clearSessionExpired } from "../feature/auth/authSlice"
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export default function UnauthorizedPage() {
    const dispatch = useDispatch();
    return (
        <Box
            sx={{
                height: "100dvh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                px: 3,
                boxSizing: "border-box",
            }}
        >
            <Typography
                variant="h3"
                color="primary"
                sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    textAlign: "center",
                    mb: 6,
                }}
            >
                Benvenuti in Economia Familiare
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    flexWrap: "wrap",
                    maxWidth: 900,
                    width: "100%",
                }}
            >
                <Box
                    component="img"
                    src="/logo.svg"
                    alt="Economia Familiare"
                    sx={{
                        height: "clamp(160px, 22vw, 260px)",
                        width: "auto",
                        display: "block",
                    }}
                />

                <Box
                    sx={{
                        width: 320,
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        boxSizing: "border-box",
                        boxShadow: 3,
                        display: "grid",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Sessione scaduta
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Per continuare devi effettuare di nuovo l’accesso.
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        component={RouterLink}
                        to="/login"
                        onClick={() => dispatch(clearSessionExpired())}
                        size="large"
                    >
                        Vai al login
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}