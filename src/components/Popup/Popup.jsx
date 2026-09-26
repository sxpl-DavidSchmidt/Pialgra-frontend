import { useEffect, useRef } from "react";
import styles from "./Popup.module.css";

export default function Popup({ title, busy = false, onCancel, className = "", children }) {
  const dialogRef = useRef(null);

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
    <dialog
      ref={dialogRef}
      className={`${styles.popup} ${className}`}
      onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}
    >
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
