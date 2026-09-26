import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import styles from "./Profile.module.css";
import ImageCropper from "./ImageCropper";
import Popup from "../../components/Popup/Popup";

export default function Profile() {
  const { user, profilePicture, pictureLoading, pictureError, updateProfilePicture, deleteAccount } = useAuth();
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const input = useRef(null);
  const [source, setSource] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const selection = useRef(0);

  useEffect(() => () => { selection.current += 1; }, []);
  useEffect(() => () => {
    if (source) URL.revokeObjectURL(source.url);
  }, [source]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function selectPicture(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const request = ++selection.current;
    setMessage("");
    setError("");
    setFile(null);
    setPreview(null);
    setSource(null);
    if (!["image/png", "image/jpeg"].includes(selected.type) || selected.size > 10 * 1024 * 1024) {
      setError("Choose a PNG or JPG image no larger than 10 MB.");
      event.target.value = "";
      return;
    }
    setPreparing(true);
    const url = URL.createObjectURL(selected);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (request !== selection.current) {
        URL.revokeObjectURL(url);
        return;
      }
      if (image.naturalWidth !== image.naturalHeight || image.naturalWidth > 512) {
        setSource({ image, url });
      } else {
        setFile(selected);
        setPreview(url);
      }
    } catch {
      URL.revokeObjectURL(url);
      if (request === selection.current) {
        setError("Could not read this image. Please choose another PNG or JPG.");
        input.current.value = "";
      }
    } finally {
      if (request === selection.current) setPreparing(false);
    }
  }

  async function applyFrame({ x, y, side }) {
    const request = selection.current;
    setPreparing(true);
    setError("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = Math.min(512, Math.max(1, Math.round(side)));
      const context = canvas.getContext("2d");
      context.imageSmoothingQuality = "high";
      context.drawImage(source.image, x, y, side, side, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not prepare image")), "image/png"));
      if (request !== selection.current) return;
      setFile(new File([blob], "profile-picture.png", { type: "image/png" }));
      setPreview(URL.createObjectURL(blob));
      setSource(null);
    } catch {
      if (request === selection.current) setError("Could not prepare your picture. Please try another frame or image.");
    } finally {
      if (request === selection.current) setPreparing(false);
    }
  }

  function cancelFrame() {
    setSource(null);
    setError("");
    input.current.value = "";
  }

  async function savePicture(remove = false) {
    if (preparing || saving || (!remove && (!file || source))) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateProfilePicture(remove ? null : file);
      setFile(null);
      setPreview(null);
      setSource(null);
      input.current.value = "";
      setMessage(remove ? "Default profile picture restored." : "Profile picture updated.");
    } catch (error) {
      setError(error.status === 413 ? "Choose an image no larger than 10 MB." : error.message || "Could not update your picture. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 id="profile-title">Your profile</h1>
        <p className={styles.username}>{user.username}</p>
        <img className={styles.picture} src={preview || profilePicture} alt={preview ? "New profile picture preview" : "Your profile picture"} />
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); savePicture(); }}>
          <label htmlFor="profile-picture">Profile picture</label>
          <p id="picture-help" className={styles.hint}>Choose a PNG or JPG up to 10 MB. Larger or non-square images can be cropped and resized before saving.</p>
          <input ref={input} id="profile-picture" type="file" accept="image/png,image/jpeg" onChange={selectPicture} disabled={saving || preparing || pictureLoading} />
          {source && <ImageCropper key={source.url} source={source} disabled={preparing || saving} onApply={applyFrame} onCancel={cancelFrame} />}
          <div className={styles.actions}>
            <button className={styles.save} type="submit" disabled={!file || source || preparing || saving || pictureLoading}>{saving ? "Saving…" : "Save picture"}</button>
            <button className={styles.remove} type="button" onClick={() => savePicture(true)} disabled={preparing || saving || pictureLoading}>Remove picture</button>
          </div>
        </form>
        {pictureLoading && <p>Loading picture…</p>}
        {preparing && <p>Preparing picture…</p>}
        {(error || pictureError) && <p className={styles.error}>{error || pictureError}</p>}
        {message && <p className={styles.success}>{message}</p>}

        <div className={`${styles.actions} ${styles.accountActions}`}>
          <button type="button" className={styles.deleteAccount} disabled={saving || preparing} onClick={() => { setDeleteError(""); setShowDelete(true); }}>
            Delete account
          </button>
        </div>
        {showDelete && (
          <Popup className={styles.deleteAccountPopup} title="Delete account?" busy={deleting} onCancel={() => setShowDelete(false)}>
            <p>Are you sure? Your account, profile picture, categories, and history will be permanently deleted. This cannot be undone.</p>
            {deleteError && <p role="alert" className={styles.error}>{deleteError}</p>}
            <div className={styles.actions}>
              <button autoFocus type="button" className={styles.remove} disabled={deleting} onClick={() => setShowDelete(false)}>Cancel</button>
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
