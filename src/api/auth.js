import { apiFetch } from "./api";

export function login(username, password) {
    return apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
    });
}

export function register(username, password) {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
    });
}

export function logout() {
    return apiFetch("/api/auth/logout", {
        method: "POST",
    });
}

export function getCurrentUser() {
    return apiFetch("/api/v1/users/me");
}
