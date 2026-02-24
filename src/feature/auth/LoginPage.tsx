import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import { useState } from "react";
import { setWarmingUp } from "../../slices/serverSlice";
import { loginErrorInvalidCredentials } from "./authSlice";
import { Typography,Box, Button, TextField } from "@mui/material";


export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async () => {
        if (isLoading) return;

        // 👇 Banner immediato al click
        dispatch(
            setWarmingUp({
                warmingUp: true,
                message:
                    "Accesso in corso… se il server era inattivo potrebbe volerci qualche minuto per riavviarsi.",
            })
        );

        try {
            const res = await login({ userName, password }).unwrap();
            dispatch(setCredentials(res.accessToken));
            dispatch(setWarmingUp({ warmingUp: false })); // 👈 spegni banner su successo
            console.log("NAVIGATE TO /app", window.location.pathname);
            navigate("/app", { replace: true });
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "status" in err &&
                (err as { status: number }).status === 401 || (err as { status: number }).status === 403
            ) {
                dispatch(loginErrorInvalidCredentials());
            }
            console.log("LOGIN ERROR:", err);
            dispatch(setWarmingUp({ warmingUp: false })); // 👈 spegni banner su successo
        }
    };

    return (
        <Box
            sx={{
                height: "100dvh",              // meglio di 100vh su alcuni browser
                overflow: "hidden",            // niente scroll se ci stai dentro
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
                    mb: 6,                       // 👈 PIÙ spazio sotto al titolo
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
                    src={`${import.meta.env.BASE_URL}logo.svg`}
                    alt="Economia Familiare"
                    sx={{
                        height: "clamp(160px, 22vw, 260px)", // 👈 si adatta, evita overflow
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
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                        sx={{ display: "grid", gap: 2 }}
                    >
                        <TextField
                            label="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoComplete="username"
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isLoading}
                        >
                        {isLoading ? "Accesso..." : "Entra"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
