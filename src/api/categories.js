import { apiFetch } from "./api";

export function createCategory(categoryName) {
    return apiFetch("/api/v1/categories", {
        method: "POST",
        body: JSON.stringify({
            name: categoryName
        }),
    });
}

export function getMyCategories() {
    return apiFetch("/api/v1/users/me/categories");
}