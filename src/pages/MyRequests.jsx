import React, { useEffect, useState, useCallback } from "react";
import requestApi from "../api/requestsApi";
import { useNotification } from "../context/NotificationContext";
import RequestFilters from "../components/MyRequests/RequestFilters";
import RequestForm from "../components/MyRequests/RequestForm";
import RequestTable from "../components/MyRequests/RequestTable";
import RequestView from "../components/MyRequests/RequestView";
import Pagination from "../components/Pagination";
import ConfirmationOverlay from "../components/ConfirmationOverlay"; // use your overlay
import { IconLoader2 } from "@tabler/icons-react";
import "../styles/MyRequests.css";
import { handleApiError } from "../utils/errorHandler";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [resourceOptions, setResourceOptions] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [requestForm, setRequestForm] = useState({
    resource_id: "",
    reason: "",
    type: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [showRequestView, setShowRequestView] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);

  // Overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({
    actionType: "",
    data: null,
  });

  const { showNotification } = useNotification();

  const fetchRequests = useCallback(async () => {
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
  }, [showNotification]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    const term = search.toLowerCase();
    const list = requests.filter((r) => {
      const matchReason = r.reason.toLowerCase().includes(term);
      const matchCredential = r.resource_name?.toLowerCase().includes(term);
      const matchStatus = !statusFilter || r.status === statusFilter;
      return (matchReason || matchCredential) && matchStatus;
    });
    setFiltered(list);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  const handleNewRequest = async () => {
    try {
      const res = await requestApi.getResourceNames();
      setResourceOptions(res.data);
      setRequestForm({ resource_id: "", reason: "" });
      setEditingRequestId(null);
      setShowRequestForm(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load resources");
    }
  };

  // Show confirmation overlay for action
  const confirmAction = (actionType, data = null) => {
    setOverlayData({ actionType, data });
    setShowOverlay(true);
  };

  const handleOverlayConfirm = async () => {
    const { actionType, data } = overlayData;
    setShowOverlay(false);

    try {
      setSubmitting(true);
      switch (actionType) {
        case "deleteRequest":
          await requestApi.delete(data.id);
          showNotification("Request deleted successfully", "success");
          break;
        case "addRequest":
          await requestApi.create(requestForm);
          showNotification("Request submitted successfully", "success");
          break;
        case "editRequest":
          await requestApi.update(editingRequestId, requestForm);
          showNotification("Request updated successfully", "success");
          break;
        default:
          break;
      }
      fetchRequests();
      setShowRequestForm(false);
      setEditingRequestId(null);
      setRequestForm({ resource_id: "", reason: "" });
    } catch (err) {
      handleApiError(err, showNotification, "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit with confirmation
  const handleSubmit = () => {
    if (!requestForm.resource_id || !requestForm.reason.trim()) {
      showNotification("Please fill in all fields", "error");
      return;
    }
    confirmAction(editingRequestId ? "editRequest" : "addRequest");
  };

  // Delete with confirmation
  const handleRequestDeleteConfirm = (id) => {
    const req = requests.find((r) => r.id === id);
    confirmAction("deleteRequest", req);
  };

  const handleRequestEdit = async (id) => {
    try {
      // Fetch the request data
      const res = await requestApi.getById(id);
      const req = res.data;

      // Fetch resource options if not already loaded
      if (resourceOptions.length === 0) {
        const resourceRes = await requestApi.getResourceNames();
        setResourceOptions(resourceRes.data);
      }

      // Set form and state
      setRequestForm({
        resource_id: req.resource_id,
        reason: req.reason,
      });
      setEditingRequestId(id);
      setShowRequestForm(true);
    } catch (err) {
      handleApiError(
        err,
        showNotification,
        "Failed to fetch request for editing"
      );
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
        resetFilters={() => {
          setSearch("");
          setStatusFilter("");
        }}
      />

      <RequestView
        show={showRequestView}
        data={selectedRequestData}
        onClose={() => setShowRequestView(false)}
      />

      {showRequestForm && (
        <RequestForm
          resourceOptions={resourceOptions}
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
            onDelete={handleRequestDeleteConfirm}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      <ConfirmationOverlay
        show={showOverlay}
        actionType={overlayData.actionType}
        data={overlayData.data}
        onConfirm={handleOverlayConfirm}
        onCancel={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default MyRequests;
