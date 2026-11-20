
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/client";

import taskImage_to_do from "../../assets/TimeSheet/to-do-list.png";
import History from "./History";
import EmployeesTasks from "./EmployeesTasks";

import "./TimeSheetApp.css";

function TimeSheetApp() {
  const { user } = useAuth();

  // Check whether the logged-in user is a manager
  const canReviewEmployees = user?.isManager === true;

  // Current Timesheet page
  const [activePage, setActivePage] = useState("My Tasks");

  // Tasks and Timesheet information
  const [tasks, setTasks] = useState([]);
  const [timesheetId, setTimesheetId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Form input values
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Add a new task
  async function addTask() {
    if (!description || !startTime || !endTime) {
      alert("Please fill in all fields");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      const today = new Date();

      const workDate =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      const data = await apiRequest("/api/timesheet/tasks", {
        method: "POST",
        body: JSON.stringify({
          workDate,
          description,
          start: startTime + ":00",
          end: endTime + ":00",
        }),
      });

      setTimesheetId(data.timesheetId);
      setTasks((previousTasks) => [...previousTasks, data.task]);

      setDescription("");
      setStartTime("");
      setEndTime("");

      alert("Task added successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  // Delete a task
  async function deleteTask(id) {
    try {
      await apiRequest(`/api/timesheet/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  // Submit the Timesheet
  async function submitTimesheet() {
    if (tasks.length === 0) {
      alert("Please add at least one task");
      return;
    }

    if (!timesheetId) {
      alert("Timesheet ID not found. Please add a task first.");
      return;
    }

    try {
      const data = await apiRequest(
        `/api/timesheet/submit/${timesheetId}`,
        {
          method: "POST",
        }
      );

      setSubmitted(true);

      alert(
        `Timesheet submitted successfully! Status: ${data?.status ?? "Submitted"}`
      );
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <section className="timesheet-page">
      {/* Timesheet navigation */}
      <div className="timesheet-navigation">
        <h2>My Timesheet</h2>

        <nav aria-label="Timesheet navigation">
          <button
            type="button"
            className={
              activePage === "My Tasks"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("My Tasks")}
          >
            My Tasks
          </button>

          <button
            type="button"
            className={
              activePage === "History"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("History")}
          >
            History
          </button>

          {canReviewEmployees && (
            <button
              type="button"
              className={
                activePage === "Employees Tasks"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActivePage("Employees Tasks")}
            >
              Employees Tasks
            </button>
          )}
        </nav>
      </div>

      {/* Timesheet page content */}
      <div className="timesheet-content">
        {activePage === "My Tasks" ? (
          <>
            <div className="page-heading">
              <h1>Daily Tasks</h1>

              <img
                src={taskImage_to_do}
                alt="To-do list"
                className="heading-image"
              />
            </div>

            <p>Enter your work tasks below</p>

            {/* Add New Task Form */}
            <div className="task-form">
              <h2>Add New Task</h2>

              <label>Task Description</label>
              <input
                type="text"
                placeholder="Add task for today :)"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                disabled={submitted}
              />

              <label>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                disabled={submitted}
              />

              <label>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                disabled={submitted}
              />

              <button onClick={addTask} disabled={submitted}>
                Add Task
              </button>
            </div>

            {/* Tasks List */}
            <div className="tasks-list">
              <h2>My Tasks List</h2>

              {tasks.length === 0 ? (
                <p className="empty-message">
                  No tasks added yet
                </p>
              ) : (
                tasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <div className="task-details">
                      <h3>{task.description}</h3>
                      <p>
                        {task.start} - {task.end}
                      </p>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      disabled={submitted}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}

              <button
                className="submit-button"
                onClick={submitTimesheet}
                disabled={submitted}
              >
                {submitted ? "Submitted" : "Submit Timesheet"}
              </button>
            </div>
          </>
        ) : activePage === "History" ? (
          <History />
        ) : canReviewEmployees ? (
          <EmployeesTasks />
        ) : (
          <div>
            <h2>Access denied</h2>
            <p>You do not have permission to view this page.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TimeSheetApp;
