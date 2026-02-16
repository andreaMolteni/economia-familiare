import { Snackbar, Alert, CircularProgress, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function ServerWarmingBanner() {
    const { warmingUp, message } = useSelector(
        (state: RootState) => state.server
    );

    return (
        <Snackbar
            open={warmingUp}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                severity="info"
                variant="filled"
                icon={
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CircularProgress size={16} color="inherit" />
                    </Stack>
                }
            >
                {message ?? "Il server si sta riavviando..."}
            </Alert>
        </Snackbar>
    );
}