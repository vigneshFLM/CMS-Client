import React, { useEffect, useState, useCallback } from "react";
import "../styles/ApprovalsRequests.css";
import ApprovalsFilters from "../components/ApprovalsRequests/ApprovalsFilters";
import ApprovalsTable from "../components/ApprovalsRequests/ApprovalsTable";
import Pagination from "../components/Pagination";
import { useNotification } from "../context/NotificationContext";
import RequestsAPI from "../api/requestsApi";
import AccessApi from "../api/accessApi";
import { IconLoader2 } from "@tabler/icons-react";
import { handleApiError } from "../utils/errorHandler";
import { useAuth } from "../context/AuthContext";
import ConfirmationOverlay from "../components/ConfirmationOverlay";
import ApprovalRequestView from "../components/ApprovalsRequests/ApprovalsRequestView";

const ApprovalsRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [viewingRequest, setViewingRequest] = useState(null);
  const currentUserId = user?.id || null;

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await RequestsAPI.getAll();
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRequests(sorted);
        setFiltered(sorted);
      } catch (err) {
        handleApiError(err, showNotification, "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [showNotification]);

  const filterRequests = useCallback(() => {
    let list = [...requests];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.reason?.toLowerCase().includes(term) ||
          r.user_name?.toLowerCase().includes(term) ||
          r.credential_name?.toLowerCase().includes(term)
      );
    }
    if (statusFilter) {
      list = list.filter((r) => r.status === statusFilter);
    }
    setFiltered(list);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  const confirmStatusUpdate = (
    reqId,
    reqStatus,
    reqUserId,
    reqResourceId
  ) => {
    const request = requests.find((r) => r.id === reqId);
    setOverlayData({
      actionType: reqStatus === "approved" ? "approveRequest" : "rejectRequest",
      data: request,
      reqId,
      reqStatus,
      reqUserId,
      reqResourceId,
    });
    setShowOverlay(true);
  };

  const handleViewRequest = (request) => {
    setViewingRequest(request);
  };

  const handleOverlayConfirm = async () => {
    const { reqId, reqStatus, reqUserId, reqResourceId } = overlayData;
    setShowOverlay(false);

    try {
      if (reqResourceId === 1) {
        await RequestsAPI.updateSuperAdminStatus(reqId, reqStatus);
      } else {
        // ✅ Regular access request
        if (reqStatus === "approved") {
          await AccessApi.grantAccess(
            reqUserId,
            reqResourceId,
            currentUserId
          );
        }
        await RequestsAPI.updateStatus(reqId, reqStatus, currentUserId);
      }

      showNotification(`Request ${reqStatus}`, "success");

      const updated = await RequestsAPI.getAll();
      setRequests(
        updated.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } catch (err) {
      handleApiError(err, showNotification, "Update failed");
    }
  };

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / requestsPerPage);

  return (
    <div className="users-container">
      <ApprovalsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {loading ? (
        <div className="loading">
          <IconLoader2 className="loading-icon" size={24} />
          <span>Loading requests...</span>
        </div>
      ) : currentRequests.length === 0 ? (
        <p className="no-data">No requests found.</p>
      ) : (
        <>
          <ApprovalsTable
            requests={currentRequests}
            indexOfFirst={indexOfFirst}
            handleStatusUpdate={confirmStatusUpdate}
            handleViewRequest={handleViewRequest}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      <ApprovalRequestView
        show={!!viewingRequest}
        data={viewingRequest}
        onClose={() => setViewingRequest(null)}
      />

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

export default ApprovalsRequests;
