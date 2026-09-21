import { apiFetch } from "./api";

export function createCategory(categoryName, color) {
    return apiFetch("/api/v1/categories", {
        method: "POST",
        body: JSON.stringify({
            name: categoryName,
            color
        }),
    });
}

export function getMyCategories() {
    return apiFetch("/api/v1/users/me/categories");
}

export function deleteCategory(uuid) {
    return apiFetch(`/api/v1/categories/${encodeURIComponent(uuid)}`, { method: "DELETE" });
}

export function updateCategory(uuid, changes) {
    return apiFetch(`/api/v1/categories/${encodeURIComponent(uuid)}`, {
        method: "PUT",
        body: JSON.stringify(changes),
    });
}
