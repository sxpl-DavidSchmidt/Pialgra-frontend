import SubjectCard from "./SubjectCard/SubjectCard.jsx";
import SubjectSummary from "./SubjectSummary/SubjectSummary.jsx";
import TimeTable from "./TimeTable/TimeTable.jsx";
import NavBar from "./NavBar/NavBar.jsx";

export default function App() {
  const year = 2026;
  const month = 2;

  const workedHours = Array.from(
    { length: new Date(year, month + 1, 0).getDate() },
    () => Math.floor(Math.random() * 8),
  );

  return (
    <main>
      <NavBar />
      <SubjectCard
        subjectName="Computer Science"
        imageSrc="https://avatars.githubusercontent.com/u/62205605?v=4"
      />

      <SubjectSummary
        subject={{
          name: "Computer Science",
          sessions: workedHours,
        }}
      />

      <TimeTable
        year={year}
        month={month}
        workedHours={workedHours}
        cellSize={15}
        subjectName="Computer Science"
        color="#000000"
      />
    </main>
  );
}
