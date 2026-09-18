import { useStudySessions } from "../../context/useStudySessions";
import TimeTableSummary from "../../components/TimeTableSummary/TimeTableSummary";

export default function Statistics() {
  const { studySessions, loading, error, refreshStudySessions } = useStudySessions();
  return <section style={{ maxWidth: "60rem", margin: "0 auto" }}>
    <h1>Statistics</h1>
    {loading && <p role="status">Loading study activity…</p>}
    {error && <p role="alert">{error} <button onClick={refreshStudySessions} disabled={loading}>Retry</button></p>}
    <TimeTableSummary sessions={studySessions} daysDisplayed={90} />
  </section>;
}
