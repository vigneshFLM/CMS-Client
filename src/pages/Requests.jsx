import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RequestsTable from '../components/Requests/RequestsTable';
import { useNotification } from '../context/NotificationContext';
import { handleApiError } from '../utils/errorHandler';
import "../styles/Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data);
      } catch (err) {
        handleApiError(err, showNotification, "Failed to fetch requests");
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="requests-container">
      <h2>Credential Requests</h2>
      {requests.length === 0 && <p className="info">No requests to show.</p>}
      <RequestsTable requests={requests} />
    </div>
  );
};

export default Requests;
