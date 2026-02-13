import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function RequireAuth() {
    const tokenFromStore = useSelector((s: RootState) => s.auth.accessToken);
    const token = tokenFromStore ?? localStorage.getItem("accessToken"); // ✅ fallback
    const lastAuthError = useSelector((s: RootState) => s.auth.lastAuthError);
    const location = useLocation();
    console.log("RequireAuth token:", tokenFromStore, localStorage.getItem("accessToken"));

    if (!token) {
        if (lastAuthError === "unauthorized") {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
