import React, { useEffect, useState } from "react";
import "../styles/AccessManagement.css";
import AccessAPI from "../api/accessApi";
import AccessFilters from "../components/AccessManagement/AccessFilters";
import AccessTable from "../components/AccessManagement/AccessTable";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useNotification } from "../context/NotificationContext";
import { handleApiError } from "../utils/errorHandler";

const AccessManagement = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const { showNotification } = useNotification();

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await AccessAPI.getAllAccess();
        setData(response.data);
        setFiltered(response.data);
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

  const handleRevoke = async (userId, credentialId) => {
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

  if (loading) return <div>Loading access data...</div>;

  return (
    <div className="AccessManagement-container">
      <AccessFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
      />

      <AccessTable
        entries={currentEntries}
        onRevoke={handleRevoke}
        revokingId={revokingId}
        indexOfFirst={indexOfFirst}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AccessManagement;
