import { useRef, useState } from 'react';
import EmployeePopup from './EmployeePopup';
import './people.css';

const POPUP_HEIGHT = 360;

// Table of employees. Hovering a row opens a popup with that employee's objectives.
function EmployeesTable({
  employees,
  objectives,
  showOrg,
  canReview,
  onApprove,
  onReject,
}) {
  const [open, setOpen] = useState(null); // { employee, top, left }
  const timer = useRef(null);

  function cancelClose() {
    clearTimeout(timer.current);
  }

  // small delay so the mouse can move from the row into the popup
  function scheduleClose() {
    cancelClose();
    timer.current = setTimeout(() => setOpen(null), 250);
  }

  function openFor(employee, event) {
    cancelClose();
    const rect = event.currentTarget.getBoundingClientRect();
    const fitsBelow = rect.bottom + POPUP_HEIGHT < window.innerHeight;
    setOpen({
      employee,
      top: fitsBelow ? rect.bottom + 4 : Math.max(8, rect.top - POPUP_HEIGHT - 4),
      left: rect.left,
    });
  }

  function objectivesOf(employee) {
    return objectives.filter((o) => o.userId === employee.id);
  }

  function averageProgress(list) {
    if (list.length === 0) return 0;
    const sum = list.reduce((total, o) => total + (o.progress ?? 0), 0);
    return Math.round(sum / list.length);
  }

  if (employees.length === 0) {
    return <div className="card"><p className="muted">No employees to show.</p></div>;
  }

  return (
    <div className="card people-card">
      <table className="people-table">
        <thead>
          <tr>
            <th>Employee</th>
            {showOrg && <th>Department</th>}
            {showOrg && <th>Manager</th>}
            <th>Objectives</th>
            <th>Pending</th>
            <th>Average progress</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const list = objectivesOf(employee);
            const pending = list.filter((o) => o.status === 'PendingApproval').length;
            const avg = averageProgress(list);
            return (
              <tr
                key={employee.id}
                onMouseEnter={(e) => openFor(employee, e)}
                onMouseLeave={scheduleClose}
                onClick={(e) => openFor(employee, e)}
              >
                <td>
                  <strong>{employee.fullName}</strong>
                  {employee.email && <div className="muted">{employee.email}</div>}
                </td>
                {showOrg && <td>{employee.department || '-'}</td>}
                {showOrg && <td>{employee.managerName || '-'}</td>}
                <td>{list.length}</td>
                <td>{pending}</td>
                <td>
                  <div className="mini-bar">
                    <div className="mini-bar-fill" style={{ width: `${avg}%` }} />
                  </div>
                  <span className="muted">{avg}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {open && (
        <EmployeePopup
          employee={open.employee}
          objectives={objectivesOf(open.employee)}
          canReview={canReview}
          onApprove={onApprove}
          onReject={onReject}
          style={{ top: open.top, left: open.left }}
          onEnter={cancelClose}
          onLeave={scheduleClose}
        />
      )}
    </div>
  );
}

export default EmployeesTable;