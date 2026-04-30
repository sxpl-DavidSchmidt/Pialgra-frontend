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
  subjectName,
  timeFrameDays = 30,
  workedHours = [],
  color = "#000000",
  cellSize = 25,
  onlyTable = false,
}) {
  const frameStart = new Date();
  frameStart.setDate(frameStart.getDate() - (timeFrameDays - 1));
  const firstWeekday = frameStart.getDay();

  const adjHours = [
    ...Array(firstWeekday).fill(null),
    ...workedHours.slice(-timeFrameDays),
  ];

  const { r, g, b } = hexToRgb(color);
  const table = (
    <div
      className={styles.activityTable}
      style={{
        gridTemplateColumns: `repeat(7, ${cellSize}px)`,
        gridTemplateRows: `auto repeat(${Math.ceil(adjHours.length / 7)}, ${cellSize}px)`,
      }}
    >
      {["", "Mo", "", "We", "", "Fr", ""].map((label, col) => (
        <div key={`label-${col}`} className={styles.weekdayLabel}>
          {label}
        </div>
      ))}

      {adjHours.map((hours, index) => {
        if (hours === null) {
          return <div key={`empty-${index}`} aria-hidden="true" />;
        }

        const day = index - firstWeekday + 1;
        const opacity = hours / Math.max(...adjHours, 0);;

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
