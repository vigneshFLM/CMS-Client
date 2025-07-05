import React, { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { handleApiError } from "../utils/errorHandler";
import postApi from "../api/postApi";
import userApi from "../api/userApi";
import PostTable from "../components/Posts/PostTable";
import PostFilters from "../components/Posts/PostFilters";
import PostView from "../components/Posts/PostView";
import PostForm from "../components/Posts/PostForm";
import ConfirmationOverlay from "../components/ConfirmationOverlay";
import AssignRoleForm from "../components/Posts/AssignRoleForm";
import Pagination from "../components/Pagination";
import UploadedFiles from "../components/Posts/UploadedFiles";

const Posts = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [search, setSearch] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [viewPost, setViewPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showAssignPostRoleForm, setShowAssignPostRoleForm] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({
    actionType: "",
    data: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Fetch all users (for super-admin/admin)
  const fetchUsers = async () => {
    try {
      setLoadingPosts(true);
      let response = null;

      if (user.post_role === "approver") {
        response = await userApi.fetchAll();
      }

      if (response) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch users");
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user.role, user.id]);

  // Fetch posts based on role
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);

      let response;

      const role = user.post_role || "";

      if (role === "submitter") {
        response = await postApi.getByUser(user.id);
      } else if (role === "approver") {
        response = await postApi.getAssigned();
      }

      const postData = response?.data || [];
      setPosts(postData);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to load posts");
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPosts();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [posts, search, contentTypeFilter, statusFilter, creatorFilter]);

  const applyFilters = () => {
    let filtered = [...posts];

    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (contentTypeFilter) {
      filtered = filtered.filter((p) => p.content_type === contentTypeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (creatorFilter) {
      filtered = filtered.filter((p) => p.submitted_by_name === creatorFilter);
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setContentTypeFilter("");
    setStatusFilter("");
    setCreatorFilter("");
  };

  const handleBulkDelete = async () => {
    await fetchUploadedFiles(); // fetch fresh list before showing
    setShowBulkDelete(true);
  };

 const confirmBulkDelete = async (fileNames) => {
  setShowBulkDelete(false);
  try {
    await postApi.deleteFiles(fileNames);
    setUploadedFiles(prev => prev.filter((f) => !fileNames.includes(f)));
    showNotification("Selected files deleted", "success");
  } catch (err) {
    handleApiError(err, showNotification, "Bulk file delete failed");
  }
};


  const confirmCreatePost = (postData) => {
    setOverlayData({
      actionType: "addPost",
      data: { title: postData.title, payload: postData },
    });
    setShowOverlay(true);
  };

  const confirmUpdatePost = (postData) => {
    setOverlayData({
      actionType: "editPost",
      data: { title: postData.title, payload: postData },
    });
    setShowOverlay(true);
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await postApi.getFiles();
      setUploadedFiles(response.data.files || []);
    } catch (err) {
      handleApiError(err, showNotification, "Failed to fetch uploaded files");
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleCreatePost = async (postData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      formData.append("submittedBy", user.id);
      formData.append("pageId", postData.pageId);
      formData.append("assignedApproverId", postData.assignedApproverId);
      formData.append("contentType", postData.contentType);

      if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("fileType", postData.files[0].type);
      } else {
        formData.append("fileType", "none");
      }

      if (postData.driveLink) {
        formData.append("driveLink", postData.driveLink);
      }

      await postApi.create(formData);
      showNotification("Post created successfully!", "success");
      fetchPosts();
    } catch (err) {
      handleApiError(err, showNotification, "Error creating post");
    } finally {
      setSubmitting(false);
      setShowPostForm(false);
    }
  };

  const handleUpdatePost = async (postData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      formData.append("pageId", postData.pageId);
      formData.append("assignedApproverId", postData.assignedApproverId);
      formData.append("contentType", postData.contentType);

      if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file) => formData.append("files", file));
        formData.append("fileType", postData.files[0].type);
      } else {
        formData.append("fileType", "none");
      }

      if (postData.driveLink) {
        formData.append("driveLink", postData.driveLink);
      }

      if (postData.deletedFileIds && postData.deletedFileIds.length > 0) {
        formData.append(
          "deletedFileIds",
          JSON.stringify(postData.deletedFileIds)
        );
      }

      await postApi.update(postData.id, formData);
      showNotification("Post updated successfully!", "success");
      fetchPosts();
    } catch (err) {
      handleApiError(err, showNotification, "Error updating post");
    } finally {
      setSubmitting(false);
      setShowPostForm(false);
      setPostToEdit(null);
      setEditMode(false);
    }
  };

  const handleAssignPostRole = async ({ userId, postRole }) => {
    setSubmitting(true);
    try {
      await postApi.assignRole(userId, postRole);
      showNotification("Post role assigned successfully!", "success");
      fetchPosts();
    } catch (err) {
      handleApiError(err, showNotification, "Error assigning post role");
    } finally {
      setSubmitting(false);
      setShowAssignPostRoleForm(false);
    }
  };

  const confirmDeletePost = (post) => {
    setOverlayData({
      actionType: "deletePost",
      data: { id: post.id, name: post.title }, // ✅ Use `name`
    });
    setShowOverlay(true);
  };

  const handleOverlayConfirm = async () => {
    const { actionType, data } = overlayData;
    setShowOverlay(false);

    try {
      if (actionType === "deletePost") {
        await postApi.delete(data.id);
        setPosts(posts.filter((p) => p.id !== data.id));
        showNotification("Post deleted successfully!", "success");
      }

      if (actionType === "addPost") {
        await handleCreatePost(data.payload);
      }

      if (actionType === "editPost") {
        await handleUpdatePost(data.payload);
      }
    } catch (err) {
      handleApiError(err, showNotification, "Action failed");
    }
  };

  const creators = Array.isArray(posts)
    ? Array.from(
        new Map(
          posts
            .filter((p) => p.submitted_by && p.submitted_by_name)
            .map((p) => [p.submitted_by, p.submitted_by_name])
        )
      ).map(([id, name]) => ({ id, name }))
    : [];

  return (
    <div className="posts-container">
      <PostFilters
        search={search}
        setSearch={setSearch}
        contentTypeFilter={contentTypeFilter}
        setContentTypeFilter={setContentTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        creatorFilter={creatorFilter}
        creators={creators}
        setCreatorFilter={setCreatorFilter}
        resetFilters={handleResetFilters}
        onCreatePost={() => setShowPostForm(true)}
        onAssignPostRole={() => setShowAssignPostRoleForm(true)}
        userRole={user.post_role}
        onFilesDelete={handleBulkDelete}
      />

      {loadingPosts ? (
        <p>Loading posts...</p>
      ) : (
        <>
          {showPostForm && (
            <PostForm
              submitting={submitting}
              onCancel={() => {
                setShowPostForm(false);
                setPostToEdit(null);
                setEditMode(false);
              }}
              onSubmit={editMode ? confirmUpdatePost : confirmCreatePost}
              showNotification={showNotification}
              editMode={editMode}
              postData={postToEdit}
            />
          )}

          {showBulkDelete && (
            <UploadedFiles
              files={uploadedFiles}
              onCancel={() => setShowBulkDelete(false)}
              onConfirm={confirmBulkDelete}
            />
          )}

          {showAssignPostRoleForm && (
            <AssignRoleForm
              users={users}
              onCancel={() => setShowAssignPostRoleForm(false)}
              onSubmit={handleAssignPostRole}
              showNotification={showNotification}
            />
          )}

          <PostTable
            posts={currentPosts}
            allPosts={posts}
            user={user}
            refresh={fetchPosts}
            onView={async (post) => {
              const res = await postApi.getById(post.id);
              setViewPost(res.data);
            }}
            onDelete={(post) => confirmDeletePost(post)}
            onEdit={(post) => {
              setPostToEdit(post);
              setEditMode(true);
              setShowPostForm(true);
            }}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {viewPost && (
            <PostView
              post={viewPost}
              onClose={() => setViewPost(null)}
              user={user}
            />
          )}

          <ConfirmationOverlay
            show={showOverlay}
            actionType={overlayData.actionType}
            data={overlayData.data}
            onConfirm={handleOverlayConfirm}
            onCancel={() => setShowOverlay(false)}
          />
        </>
      )}
    </div>
  );
};

export default Posts;
