import React, { useEffect, useState } from "react";
import requestApi from "../api/requestsApi";
import { useNotification } from "../context/NotificationContext";
import RequestFilters from "../components/MyRequests/RequestFilters";
import RequestForm from "../components/MyRequests/RequestForm";
import RequestTable from "../components/MyRequests/RequestTable";
import RequestView from "../components/MyRequests/RequestView";
import Pagination from "../components/Pagination";
import { IconLoader2 } from "@tabler/icons-react";
import "../styles/MyRequests.css";
import { handleApiError } from "../utils/errorHandler";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [credentialOptions, setCredentialOptions] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [requestForm, setRequestForm] = useState({
    credential_id: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [showRequestView, setShowRequestView] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);

  const { showNotification } = useNotification();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestApi.getMyRequests();
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRequests(sorted);
      setFiltered(sorted);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load your requests");
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
      const matchCredential = r.credential_name?.toLowerCase().includes(term);
      const matchStatus = !statusFilter || r.status === statusFilter;
      return (matchReason || matchCredential) && matchStatus;
    });
    setFiltered(list);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  const handleNewRequest = async () => {
    try {
      const res = await requestApi.getCredentialNames();
      setCredentialOptions(res.data);
      setRequestForm({ credential_id: "", reason: "" });
      setEditingRequestId(null);
      setShowRequestForm(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load credentials");
    }
  };

  const handleSubmit = async () => {
    if (!requestForm.credential_id || !requestForm.reason) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    try {
      setSubmitting(true);
      if (editingRequestId) {
        await requestApi.update(editingRequestId, requestForm);
        showNotification("Request updated successfully", "success");
      } else {
        await requestApi.create(requestForm);
        showNotification("Request submitted successfully", "success");
      }
      setShowRequestForm(false);
      fetchRequests();
    } catch (err) {
      handleApiError(err, showNotification, "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestDelete = async (id) => {
    try {
      await requestApi.delete(id);
      showNotification("Request deleted successfully", "success");
      fetchRequests();
    } catch (err) {
      handleApiError(err, showNotification, "Failed to delete request");
    }
  };

  const handleRequestEdit = async (id) => {
    try {
      const res = await requestApi.getById(id);
      const req = res.data;
      setRequestForm({
        credential_id: req.credential_id,
        reason: req.reason,
      });
      setEditingRequestId(id);
      setShowRequestForm(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch request for editing");
    }
  };

  const handleRequestView = async (id) => {
    try {
      const res = await requestApi.getById(id);
      const req = res.data;
      setSelectedRequestData(req);
      setShowRequestView(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to view request");
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
      <RequestView
        show={showRequestView}
        data={selectedRequestData}
        onClose={() => setShowRequestView(false)}
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
        <p className="no-data">No requests found.</p>
      ) : (
        <>
          <RequestTable
            currentRequests={currentRequests}
            indexOfFirst={indexOfFirst}
            onEdit={handleRequestEdit}
            onView={handleRequestView}
            onDelete={handleRequestDelete}
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
