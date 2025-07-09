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

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  const { showNotification } = useNotification();
  const { user } = useAuth();

  const rowsPerPage = 10;

  // ✅ Declare fetchMappings at component scope
  const fetchMappings = async () => {
    try {
      setLoading(true);
      if (user.role === "super-admin") {
        const response = await AccessAPI.getAllAccess();
        setData(response.data);
      } else if (user.role === "admin") {
        const response = await AccessAPI.getAccessAdminUsers(user.id);
        setData(response.data);
      }
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch access mappings");
    } finally {
      setLoading(false);
    }
  };

  const {
    currentData: currentEntries,
    currentPage,
    setCurrentPage,
    totalPages,
    indexOfFirst,
  } = usePagination(filtered, rowsPerPage);

  // ✅ Single useEffect to call fetchMappings on load
  useEffect(() => {
    fetchMappings();
  }, [showNotification, user.id, user.role]);

  const filterAccessData = useCallback(() => {
    let filteredData = [...data];
    const lowerSearch = search.toLowerCase().trim();

    if (lowerSearch) {
      filteredData = filteredData.filter(
        (item) =>
          item.userName?.toLowerCase().includes(lowerSearch) ||
          item.email?.toLowerCase().includes(lowerSearch) ||
          item.credentialName?.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFiltered(filteredData);
    setCurrentPage(1);
  }, [data, search, statusFilter]);

  useEffect(() => {
    filterAccessData();
  }, [filterAccessData]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
  };

  const confirmRevoke = (userId, resourceId) => {
    setOverlayData({ userId, resourceId });
    setShowOverlay(true);
  };

  const handleOverlayConfirm = async () => {
    const { userId, resourceId } = overlayData;
    setShowOverlay(false);
    setRevokingId(`${userId}-${resourceId}`);

    try {
      await AccessAPI.revokeAccess(userId, resourceId);
      showNotification("Resource revoked successfully", "success");
      fetchMappings(); // ✅ now works correctly
    } catch (err) {
      handleApiError(err, showNotification, "Failed to revoke resource");
    } finally {
      setRevokingId(null);
    }
  };

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
