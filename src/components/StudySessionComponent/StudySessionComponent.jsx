import styles from "./StudySessionComponent.module.css";
import { useState } from "react";
import Popup from "../Popup/Popup";
import { useStudySessions } from "../../context/useStudySessions";
import { updateStudySession, deleteStudySession } from "../../api/studySessions";

import DeleteIcon from "../../assets/icons/delete.svg?react";
import SettingsIcon from "../../assets/icons/settings.svg?react";

function formatTime(minutes) {
    const seconds = Math.floor(minutes * 60);
    const minutesPart = Math.floor(minutes);
    return `${minutesPart.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function StudySessionComponent({ session }) {
    const [popup, setPopup] = useState(null);
    const durationMinutes = (new Date(session.endTime) - new Date(session.startTime)) / 60000;

    return (
        <>
        <div
            className={styles.session}
            style={{ backgroundColor: session["category"]?.color || "var(--color-primary)" }}
        >
            <time>{formatTime(durationMinutes)}</time>
            <p>{session.category?.name || "Uncategorized"}</p>
            <div className={styles.actions}>
                <button type="button" onClick={() => setPopup("edit")}><SettingsIcon /></button>
                <button type="button" onClick={() => setPopup("delete")}><DeleteIcon className={styles.deleteIcon} /></button>
            </div>
        </div>
        {popup && <SessionPopup session={session} mode={popup} onCancel={() => setPopup(null)} />}
        </>
    );
}

function sessionDuration(session) {
    const seconds = Math.max(1, Math.round((new Date(session.endTime) - new Date(session.startTime)) / 1000));
    if (!Number.isFinite(seconds)) return "";
    return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
        .map(part => String(part).padStart(2, "0")).join(":");
}

function SessionPopup({ session, mode, onCancel }) {
    const { categories, sessionUpdated, sessionDeleted } = useStudySessions();
    const [categoryUuid, setCategoryUuid] = useState(session.category?.uuid ?? "");
    const [duration, setDuration] = useState(() => sessionDuration(session));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const deleting = mode === "delete";

    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        setError("");
        let end;
        if (!deleting) {
            if (!/^\d{2,}:[0-5]\d:[0-5]\d$/.test(duration)) {
                setError("Enter a duration in HH:MM:SS format, with minutes and seconds from 00 to 59.");
                return;
            }
            const [hours, minutes, seconds] = duration.split(":").map(Number);
            const durationSeconds = hours * 3600 + minutes * 60 + seconds;
            // Preserve subsecond precision when only the category is changed.
            end = duration === sessionDuration(session)
                ? new Date(session.endTime)
                : new Date(new Date(session.startTime).getTime() + durationSeconds * 1000);
            if (durationSeconds <= 0 || !Number.isFinite(end.getTime())) {
                setError("Enter a valid duration greater than 00:00:00.");
                return;
            }
        }
        setBusy(true);
        try {
            if (deleting) {
                await deleteStudySession(session.uuid);
                sessionDeleted(session.uuid);
            } else {
                const updated = await updateStudySession(session.uuid, {
                    categoryUuid: categoryUuid || null,
                    startTime: session.startTime,
                    endTime: end.toISOString(),
                });
                sessionUpdated(updated);
            }
            onCancel();
        } catch {
            setError(`Could not ${deleting ? "delete" : "save"} this session. Please try again.`);
            setBusy(false);
        }
    }

    return (
        <Popup title={deleting ? "Delete study session?" : "Edit study session"} busy={busy} onCancel={onCancel}>
            <form className={styles.popupForm} onSubmit={submit}>
                {deleting ? <p>Delete this {session.category?.name || "uncategorized"} session? This cannot be undone.</p> : <>
                    <label>Category
                        <select autoFocus value={categoryUuid} onChange={event => setCategoryUuid(event.target.value)} disabled={busy}>
                            <option value="">Uncategorized</option>
                            {categories.map(category => <option key={category.uuid} value={category.uuid}>{category.name}</option>)}
                        </select>
                    </label>
                    <label>Duration (HH:MM:SS)
                        <input type="text" required placeholder="00:25:00" value={duration}
                            onChange={event => setDuration(event.target.value)} disabled={busy} />
                    </label>
                </>}
                {error && <p>{error}</p>}
                <div className={styles.popupActions}>
                    <button autoFocus={deleting} type="button" onClick={onCancel} disabled={busy}>Cancel</button>
                    <button type="submit" className={deleting ? styles.deleteButton : styles.saveButton} disabled={busy}>
                        {busy ? (deleting ? "Deleting…" : "Saving…") : (deleting ? "Delete" : "Save")}
                    </button>
                </div>
            </form>
        </Popup>
    );
}
