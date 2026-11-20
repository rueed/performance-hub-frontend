import { useState, useEffect } from "react";
import { apiRequest } from "../../api/client";
import "./EmployeesTasks.css";

export default function EmployeesTasks() {
  // Store all pending timesheets
  const [pendingSheets, setPendingSheets] = useState([]);

  // Track loading state
  const [loading, setLoading] = useState(true);

  // Store error messages
  const [error, setError] = useState("");

  // Fetch pending timesheets from the backend
  useEffect(() => {
    const controller = new AbortController();

    async function fetchPending() {
      try {
        const data = await apiRequest("/api/timesheet/pending", {
          signal: controller.signal,
          cache: "no-store",
        });

        setPendingSheets(data);
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

    fetchPending();

    return () => {
      controller.abort();
    };
  }, []);

  // Approve or reject a timesheet
  async function reviewTimesheet(timesheetId, approve) {
    try {
      await apiRequest(
        `/api/timesheet/review/${timesheetId}?approve=${approve}`,
        {
          method: "POST",
        },
      );

      // Remove the reviewed timesheet from the pending list
      setPendingSheets((oldSheets) =>
        oldSheets.filter((sheet) => sheet.timesheetId !== timesheetId),
      );

      alert(
        approve
          ? "Timesheet approved successfully!"
          : "Timesheet rejected successfully!",
      );
    } catch (error) {
      alert(error.message);
    }
  }

  // Display the page
  return (
    <div className="employees-tasks">
      <h1>Employees Tasks</h1>

      <p>Review submitted employee timesheets</p>

      {/* Loading state */}
      {loading ? (
        <p>Loading pending timesheets...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : pendingSheets.length === 0 ? (
        <p className="empty-message">No pending timesheets found.</p>
      ) : (
        pendingSheets.map((sheet) => (
          <div className="employee-card" key={sheet.timesheetId}>
            <h2>Employee #{sheet.employeeId}</h2>

            <p>
              <strong>Work Date:</strong> {sheet.workDate}
            </p>

            <p>
              <strong>Total Hours:</strong>{" "}
              {(sheet.totalMinutes / 60).toFixed(2)}
            </p>

            <h3>Tasks</h3>

            {/* Display tasks belonging to this timesheet */}
            {sheet.tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <h4>{task.description}</h4>

                <p>
                  {task.start} - {task.end}
                </p>

                <p>{task.minutes} minutes</p>
              </div>
            ))}

            {/* Approve and Reject buttons */}
            <div className="review-buttons">
              <button
                className="approve-button"
                onClick={() => reviewTimesheet(sheet.timesheetId, true)}
              >
                Approve
              </button>

              <button
                className="reject-button"
                onClick={() => reviewTimesheet(sheet.timesheetId, false)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
