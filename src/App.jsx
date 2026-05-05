import SubjectCard from "./SubjectCard/SubjectCard.jsx";
import SubjectSummary from "./SubjectSummary/SubjectSummary.jsx";
import TimeTable from "./TimeTable/TimeTable.jsx";
import NavBar from "./NavBar/NavBar.jsx";

export default function App() {
  const year = 2026;
  const month = 2;

  const workedHours = Array.from(
    { length: 127 },
    () => Math.floor(Math.random() * 8),
  );

  return (
    <main>
      <NavBar />
      <SubjectCard
        subjectName="Computer Science"
        imageSrc="https://avatars.githubusercontent.com/u/62205605?v=4"
      />

      <TimeTable workedHours={workedHours} subjectName="Computer Science" timeFrameDays={45} />

      <SubjectSummary name="Computer Science" sessions={workedHours} />
    </main>
  );
}
