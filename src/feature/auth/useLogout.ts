import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./authSlice";
import { financeApi } from "../../services/financeApi";
import { authApi } from "./authApi";

export function useLogout() {
    const dispatch = useDispatch();

    return useCallback(() => {
        dispatch(logout());
        dispatch(financeApi.util.resetApiState());
        dispatch(authApi.util.resetApiState());
    }, [dispatch]);
}
