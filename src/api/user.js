import { apiFetch } from "./api";

export function getMyProfilePicture() {
    return apiFetch("/api/v1/users/me/profile-picture");
}