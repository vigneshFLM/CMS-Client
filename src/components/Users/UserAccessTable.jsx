const AccessTable = ({ entries, onRevoke, revokingId, indexOfFirst }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>Resource</th>
          <th>Status</th>
          <th>Granted By</th>
          <th>Granted At</th>
        </tr>
      </thead>
      <tbody>
        {entries
          .filter((entry) => entry.access_status === "active")
          .map((entry, i) => (
            <tr key={entry.id}>
              <td>{indexOfFirst + i + 1}</td>
              <td>{entry.name}</td>
              <td className="status-active">{entry.access_status}</td>
              <td>{entry.granted_by_name}</td>
              <td>{new Date(entry.granted_at).toLocaleString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default AccessTable;
