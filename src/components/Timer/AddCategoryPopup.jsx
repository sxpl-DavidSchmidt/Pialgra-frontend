import { useStudyTimer } from "../../context/useStudyTimer";
import { CATEGORY_COLORS } from "./categoryColors";
import Popup from "../Popup/Popup";
import styles from "./Timer.module.css";

export default function AddCategoryPopup() {
  const { newCategory, setNewCategory, newCategoryColor, setNewCategoryColor,
    showAdd, setShowAdd, adding, handleAddCategory, error } = useStudyTimer();
  return (
    <>
          {showAdd && (
            <Popup className={styles.addCategoryPopup} title="Add category" busy={adding} onCancel={() => setShowAdd(false)}>
              <form onSubmit={event => { event.preventDefault(); void handleAddCategory(); }}>
                <input
                  autoFocus
                  type="text"
                  value={newCategory}
                  aria-label="Category name" placeholder="New category..." maxLength={100} disabled={adding}
                  onChange={(e) => setNewCategory(e.target.value)}
                />

                <fieldset className={styles.categoryColors} disabled={adding}>
                  <legend>Category color</legend>
                  <div className={styles.colorChoices}>
                    {CATEGORY_COLORS.map(color => (
                      <label key={color.value} className={styles.colorChoice}>
                        <input type="radio" name="categoryColor" value={color.value}
                          checked={newCategoryColor === color.value}
                          onChange={() => setNewCategoryColor(color.value)} />
                        <span className={styles.colorSwatch} style={{ backgroundColor: color.value }}>
                        </span>
                        <span>{color.name}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={adding || !newCategory.trim()} className={styles.popupAddButton}>
                  Add
                </button>

                <button type="button" onClick={() => setShowAdd(false)} disabled={adding} className={styles.popupCancelButton}>
                  Cancel
                </button>
              </form>
            </Popup>
          )}
    </>
  );
}
