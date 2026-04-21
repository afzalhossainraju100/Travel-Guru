import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
)
  .trim()
  .replace(/\/$/, "");
const BLOGS_API_URL = API_BASE_URL ? `${API_BASE_URL}/blogs` : "";

const resolveId = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value.toString === "function") {
      const parsed = value.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }

  return "";
};

const getInitialForm = () => ({
  title: "",
  location: "",
  description: "",
  thumbnail: "",
  videoUrl: "",
  duration: "",
  author: "",
});

const normalizeBlog = (blog) => {
  if (!blog) return null;

  return {
    ...blog,
    _id: resolveId(blog._id || blog.id),
    title: blog.title || "",
    location: blog.location || "",
    description: blog.description || "",
    thumbnail: blog.thumbnail || blog.image || "",
    videoUrl:
      blog.videoUrl || blog.videoURL || blog.video || blog.embedUrl || "",
    duration: blog.duration || "",
    author: blog.author || "",
  };
};

const CreateBlog = ({ isAdmin = false }) => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState(getInitialForm());
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBlogs = async () => {
    setLoading(true);
    setError("");

    if (!BLOGS_API_URL) {
      setError("Backend API is not configured.");
      setBlogs([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BLOGS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to load blogs.");
      }

      const data = await response.json();
      setBlogs(
        Array.isArray(data) ? data.map(normalizeBlog).filter(Boolean) : [],
      );
    } catch {
      setError("Could not load blogs from API.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadBlogs();
  }, [isAdmin]);

  const blogCount = useMemo(() => blogs.length, [blogs]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData(getInitialForm());
    setEditingId("");
  };

  const buildPayload = () => {
    return {
      title: formData.title.trim(),
      location: formData.location.trim() || "",
      description: formData.description.trim(),
      thumbnail: formData.thumbnail.trim() || "",
      videoUrl: formData.videoUrl.trim(),
      duration: formData.duration.trim() || "",
      author: formData.author.trim() || "Travel Guru",
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (!BLOGS_API_URL) {
        setError("Backend API is not configured.");
        setSaving(false);
        return;
      }

      const payload = buildPayload();

      if (!payload.title || !payload.videoUrl) {
        setError("Title and video URL are required.");
        setSaving(false);
        return;
      }

      const endpoint = editingId
        ? `${BLOGS_API_URL}/${editingId}`
        : BLOGS_API_URL;
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSuccess(
        editingId ? "Blog updated successfully." : "Blog created successfully.",
      );
      clearForm();
      await loadBlogs();
    } catch {
      setError("Failed to save blog. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (blog) => {
    const id = resolveId(blog?._id || blog?.id);
    if (!id) {
      setError("Blog ID not found.");
      return;
    }

    setEditingId(id);
    setFormData({
      title: blog?.title || "",
      location: blog?.location || "",
      description: blog?.description || "",
      thumbnail: blog?.thumbnail || blog?.image || "",
      videoUrl: blog?.videoUrl || "",
      duration: blog?.duration || "",
      author: blog?.author || "",
    });
  };

  const onDelete = async (blog) => {
    const id = resolveId(blog?._id || blog?.id);
    if (!id) {
      setError("Blog ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Delete blog "${blog?.title || "Untitled"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BLOGS_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setSuccess("Blog deleted successfully.");
      if (editingId === id) clearForm();
      await loadBlogs();
    } catch {
      setError("Failed to delete blog.");
    } finally {
      setDeletingId("");
    }
  };

  if (!isAdmin) {
    return (
      <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <p className="text-sm font-semibold text-rose-700">
          Only admin users can create, edit, or delete blogs.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Blog Management (Admin)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create, edit, and remove travel blogs from one place.
          </p>
        </div>
        <button
          type="button"
          onClick={loadBlogs}
          className="inline-flex w-fit items-center rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
        >
          Refresh List
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-700">Total Blogs: {blogCount}</p>

      {error ? (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            value={formData.title}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Blog Title"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Location"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="thumbnail"
            value={formData.thumbnail}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Thumbnail URL"
          />
          <input
            name="videoUrl"
            value={formData.videoUrl}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Video URL"
            required
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-black"
          placeholder="Blog Description"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="author"
            value={formData.author}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Author"
          />
          <input
            name="duration"
            value={formData.duration}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Duration (e.g. 14:20)"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Blog"
                : "Create Blog"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={clearForm}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-slate-900">All Blogs</h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            No blogs found. Create your first one using the form above.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {blogs.map((blog) => {
              const id = resolveId(blog?._id || blog?.id);
              const isDeleting = deletingId === id;

              return (
                <article
                  key={id || blog.title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {blog.title || "Untitled"}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {blog.description || "No description provided."}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {blog.author || "Travel Guru"} | {blog.location || "-"}{" "}
                        | {blog.duration || "-"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(blog)}
                        className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(blog)}
                        disabled={isDeleting}
                        className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateBlog;
