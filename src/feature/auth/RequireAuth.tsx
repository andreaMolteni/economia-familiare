import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../../app/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./authSlice";

export default function RequireAuth() {
    const tokenFromStore = useSelector((s: RootState) => s.auth.accessToken);
    const token = tokenFromStore ?? localStorage.getItem("accessToken"); // ✅ fallback
    const lastAuthError = useSelector((s: RootState) => s.auth.lastAuthError);
    const exp = useSelector((s: RootState) => s.auth.exp);
    const dispatch = useDispatch();
    const location = useLocation();


    // ✅ controllo scadenza fuori dal render
    useEffect(() => {
        if (exp && Date.now() / 1000 > exp) {
            dispatch(logout());
        }
    }, [exp, dispatch]);


    if (!token) {
        if (lastAuthError === "unauthorized") {
            return <Navigate to="/unauthorized" replace />;
        }


        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
