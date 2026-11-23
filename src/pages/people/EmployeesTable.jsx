import { useRef, useState } from 'react';
import EmployeePopup from './EmployeePopup';
import './people.css';

const POPUP_MAX = 420;

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
    const spaceBelow = window.innerHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;

    // normally below the row; above only when there is clearly more room there
    const below = spaceBelow >= 220 || spaceBelow >= spaceAbove;
    const maxHeight = Math.min(POPUP_MAX, below ? spaceBelow : spaceAbove);

    setOpen({
      employee,
      style: below
        ? { top: rect.bottom + 4, left: rect.left, maxHeight }
        : { bottom: window.innerHeight - rect.top + 4, left: rect.left, maxHeight },
    });
  }

  function objectivesOf(employee) {
    return objectives.filter((o) => o.userId === employee.id);
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
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const list = objectivesOf(employee);
            const pending = list.filter((o) => o.status === 'PendingApproval').length;
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
          style={open.style}
          onEnter={cancelClose}
          onLeave={scheduleClose}
        />
      )}
    </div>
  );
}

export default EmployeesTable;