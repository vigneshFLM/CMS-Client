import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RequestsTable from '../components/Requests/RequestsTable';
import "../styles/Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch requests');
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="requests-container">
      <h2>Credential Requests</h2>
      {error && <p className="error">{error}</p>}
      <RequestsTable requests={requests} />
    </div>
  );
};

export default Requests;
