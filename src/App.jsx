import SubjectCard from "./SubjectCard/SubjectCard.jsx";
import TimeTable from "./TimeTable/TimeTable.jsx";

function App() {
  const year = 2026;
  const month = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const workedHours = Array.from({ length: daysInMonth }, () =>
    Math.floor(Math.random() * 8)
  );

  return (
    <>
      <SubjectCard
        subjectName="Computer Science"
        imageSrc="https://avatars.githubusercontent.com/u/62205605?v=4"
      />

      <TimeTable
        year={year}
        month={month}
        workedHours={workedHours}
        cellSize={15}
        subjectName="Computer Science"
        color="#000000"
      />
    </>
  );
}

export default App;
