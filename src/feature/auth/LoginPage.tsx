import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApi";
import { setCredentials } from "./authSlice";
import { flushSync } from "react-dom";


export default function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async () => {
        if (isLoading) return;

        try {
            const res = await login({ userName, password }).unwrap();
            dispatch(setCredentials(res.accessToken));
            console.log("NAVIGATE TO /app", window.location.pathname);
            navigate("/app", { replace: true });
        } catch (err){
            console.log("LOGIN ERROR:", err);
        }
    };

    const errorMsg =
        error && typeof error === "object" && "status" in error
            ? `Login fallito (status ${(error as { status: number }).status})`
            : error
                ? "Login fallito"
                : null;

    return (
        <div style={{ maxWidth: 360, margin: "60px auto", padding: 16 }}>
            <h2>Login</h2>

            <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 12 }}>
                <label>
                    Username
                    <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        autoComplete="username"
                        required
                        style={{ width: "100%", padding: 8 }}
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        style={{ width: "100%", padding: 8 }}
                    />
                </label>

                <button type="button" onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? "Accesso..." : "Entra"}
                </button>

                {errorMsg && <div style={{ color: "crimson" }}>{errorMsg}</div>}
            </form>
        </div>
    );
}
