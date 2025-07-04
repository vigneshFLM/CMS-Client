// Resources.jsx
import React, { useState, useEffect, useCallback } from "react";
import TabLayout from "../components/Resources/TabLayout";
import ResourceFilters from "../components/Resources/ResourceFilters";
import resourceApi from "../api/resourceApi";
import ResourceTable from "../components/Resources/ResourceTable";
import ResourceForm from "../components/Resources/ResourceForm";
import { useAuth } from "../context/AuthContext";
import ConfirmationOverlay from "../components/ConfirmationOverlay";
import { IconX } from "@tabler/icons-react";
import ResourceView from "../components/Resources/ResourceView";
import { useNotification } from "../context/NotificationContext";
import Pagination from "../components/Pagination";

const Resources = () => {
  const [activeTab, setActiveTab] = useState("resources");
  const [data, setData] = useState({
    resources: [],
    assets: [],
    credentials: [],
  });
  const [search, setSearch] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [uniqueCreators, setUniqueCreators] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [resourceType, setResourceType] = useState("");
  const [initialData, setInitialData] = useState({});
  const [showResourceTypeSelection, setShowResourceTypeSelection] =
    useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [actionType, setActionType] = useState("");
  const [viewData, setViewData] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 10;

  const fetchResources = useCallback(async () => {
    try {
      let response;

      if (user.role === "super-admin") {
        response = await resourceApi.getAllResources(); // Gets all resources
      } else {
        response = await resourceApi.getResourceByUserId(user.id); // Gets only assigned resources
      }
      const groupedData = response.data.reduce(
        (acc, item) => {
          if (item.type === "cred") {
            acc.credentials.push(item);
          } else if (item.type === "asset") {
            acc.assets.push(item);
          }
          acc.resources.push(item);
          return acc;
        },
        { resources: [], assets: [], credentials: [] }
      );

      const uniqueCreatorNames = [
        ...new Set(response.data.map((item) => item.created_by_name)),
      ];

      setUniqueCreators(uniqueCreatorNames);
      setData(groupedData);
    } catch (error) {
      showNotification("Failed to fetch resources.", "error");
    }
  }, [showNotification]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleViewResource = async (id, type) => {
    try {
      const response = await resourceApi.getResourceById(id, type);
      setViewData(response.data);
      setShowPassword(false);
      setCopiedField("");
      setShowView(true);
    } catch (error) {
      showNotification("Failed to fetch resource details.", "error");
    }
  };

  const filteredData = useCallback(() => {
    let filteredItems = data[activeTab];

    if (search) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (creatorFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.created_by_name === creatorFilter
      );
    }

    // Calculate pagination
    const indexOfLastItem = currentPage * resourcesPerPage;
    const indexOfFirstItem = indexOfLastItem - resourcesPerPage;

    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, search, creatorFilter, activeTab, currentPage]);

  const totalItems = data[activeTab].filter((item) => {
    const matchSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCreator = creatorFilter
      ? item.created_by_name === creatorFilter
      : true;
    return matchSearch && matchCreator;
  });
  const totalPages = Math.ceil(totalItems.length / resourcesPerPage);

  const handleAddResource = () => {
    setShowResourceTypeSelection(true);
  };

  const handleResourceTypeSelection = (type) => {
    setResourceType(type);
    setShowResourceTypeSelection(false);
    setShowForm(true);
    setEditMode(false);
    setInitialData({});
    setActionType("addResource");
  };

  const handleEditResource = (resource, type) => {
    setResourceType(type);
    setShowForm(true);
    setEditMode(true);
    setInitialData(resource);
    setActionType("editResource");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, creatorFilter, activeTab]);

  const handleDelete = (id) => {
    setConfirmationData({ id });
    setActionType("deleteResource");
    setShowConfirmation(true);
  };

  const handleSubmitForm = (formData) => {
    setConfirmationData(formData);
    setShowConfirmation(true);
  };

  const handleConfirmation = async () => {
    if (actionType === "deleteResource" && confirmationData) {
      try {
        await resourceApi.deleteResource(confirmationData.id);
        await fetchResources();
        let updatedData;
        switch (activeTab) {
          case "resources":
            updatedData = data.resources.filter(
              (r) => r.id !== confirmationData.id
            );
            setData((prevData) => ({ ...prevData, resources: updatedData }));
            break;
          case "assets":
            updatedData = data.assets.filter(
              (a) => a.id !== confirmationData.id
            );
            setData((prevData) => ({ ...prevData, assets: updatedData }));
            break;
          case "credentials":
            updatedData = data.credentials.filter(
              (c) => c.id !== confirmationData.id
            );
            setData((prevData) => ({
              ...prevData,
              credentials: updatedData,
            }));
            break;
          default:
            break;
        }
        showNotification("Resource deleted successfully!", "success");
        setShowConfirmation(false);
      } catch (error) {
        showNotification("Failed to delete resource.", "error");
      }
    } else if (actionType === "addResource" || actionType === "editResource") {
      try {
        const dataToSubmit = {
          ...confirmationData,
          resourceType,
          created_by: user?.id || "default_user",
        };

        if (actionType === "editResource") {
          await resourceApi.updateResource(initialData.id, dataToSubmit);
          showNotification("Resource updated successfully!", "success");
        } else {
          await resourceApi.createResource(dataToSubmit);
          showNotification("Resource added successfully!", "success");
        }

        setShowForm(false);
        fetchResources();
        setShowConfirmation(false);
      } catch (error) {
        showNotification("Failed to submit resource.", "error");
      }
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const resetFilters = () => {
    setSearch("");
    setCreatorFilter("");
  };

  return (
    <div>
      <ResourceFilters
        search={search}
        setSearch={setSearch}
        creatorFilter={creatorFilter}
        setCreatorFilter={setCreatorFilter}
        resetFilters={resetFilters}
        uniqueCreators={uniqueCreators}
        onAddClick={handleAddResource}
        userRole={user.role}
      />

      <TabLayout
        tabs={[
          { key: "resources", label: "Resources" },
          { key: "assets", label: "Assets" },
          { key: "credentials", label: "Credentials" },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ResourceTable
        resources={filteredData()}
        onView={handleViewResource}
        onEdit={handleEditResource}
        onDelete={handleDelete}
        userRole={user.role}
        resourceType={
          activeTab === "assets"
            ? "Asset"
            : activeTab === "credentials"
            ? "Credential"
            : "Resource"
        }
      />

      <ResourceView
        show={showView}
        data={viewData}
        onClose={() => setShowView(false)}
        showPassword={showPassword}
        togglePassword={() => setShowPassword((prev) => !prev)}
        copiedField={copiedField}
        setCopiedField={setCopiedField}
      />

      {showResourceTypeSelection && (
        <div className="resource-type-selection-overlay">
          <div className="resource-type-selection-modal">
            <button
              type="button"
              className="icon-close-button"
              onClick={() => setShowResourceTypeSelection(false)}
              title="Close"
            >
              <IconX size={20} />
            </button>

            <h3>Select Resource Type</h3>
            <button

              className="add-button"
              onClick={() => handleResourceTypeSelection("asset")}
            >
              Asset
            </button>
            <button
              className="add-button"
              onClick={() => handleResourceTypeSelection("cred")}
            >
              Credential
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <ResourceForm
          show={showForm}
          data={viewData}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitForm}
          initialData={initialData}
          editMode={editMode}
          resourceType={editMode ? initialData.type : resourceType}
        />
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ConfirmationOverlay
        show={showConfirmation}
        onConfirm={handleConfirmation}
        onCancel={handleCancelConfirmation}
        actionType={actionType}
        data={confirmationData}
      />
    </div>
  );
};

export default Resources;
