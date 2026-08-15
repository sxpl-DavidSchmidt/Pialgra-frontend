import { apiFetch } from "./api";

export function createStudySession(categoryUuid, startTime, endTime) {
    return apiFetch("/api/v1/study-sessions", {
        method: "POST",
        body: JSON.stringify({
            categoryUuid,
            startTime,
            endTime,
        }),
    });
}

export function getMyStudySessions() {
    return apiFetch("/api/v1/users/me/study-sessions");
}
