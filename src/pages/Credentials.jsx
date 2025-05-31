import React, { useEffect, useState } from "react";
import CredentialAPI from "../api/credentialApi";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Credentials.css";

import CredentialForm from "../components/Credentials/CredentialForm";
import CredentialView from "../components/Credentials/CredentialView";
import CredentialTable from "../components/Credentials/CredentialTable";
import CredentialFilters from "../components/Credentials/CredentialFilters";
import Pagination from "../components/Pagination";

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
      showNotification(err.response?.data?.error || "Failed to fetch credentials", "error");
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
      list = list.filter(c =>
        (c.name?.toLowerCase().includes(term) || c.username?.toLowerCase().includes(term))
      );
    }
    if (creatorFilter) {
      list = list.filter(c => c.created_by.toString() === creatorFilter);
    }
    setFiltered(list);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCreatorFilter("");
  };

  const handleAddCredential = async () => {
    try {
      const res = await CredentialAPI.add(credentialData);
      setCredentials(prev => [res.data, ...prev]);
      setCredentialData({ name: "", username: "", password: "" });
      setShowForm(false);
      showNotification("Credential added successfully!", "success");
    } catch (err) {
      showNotification(err.response?.data?.error || "Failed to add credential", "error");
    }
  };

  const handleEdit = (cred) => {
    console.log("Editing credential:", cred);
    setEditMode(true);
    setEditId(cred.credential_id);
    setCredentialData({
      name: cred.name,
      username: cred.username,
      password: "",
    });
    setShowForm(true);
  };

  const handleUpdateCredential = async () => {
    try {
      await CredentialAPI.update(editId, credentialData);
      await fetchCredentials();
      setEditMode(false);
      setShowForm(false);
      setCredentialData({ name: "", username: "", password: "" });
      showNotification("Credential updated successfully!", "success");
    } catch (err) {
      showNotification(err.response?.data?.error || "Update failed", "error");
    }
  };

  const viewCredential = async (id) => {
    try {
      const res = await CredentialAPI.viewById(id);
      setViewData(res.data);
      setShowView(true);
    } catch (err) {
      showNotification("Failed to load credential", "error");
    }
  };

  const handleDeleteCredential = async (id) => {
    try {
      await CredentialAPI.delete(id);
      setCredentials(prev => prev.filter(c => c.credential_id !== id));
      showNotification("Credential deleted successfully!", "success");
    } catch (err) {
      showNotification(err.response?.data?.error || "Delete failed", "error");
    }
  };

  const indexOfLast = currentPage * credentialsPerPage;
  const indexOfFirst = indexOfLast - credentialsPerPage;
  const currentCredentials = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / credentialsPerPage);
  const uniqueCreators = [...new Set(credentials.map(c => c.created_by).filter(Boolean))];

  return (
    <div className="credential-container">
      <CredentialFilters
        search={search}
        setSearch={setSearch}
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
        onSubmit={editMode ? handleUpdateCredential : handleAddCredential}
        credentialData={credentialData}
        setCredentialData={setCredentialData}
        editMode={editMode}
        showPassword={showEditPassword}
        togglePassword={() => setShowEditPassword(!showEditPassword)}
      />

      <CredentialView
        show={showView}
        data={viewData}
        onClose={() => setShowView(false)}
        showPassword={showViewPassword}
        togglePassword={() => setShowViewPassword(!showViewPassword)}
        copiedField={copiedField}
        setCopiedField={setCopiedField}
      />

      <CredentialTable
        credentials={currentCredentials}
        onView={viewCredential}
        onEdit={handleEdit}
        onDelete={handleDeleteCredential}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Credentials;
