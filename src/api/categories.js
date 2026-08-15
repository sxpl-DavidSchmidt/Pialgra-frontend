import { apiFetch } from "./api";

export function getMyCategories() {
    return apiFetch("/api/v1/users/me/categories");
}