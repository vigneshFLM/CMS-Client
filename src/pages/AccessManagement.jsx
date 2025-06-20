import React, { useEffect, useState } from "react";
import "../styles/AccessManagement.css";
import AccessAPI from "../api/accessApi";
import AccessFilters from "../components/AccessManagement/AccessFilters";
import AccessTable from "../components/AccessManagement/AccessTable";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";
import ConfirmationOverlay from "../components/ConfirmationOverlay";
import { useAuth } from "../context/AuthContext";

const AccessManagement = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  // New overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  const { showNotification } = useNotification();
  const { user } = useAuth();

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        if (user.role === "super-admin") {
          const response = await AccessAPI.getAllAccess();
          setData(response.data);
          setFiltered(response.data);
        } else if (user.role === "admin") {
          const response = await AccessAPI.getAccessAdminUsers(user.id);
          setData(response.data);
          setFiltered(response.data);
        }
      } catch (err) {
        handleApiError(
          err,
          showNotification,
          "Failed to fetch access mappings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, statusFilter, data]);

  const filterData = () => {
    let list = [...data];

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (entry) =>
          entry.user_name.toLowerCase().includes(term) ||
          entry.user_email.toLowerCase().includes(term) ||
          entry.credential_name.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      list = list.filter((entry) => entry.status === statusFilter);
    }

    setFiltered(list);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  // Instead of revoke immediately, show overlay first
  const confirmRevoke = (userId, credentialId) => {
    setOverlayData({ userId, credentialId });
    setShowOverlay(true);
  };

  // Called when user confirms revoke in overlay
  const handleOverlayConfirm = async () => {
    const { userId, credentialId } = overlayData;
    setShowOverlay(false);
    setRevokingId(`${userId}-${credentialId}`);

    try {
      await AccessAPI.revokeAccess(userId, credentialId);
      const updated = data.map((entry) =>
        entry.user_id === userId && entry.credential_id === credentialId
          ? { ...entry, status: "revoked" }
          : entry
      );
      setData(updated);
      showNotification("Credential revoked successfully", "success");
    } catch (err) {
      handleApiError(err, showNotification, "Failed to revoke credential");
    } finally {
      setRevokingId(null);
    }
  };

  const {
    currentData: currentEntries,
    currentPage,
    setCurrentPage,
    totalPages,
    indexOfFirst,
  } = usePagination(filtered, rowsPerPage);

  return (
    <div className="AccessManagement-container">
      <AccessFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
      />

      {loading ? (
        <div className="loading">
          <span className="spinner" />
          <span>Loading Access Data...</span>
        </div>
      ) : currentEntries.length === 0 ? (
        <p className="no-data">No access data found.</p>
      ) : (
        <>
          <AccessTable
            entries={currentEntries}
            onRevoke={confirmRevoke}
            revokingId={revokingId}
            indexOfFirst={indexOfFirst}
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
        actionType="revokeAccess"
        data={overlayData}
        onConfirm={handleOverlayConfirm}
        onCancel={() => setShowOverlay(false)}
      />
    </div>
  );
};

export default AccessManagement;
