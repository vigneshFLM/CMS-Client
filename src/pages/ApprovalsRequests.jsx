import React, { useEffect, useState } from "react";
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

const ApprovalsRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const { user } = useAuth();

  const currentUserId = user?.id || null;
  const { showNotification } = useNotification();

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
  }, []);

  useEffect(() => {
    filterRequests();
  }, [search, statusFilter, requests]);

  const filterRequests = () => {
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
  };

  const handleStatusUpdate = async (
    reqId,
    reqStatus,
    reqUserId,
    reqCredentialId
  ) => {
    try {
      if (reqStatus === "approved") {
        await AccessApi.grantAccess(reqUserId, reqCredentialId, currentUserId);
      }
      await RequestsAPI.updateStatus(reqId, reqStatus, currentUserId);
      showNotification(`Request ${reqStatus}`, "success");

      const updated = await RequestsAPI.getAll();
      setRequests(
        updated.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } catch (err) {
      showNotification("Update failed", "error");
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
          <IconLoader2 className="spin" size={24} />
          <span>Loading requests...</span>
        </div>
      ) : (
        <>
          <ApprovalsTable
            requests={currentRequests}
            indexOfFirst={indexOfFirst}
            handleStatusUpdate={handleStatusUpdate}
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

export default ApprovalsRequests;
