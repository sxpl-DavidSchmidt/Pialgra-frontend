import { useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import styles from "./Profile.module.css";
import Popup from "../../components/Popup/Popup";

export default function Profile() {
  const { user, deleteAccount } = useAuth();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deletePending = useRef(false);

  async function confirmDeletion() {
    if (deletePending.current) return;
    deletePending.current = true;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount();
    } catch {
      setDeleteError("Could not delete your account. Please try again.");
    } finally {
      deletePending.current = false;
      setDeleting(false);
    }
  }
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 id="profile-title">Your profile</h1>
        <p className={styles.username}>{user.username}</p>
        <div className={`${styles.actions} ${styles.accountActions}`}>
          <button type="button" className={styles.deleteAccount} onClick={() => { setDeleteError(""); setShowDelete(true); }}>
            Delete account
          </button>
        </div>
        {showDelete && (
          <Popup className={styles.deleteAccountPopup} title="Delete account?" busy={deleting} onCancel={() => setShowDelete(false)}>
            <p>Are you sure? Your account, categories, and history will be permanently deleted. This cannot be undone.</p>
            {deleteError && <p role="alert" className={styles.error}>{deleteError}</p>}
            <div className={styles.actions}>
              <button autoFocus type="button" className={styles.cancel} disabled={deleting} onClick={() => setShowDelete(false)}>Cancel</button>
              <button type="button" className={styles.deleteAccount} disabled={deleting} onClick={confirmDeletion}>
                {deleting ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </Popup>
        )}
      </div>
    </section>
  );
}
