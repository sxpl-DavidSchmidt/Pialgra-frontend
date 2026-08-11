const API_BASE_URL = "http://localhost:8080";

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new ApiError(
            response.status,
            `Request failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
