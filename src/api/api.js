const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8080" : "")).replace(/\/$/, "");

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers);
    if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (!["GET", "HEAD", "OPTIONS"].includes((options.method || "GET").toUpperCase())) {
        const csrfResponse = await fetch(`${API_BASE_URL}/api/auth/csrf`, { credentials: "include", cache: "no-store", signal: options.signal });
        if (!csrfResponse.ok) throw new ApiError(csrfResponse.status, "Could not secure this request. Please try again.");
        const csrf = await csrfResponse.json();
        headers.set(csrf.headerName, csrf.token);
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
    });

    if (!response.ok) {
        const details = await response.json().catch(() => null);
        if (response.status === 401 && path !== "/api/auth/login") window.dispatchEvent(new Event("auth-expired"));
        throw new ApiError(
            response.status,
            details?.message || details?.error || `Request failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
