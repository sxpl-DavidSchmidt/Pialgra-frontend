import { useState } from "react";
import { updateCategory } from "../../api/categories";
import { useStudySessions } from "../../context/useStudySessions";
import { useStudyTimer } from "../../context/useStudyTimer";
import { CATEGORY_COLORS } from "../Timer/categoryColors";
import DeleteIcon from "../../assets/icons/delete.svg?react";
import Popup from "../Popup/Popup";
import SettingsIcon from "../../assets/icons/settings.svg?react";
import styles from "./CategoryComponent.module.css";
import colorStyles from "../Timer/Timer.module.css";

export default function CategoryComponent({ category }) {
    const { phase, loading, adding, deleting, deleteTarget, setDeleteTarget, error,
        requestCategoryDeletion, confirmCategoryDeletion } = useStudyTimer();
    const [editing, setEditing] = useState(false);
    return <>
        <div className={styles.category}>
            <span className={styles.swatch} style={{ backgroundColor: category.color || "var(--color-primary)" }} />
            <p>{category.name}</p>
            <div className={styles.categoryActions}>
                <button type="button" title="Edit category" onClick={() => setEditing(true)}><SettingsIcon /></button>
                <button type="button" title={phase !== "idle" ? "Finish or reset the timer before deleting a category" : "Delete category"}
                    disabled={phase !== "idle" || loading || adding || deleting}
                    onClick={() => requestCategoryDeletion(category.uuid)}><DeleteIcon className={styles.deleteIcon} /></button>
            </div>
        </div>
        {deleteTarget?.uuid === category.uuid && <Popup title="Delete category?" busy={deleting} onCancel={() => setDeleteTarget(null)}>
            <p>Delete "{category.name}"? Existing sessions will be kept without a category.</p>
            {error && <p>{error}</p>}
            <div className={styles.actions}>
                <button autoFocus type="button" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                <button type="button" className={styles.deleteButton} onClick={confirmCategoryDeletion} disabled={deleting}>
                    {deleting ? "Deleting…" : "Delete"}
                </button>
            </div>
        </Popup>}
        {editing && <CategoryPopup category={category} onCancel={() => setEditing(false)} />}
    </>;
}

function CategoryPopup({ category, onCancel }) {
    const { categoryUpdated } = useStudySessions();
    const [name, setName] = useState(category.name);
    const [color, setColor] = useState(() => CATEGORY_COLORS.find(option => option.value.toLowerCase() === category.color?.toLowerCase())?.value ?? CATEGORY_COLORS[0].value);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(event) {
        event.preventDefault();
        if (busy) return;
        if (!name.trim()) {
            setError("Enter a category name.");
            return;
        }
        setError("");
        setBusy(true);
        try {
            const updated = await updateCategory(category.uuid, { name: name.trim(), color });
            categoryUpdated(updated);
            onCancel();
        } catch {
            setError("Could not save this category. Please try again.");
            setBusy(false);
        }
    }

    return <Popup title="Edit category" busy={busy} onCancel={onCancel}>
        <form className={styles.form} onSubmit={submit}>
            <label>Name
                <input autoFocus type="text" required maxLength={100} value={name}
                    onChange={event => setName(event.target.value)} disabled={busy} />
            </label>
            <fieldset className={colorStyles.categoryColors} disabled={busy}>
                <legend>Category color</legend>
                <div className={colorStyles.colorChoices}>
                {CATEGORY_COLORS.map(option => (
                    <label key={option.value} className={colorStyles.colorChoice}>
                        <input type="radio" name="categoryColor" value={option.value} checked={color === option.value}
                            onChange={() => setColor(option.value)} />
                        <span className={colorStyles.colorSwatch} style={{ backgroundColor: option.value }} />
                        <span>{option.name}</span>
                    </label>
                ))}
                </div>
            </fieldset>
            {error && <p>{error}</p>}
            <div className={styles.actions}>
                <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>
                <button type="submit" className={styles.saveButton} disabled={busy || !name.trim()}>
                    {busy ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    </Popup>;
}
