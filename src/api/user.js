import { apiFetch } from "./api";

export function deleteMyAccount() {
    return apiFetch("/api/v1/users/me", { method: "DELETE" });
}
