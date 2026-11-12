// Temporary demo page: only to check that the shared theme looks right.
// Whoever builds the real routing replaces this file.
function App() {
  return (
    <div className="page">
      <h1>Performance Hub</h1>
      <p className="muted-text">Theme check: this page must look light.</p>

      <div className="card">
        <h3>Sample card</h3>
        <p>
          <span className="badge badge-warning">Pending</span>{' '}
          <span className="badge badge-success">Approved</span>{' '}
          <span className="badge badge-danger">Rejected</span>
        </p>

        <div className="field">
          <label htmlFor="demo">Sample input</label>
          <input id="demo" className="input" placeholder="Type here" />
        </div>

        <p>
          <button className="btn">Primary</button>{' '}
          <button className="btn btn-secondary">Secondary</button>{' '}
          <button className="btn btn-danger">Danger</button>
        </p>
      </div>
    </div>
  );
}

export default App;
