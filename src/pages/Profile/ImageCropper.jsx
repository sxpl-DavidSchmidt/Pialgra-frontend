import { useRef, useState } from "react";
import styles from "./Profile.module.css";

export default function ImageCropper({ source, disabled, onApply, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const drag = useRef(null);
  const side = Math.min(source.image.naturalWidth, source.image.naturalHeight) / zoom;
  const maxX = source.image.naturalWidth - side;
  const maxY = source.image.naturalHeight - side;
  const x = maxX * horizontal / 100;
  const y = maxY * vertical / 100;

  function startDrag(event) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, horizontal, vertical, width: event.currentTarget.clientWidth };
  }

  function moveDrag(event) {
    if (!drag.current || disabled) return;
    const start = drag.current;
    const clamp = (value) => Math.max(0, Math.min(100, value));
    if (maxX > 0) setHorizontal(clamp(start.horizontal - (event.clientX - start.x) * side / start.width / maxX * 100));
    if (maxY > 0) setVertical(clamp(start.vertical - (event.clientY - start.y) * side / start.width / maxY * 100));
  }

  return (
    <fieldset className={styles.cropper} disabled={disabled}>
      <legend>Choose your frame</legend>
      <p className={styles.hint}>Drag the image or use the sliders to frame your picture. The circle shows how it will appear on your profile.</p>
      <div className={styles.cropFrame} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
        <img src={source.url} alt="Image inside the selected crop frame" draggable="false" style={{ width: `${source.image.naturalWidth / side * 100}%`, height: `${source.image.naturalHeight / side * 100}%`, left: `${-x / side * 100}%`, top: `${-y / side * 100}%` }} />
        <div className={styles.circleGuide} />
      </div>
      <label htmlFor="crop-zoom">Zoom</label>
      <input id="crop-zoom" type="range" min="1" max="4" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
      <label htmlFor="crop-horizontal">Horizontal position</label>
      <input id="crop-horizontal" type="range" min="0" max="100" step="0.1" value={horizontal} disabled={disabled || maxX === 0} onChange={(event) => setHorizontal(Number(event.target.value))} />
      <label htmlFor="crop-vertical">Vertical position</label>
      <input id="crop-vertical" type="range" min="0" max="100" step="0.1" value={vertical} disabled={disabled || maxY === 0} onChange={(event) => setVertical(Number(event.target.value))} />
      <p className={styles.hint}>Your selection will be saved as a square image up to 512 × 512 pixels.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.save} onClick={() => onApply({ x, y, side })}>{disabled ? "Preparing…" : "Use this frame"}</button>
        <button type="button" className={styles.remove} onClick={onCancel}>Cancel</button>
      </div>
    </fieldset>
  );
}
