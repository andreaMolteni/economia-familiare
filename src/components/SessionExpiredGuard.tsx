import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { Snackbar, Alert } from "@mui/material";
import { clearSessionExpired } from "../feature/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function SessionExpiredGuard() {
    const sessionExpired = useSelector((s: RootState) => s.auth.sessionExpired);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        if (!sessionExpired) return;

        // evita rimbalzi/flash
        if (loc.pathname !== "/unauthorized") {
            navigate("/unauthorized", { replace: true });
        }
    }, [sessionExpired, navigate, loc.pathname]);

    const handleClose = () => {
        dispatch(clearSessionExpired());
    };

    // opzionale: non mostrare snackbar su /unauthorized (la pagina già spiega tutto)
    const showSnackbar = sessionExpired && loc.pathname !== "/unauthorized";

    return (
        <Snackbar
            open={showSnackbar}
            onClose={handleClose}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity="warning" variant="filled">
                Sessione scaduta. Per favore rieffettua il login.
            </Alert>
        </Snackbar>
    );
}
