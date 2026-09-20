import { useEffect, useId, useRef } from "react";
import styles from "./Popup.module.css";

// Mount to open; onCancel should unmount the popup. Callers own its content.
export default function Popup({ title, busy = false, onCancel, className = "", children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={`${styles.popup} ${className}`} aria-labelledby={titleId} aria-busy={busy}
      onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}>
      <center><h2 id={titleId}>{title}</h2></center>
      {children}
    </dialog>
  );
}
