import { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";
import "./History.css";

export default function History() {
  const today = new Date();

  // Default date range: first day of this month until today
  const firstDay = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-01`;

  const currentDay = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Date filters
  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(currentDay);

  // Store history records
  const [history, setHistory] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load history automatically when the page opens
  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      try {
        const data = await apiRequest(
          `/api/timesheet/history?fromDate=${firstDay}&toDate=${currentDay}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        setHistory(data);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      controller.abort();
    };
  }, [firstDay, currentDay]);

  // Fetch history when Search is clicked
  async function fetchHistory(from, to) {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/api/timesheet/history?fromDate=${from}&toDate=${to}`,
        { cache: "no-store" },
      );

      setHistory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Search button
  function handleSearch() {
    if (!fromDate || !toDate) {
      setError("Please select both dates.");
      return;
    }

    if (fromDate > toDate) {
      setError("From Date cannot be after To Date.");
      return;
    }

    fetchHistory(fromDate, toDate);
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Timesheet History</h1>
        <p>View and track your daily work records.</p>
      </div>

      {/* Date filters */}
      <div className="history-filters">
        <div>
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {error && <p className="history-error">{error}</p>}

      {loading ? (
        <p className="history-message">Loading history...</p>
      ) : history.length === 0 ? (
        <div className="empty-history">
          <h3>No timesheets found</h3>
          <p>Try selecting another date range.</p>
        </div>
      ) : (
        <div className="history-container">
          {history.map((day) => (
            <div className="history-card" key={day.timesheetId}>
              <div className="card-header">
                <div>
                  <span className="date-label">WORK DATE</span>
                  <h2>
                    {new Date(day.workDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </h2>
                </div>

                <span className={`status-badge ${day.status.toLowerCase()}`}>
                  {day.status}
                </span>
              </div>

              <div className="total-time">
                <div className="clock-icon">◷</div>

                <div>
                  <span>Total working time</span>
                  <h3>
                    {Math.floor(day.totalMinutes / 60)}h {day.totalMinutes % 60}
                    m
                  </h3>
                </div>
              </div>

              <div className="tasks-section">
                <h3>Tasks completed</h3>

                {day.tasks.map((task) => (
                  <div className="history-task" key={task.id}>
                    <div className="task-dot"></div>

                    <div className="task-info">
                      <h4>{task.description}</h4>
                      <span>
                        {task.start} – {task.end}
                      </span>
                    </div>

                    <div className="task-duration">{task.minutes} min</div>
                  </div>
                ))}
              </div>

              {day.reviewedAt && (
                <div className="reviewed-info">
                  Reviewed on: {new Date(day.reviewedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
