import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import RequestFilters from "../components/MyRequests/RequestFilters";
import RequestForm from "../components/MyRequests/RequestForm";
import RequestTable from "../components/MyRequests/RequestTable";
import { IconLoader2 } from "@tabler/icons-react";
import "../styles/MyRequests.css";
import Pagination from "../components/Pagination";


const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [credentialOptions, setCredentialOptions] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    credential_id: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const { showNotification } = useNotification();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/requests/my-requests");
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRequests(sorted);
      setFiltered(sorted);
    } catch {
      showNotification("Failed to load your requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const list = requests.filter((r) => {
      const matchReason = r.reason.toLowerCase().includes(term);
      const matchStatus = !statusFilter || r.status === statusFilter;
      return matchReason && matchStatus;
    });
    setFiltered(list);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  const handleNewRequest = async () => {
    try {
      const res = await api.get("/credentials/names");
      setCredentialOptions(res.data);
      setRequestForm({ credential_id: "", reason: "" });
      setShowRequestForm(true);
    } catch {
      showNotification("Failed to load credentials", "error");
    }
  };

  const handleSubmit = async () => {
    if (!requestForm.credential_id || !requestForm.reason) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/requests", requestForm);
      showNotification("Request submitted successfully", "success");
      setShowRequestForm(false);
      fetchRequests();
    } catch (err) {
      showNotification(
        err.response?.data?.error || "Failed to submit request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / requestsPerPage);

  return (
    <div className="users-container">
      <RequestFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onNewRequest={handleNewRequest}
      />

      {showRequestForm && (
        <RequestForm
          credentialOptions={credentialOptions}
          requestForm={requestForm}
          setRequestForm={setRequestForm}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setShowRequestForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">
          <IconLoader2 className="spin" size={24} />
          <span>Loading your requests...</span>
        </div>
      ) : currentRequests.length === 0 ? (
        <p className="no-data">No data.</p>
      ) : (
        <>
          <RequestTable
            currentRequests={currentRequests}
            indexOfFirst={indexOfFirst}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default MyRequests;
