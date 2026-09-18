import { apiFetch } from "./api";

export function getMyProfilePicture() {
    return apiFetch("/api/v1/users/me/profile-picture");
}

export function uploadMyProfilePicture(file) {
    const body = new FormData();
    body.append("image", file);
    return apiFetch("/api/v1/users/me/profile-picture", { method: "PUT", body });
}

export function removeMyProfilePicture() {
    return apiFetch("/api/v1/users/me/profile-picture", { method: "DELETE" });
}
