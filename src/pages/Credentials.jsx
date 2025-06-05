import React, { useEffect, useState } from "react";
import CredentialAPI from "../api/credentialApi";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { handleApiError } from "../utils/errorHandler";
import "../styles/Credentials.css";

import CredentialForm from "../components/Credentials/CredentialForm";
import CredentialView from "../components/Credentials/CredentialView";
import CredentialTable from "../components/Credentials/CredentialTable";
import CredentialFilters from "../components/Credentials/CredentialFilters";
import Pagination from "../components/Pagination";
import ConfirmationOverlay from "../components/ConfirmationOverlay";

const Credentials = () => {
  const [credentials, setCredentials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showViewPassword, setShowViewPassword] = useState(false);
  const [credentialData, setCredentialData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({ actionType: "", data: null });

  const [currentPage, setCurrentPage] = useState(1);
  const credentialsPerPage = 10;

  const { user } = useAuth();
  const { showNotification } = useNotification();

  const fetchCredentials = async () => {
    try {
      const res = await CredentialAPI.fetchByUserId(user.id);
      setCredentials(res.data);
      setFiltered(res.data);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load credentials");
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [search, creatorFilter, credentials]);

  const filterCredentials = () => {
    let list = [...credentials];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.username?.toLowerCase().includes(term)
      );
    }
    if (creatorFilter) {
      list = list.filter((c) => c.created_by?.toString() === creatorFilter);
    }
    setFiltered(list);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCreatorFilter("");
  };

  const confirmAction = (actionType, data) => {
    setOverlayData({ actionType, data });
    setShowOverlay(true);
  };

  const handleOverlayConfirm = async () => {
    const { actionType, data } = overlayData;
    setShowOverlay(false);

    try {
      switch (actionType) {
        case "addCred":
          const addRes = await CredentialAPI.add(credentialData);
          setCredentials((prev) => [addRes.data, ...prev]);
          showNotification("Credential added successfully!", "success");
          break;
        case "editCred":
          await CredentialAPI.update(editId, credentialData);
          showNotification("Credential updated successfully!", "success");
          break;
        case "deleteCred":
          await CredentialAPI.delete(data.credential_id);
          setCredentials((prev) => prev.filter((c) => c.credential_id !== data.credential_id));
          showNotification("Credential deleted successfully!", "success");
          break;
        default:
          break;
      }
    } catch (err) {
      handleApiError(err, showNotification, "Action failed");
    }

    fetchCredentials();
    setCredentialData({ name: "", username: "", password: "" });
    setShowForm(false);
    setEditMode(false);
  };

  const handleEdit = async (cred) => {
    try {
      const res = await CredentialAPI.viewById(cred.credential_id);
      const fullData = res.data;
      setEditMode(true);
      setEditId(cred.credential_id);
      setCredentialData({
        name: fullData.name,
        username: fullData.username,
        password: fullData.password,
      });
      setShowForm(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch credential");
    }
  };

  const viewCredential = async (id) => {
    try {
      const res = await CredentialAPI.viewById(id);
      setViewData(res.data);
      setShowView(true);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load credential");
    }
  };

  const indexOfLast = currentPage * credentialsPerPage;
  const indexOfFirst = indexOfLast - credentialsPerPage;
  const currentCredentials = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / credentialsPerPage);
  const uniqueCreators = Array.from(
    new Map(
      credentials
        .filter((c) => c.created_by && c.created_by_name)
        .map((c) => [c.created_by, c.created_by_name])
    )
  ).map(([id, name]) => ({ id, name }));

  return (
    <div className="credential-container">
      <CredentialFilters
        search={search}
        setSearch={setSearch}
        userRole={user.role}
        creatorFilter={creatorFilter}
        setCreatorFilter={setCreatorFilter}
        resetFilters={resetFilters}
        uniqueCreators={uniqueCreators}
        onAddClick={() => {
          setShowForm(true);
          setEditMode(false);
          setCredentialData({ name: "", username: "", password: "" });
        }}
      />

      <CredentialForm
        show={showForm}
        data={viewData}
        onClose={() => {
          setShowForm(false);
          setCredentialData({ name: "", username: "", password: "" });
          setEditMode(false);
        }}
        onSubmit={() => {
          confirmAction(editMode ? "editCred" : "addCred", credentialData);
        }}
        credentialData={credentialData}
        setCredentialData={setCredentialData}
        editMode={editMode}
        showPassword={showEditPassword}
        togglePassword={() => setShowEditPassword(!showEditPassword)}
      />

      <CredentialView
        show={showView}
        data={viewData}
        onClose={() => {
          setShowView(false);
          setShowViewPassword(false);
        }}
        showPassword={showViewPassword}
        togglePassword={() => setShowViewPassword(!showViewPassword)}
        copiedField={copiedField}
        setCopiedField={setCopiedField}
      />

      <CredentialTable
        credentials={currentCredentials}
        onView={viewCredential}
        onEdit={handleEdit}
        onDelete={(id) => {
          const cred = credentials.find((c) => c.credential_id === id);
          confirmAction("deleteCred", cred);
        }}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
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

export default Credentials;
