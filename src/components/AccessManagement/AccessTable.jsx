const AccessTable = ({ entries, onRevoke, revokingId, indexOfFirst }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>S.no</th>
          <th>User</th>
          <th>Email</th>
          <th>Resource</th>
          <th>Status</th>
          <th>Granted By</th>
          <th>Granted At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={entry.id}>
            <td>{indexOfFirst + i + 1}</td>
            <td>{entry.user_name}</td>
            <td>{entry.user_email}</td>
            <td>{entry.credential_name}</td>
            <td className={entry.status === "revoked" ? "status-revoked" : "status-active"}>
              {entry.status}
            </td>
            <td>{entry.granted_by_name}</td>
            <td>{new Date(entry.created_at).toLocaleString()}</td>
            <td>
              {entry.status === "active" ? (
                <button
                  className="revoke-button"
                  disabled={revokingId === `${entry.user_id}-${entry.resource_id}`}
                  onClick={() => onRevoke(entry.user_id, entry.resource_id)}
                >
                  {revokingId === `${entry.user_id}-${entry.resource_id}` ? "Revoking..." : "Revoke"}
                </button>
              ) : (
                "Revoked"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AccessTable;
