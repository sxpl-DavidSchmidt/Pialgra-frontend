import styles from "./TimeTable.module.css";

function hexToRgb(hex) {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);
  const safeHex = isValidHex ? hex : "#000000";

  return {
    r: parseInt(safeHex.slice(1, 3), 16),
    g: parseInt(safeHex.slice(3, 5), 16),
    b: parseInt(safeHex.slice(5, 7), 16),
  };
}

export default function TimeTable({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  workedHours = [],
  color = "#000000",
  cellSize = 25,
  onlyTable = false,
  subjectName,
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  console.log("First weekday:", new Date(year, month, 1).getDay().toLocaleString("en-US", { weekday: "long" }));

  const hoursForMonth = workedHours.slice(0, daysInMonth);
  const paddedHours = [...Array(firstWeekday).fill(null), ...hoursForMonth];

  const maxHours = Math.max(...hoursForMonth, 0);
  const { r, g, b } = hexToRgb(color);

  const rows = Math.ceil(paddedHours.length / 7);

  const getCellOpacity = (hours) => {
    if (!maxHours) return 0;
    return Math.min(hours / maxHours, 1);
  };

  const weekdayLabels = ["", "Mo", "", "We", "", "Fr", ""];

  const table = (
    <div
      className={styles.activityTable}
      style={{
        gridTemplateColumns: `repeat(7, ${cellSize}px)`,
        gridTemplateRows: `auto repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {weekdayLabels.map((label, col) => (
        <div key={`label-${col}`} className={styles.weekdayLabel}>
          {label}
        </div>
      ))}

      {paddedHours.map((hours, index) => {
        if (hours === null) {
          return <div key={`empty-${index}`} aria-hidden="true" />;
        }

        const day = index - firstWeekday + 1;
        const opacity = getCellOpacity(hours);

        return (
          <div
            key={`day-${day}`}
            className={styles.activityCell}
            title={`Day ${day}: ${hours} hour${hours === 1 ? "" : "s"}`}
            style={{
              "--row": `${Math.floor(index / 7)}`,
              "--col": `${index % 7}`,
              width: cellSize,
              height: cellSize,
              backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
            }}
          />
        );
      })}
    </div>
  );

  if (onlyTable) return table;

  return (
    <div className={styles.activityCard}>
      <h3 style={{ marginBottom: `15px` }}>{subjectName}</h3>
      {table}
    </div>
  );
}
