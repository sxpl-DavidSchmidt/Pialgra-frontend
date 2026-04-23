import SubjectCard from "./SubjectCard/SubjectCard.jsx";
import TimeTable from "./TimeTable/TimeTable.jsx";

function App() {
  const workedHours = Array.from({ length: 31 }, () => Math.floor(Math.random() * 8));

  return(
    <>
      <SubjectCard subjectName="Computer Science" imageSrc="https://avatars.githubusercontent.com/u/62205605?v=4"/>
      <SubjectCard subjectName="Data Structures"/>
      <TimeTable year={2026} month={0} workedHours={workedHours} cellSize={15} subjectName="Computer Science" color="#000000"/>
    </>
  );
}

export default App
