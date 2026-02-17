import { Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { clearLoginFailed } from "../feature/auth/authSlice";

export default function LoginFailedBanner() {
    const dispatch = useDispatch();
    const { loginFailed, loginFailedMessage } = useSelector((s: RootState) => s.auth);

    const handleClose = () => dispatch(clearLoginFailed());

    return (
        <Snackbar
            open={loginFailed}
            onClose={handleClose}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity="error" variant="filled">
                {loginFailedMessage ?? "Credenziali non valide."}
            </Alert>
        </Snackbar>
    );
}

