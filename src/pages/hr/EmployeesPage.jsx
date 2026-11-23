import { useEffect, useState } from 'react';
import { getHrEmployees, getHrObjectives } from '../../api/hrApi';
import EmployeesTable from '../people/EmployeesTable';

// HR (Admin) page: "All employees". Hover an employee to see his objectives (read only).
function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [emps, objs] = await Promise.all([getHrEmployees(), getHrObjectives()]);
        setEmployees(emps);
        setObjectives(objs.filter((o) => o.status !== 'Draft'));
      } catch (err) {
        setError(err.message || 'Could not load the employees.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1>All employees</h1>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && (
        <EmployeesTable
          employees={employees}
          objectives={objectives}
          showOrg
          canReview={false}
        />
      )}
    </div>
  );
}

export default EmployeesPage;