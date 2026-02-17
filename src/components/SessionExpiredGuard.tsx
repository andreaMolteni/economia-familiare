import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { clearSessionExpired } from "../feature/auth/authSlice";

export default function SessionExpiredGuard() {
    const sessionExpired = useSelector((s: RootState) => s.auth.sessionExpired);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionExpired) return;
        navigate("/login", { replace: true });
    }, [sessionExpired, navigate]);

    const handleClose = () => {
        dispatch(clearSessionExpired());
    };

    return (
        <Snackbar
            open={sessionExpired}
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
