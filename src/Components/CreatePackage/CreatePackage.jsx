import React, { useEffect, useMemo, useState } from "react";

const PACKAGES_API_URL = "http://localhost:3000/packages";

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
  destinationName: "",
  location: "",
  days: "",
  nights: "",
  startDate: "",
  endDate: "",
  priceBdt: "",
  image: "",
  featuresText: "",
  transportType: "",
  transportDeparture: "",
  transportReturn: "",
  hotelName: "",
  hotelType: "",
  hotelAmenitiesText: "",
  spot1Name: "",
  spot1Image: "",
  spot2Name: "",
  spot2Image: "",
  description: "",
});

const splitCommaValues = (value) => {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const CreatePackage = ({ isAdmin = false }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(getInitialForm());

  const loadPackages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(PACKAGES_API_URL);
      if (!response.ok) {
        throw new Error("Failed to load packages.");
      }

      const data = await response.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load packages from API.");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadPackages();
  }, [isAdmin]);

  const packageCount = useMemo(() => packages.length, [packages]);

  const clearForm = () => {
    setFormData(getInitialForm());
    setEditingId("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const spots = [];

    if (formData.spot1Name.trim() || formData.spot1Image.trim()) {
      spots.push({
        name: formData.spot1Name.trim(),
        image: formData.spot1Image.trim(),
      });
    }

    if (formData.spot2Name.trim() || formData.spot2Image.trim()) {
      spots.push({
        name: formData.spot2Name.trim(),
        image: formData.spot2Image.trim(),
      });
    }

    return {
      title: formData.title.trim(),
      destinationName: formData.destinationName.trim(),
      location: formData.location.trim(),
      duration: {
        days: Number(formData.days || 0),
        nights: Number(formData.nights || 0),
      },
      startDate: formData.startDate,
      endDate: formData.endDate,
      priceBdt: Number(formData.priceBdt || 0),
      image: formData.image.trim(),
      features: splitCommaValues(formData.featuresText),
      transport: {
        type: formData.transportType.trim(),
        departure: formData.transportDeparture.trim(),
        return: formData.transportReturn.trim(),
      },
      hotel: {
        name: formData.hotelName.trim(),
        type: formData.hotelType.trim(),
        amenities: splitCommaValues(formData.hotelAmenitiesText),
      },
      spots,
      description: formData.description.trim(),
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = buildPayload();

      if (!payload.title || !payload.destinationName || !payload.location) {
        setError("Title, destination name, and location are required.");
        setSaving(false);
        return;
      }

      const endpoint = editingId
        ? `${PACKAGES_API_URL}/${editingId}`
        : PACKAGES_API_URL;
      const method = editingId ? "PATCH" : "POST";

      // Let MongoDB generate unique _id for new package.
      if (!editingId) {
        delete payload._id;
        delete payload.id;
      }

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
        editingId
          ? "Package updated successfully."
          : "Package created successfully.",
      );
      clearForm();
      await loadPackages();
    } catch {
      setError("Failed to save package. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (pkg) => {
    const id = resolveId(pkg?._id || pkg?.id);

    setEditingId(id);
    setFormData({
      title: pkg?.title || "",
      destinationName: pkg?.destinationName || "",
      location: pkg?.location || "",
      days: String(pkg?.duration?.days ?? ""),
      nights: String(pkg?.duration?.nights ?? ""),
      startDate: pkg?.startDate || "",
      endDate: pkg?.endDate || "",
      priceBdt: String(pkg?.priceBdt ?? ""),
      image: pkg?.image || "",
      featuresText: Array.isArray(pkg?.features) ? pkg.features.join(", ") : "",
      transportType: pkg?.transport?.type || "",
      transportDeparture: pkg?.transport?.departure || "",
      transportReturn: pkg?.transport?.return || "",
      hotelName: pkg?.hotel?.name || "",
      hotelType: pkg?.hotel?.type || "",
      hotelAmenitiesText: Array.isArray(pkg?.hotel?.amenities)
        ? pkg.hotel.amenities.join(", ")
        : "",
      spot1Name: pkg?.spots?.[0]?.name || "",
      spot1Image: pkg?.spots?.[0]?.image || "",
      spot2Name: pkg?.spots?.[1]?.name || "",
      spot2Image: pkg?.spots?.[1]?.image || "",
      description: pkg?.description || "",
    });
  };

  const onDelete = async (pkg) => {
    const id = resolveId(pkg?._id || pkg?.id);
    if (!id) {
      setError("Package ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Delete package "${pkg?.title || "Untitled"}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${PACKAGES_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setSuccess("Package deleted successfully.");
      if (editingId === id) {
        clearForm();
      }
      await loadPackages();
    } catch {
      setError("Failed to delete package.");
    } finally {
      setDeletingId("");
    }
  };

  if (!isAdmin) {
    return (
      <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <p className="text-sm font-semibold text-rose-700">
          Only admin users can create, edit, or delete packages.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-amber-100 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Package Management (Admin)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Create, edit, and delete packages from one place.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPackages}
          className="inline-flex w-fit items-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
        >
          Refresh List
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-700">
        Total Packages: {packageCount}
      </p>

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
        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="title"
            value={formData.title}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Title"
            required
          />
          <input
            name="destinationName"
            value={formData.destinationName}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Destination Name"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Location"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input
            name="days"
            type="number"
            min="0"
            value={formData.days}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Days"
          />
          <input
            name="nights"
            type="number"
            min="0"
            value={formData.nights}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Nights"
          />
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
          />
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="priceBdt"
            type="number"
            min="0"
            value={formData.priceBdt}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Price (BDT)"
          />
          <input
            name="image"
            value={formData.image}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Main Image URL"
          />
        </div>

        <input
          name="featuresText"
          value={formData.featuresText}
          onChange={onChange}
          className="rounded-lg border border-slate-300 px-3 py-2 text-black"
          placeholder="Features (comma separated)"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="transportType"
            value={formData.transportType}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Transport Type"
          />
          <input
            name="transportDeparture"
            value={formData.transportDeparture}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Transport Departure"
          />
          <input
            name="transportReturn"
            value={formData.transportReturn}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Transport Return"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="hotelName"
            value={formData.hotelName}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Hotel Name"
          />
          <input
            name="hotelType"
            value={formData.hotelType}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Hotel Type"
          />
          <input
            name="hotelAmenitiesText"
            value={formData.hotelAmenitiesText}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Hotel Amenities (comma separated)"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="spot1Name"
            value={formData.spot1Name}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Spot 1 Name"
          />
          <input
            name="spot1Image"
            value={formData.spot1Image}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Spot 1 Image URL"
          />
          <input
            name="spot2Name"
            value={formData.spot2Name}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Spot 2 Name"
          />
          <input
            name="spot2Image"
            value={formData.spot2Image}
            onChange={onChange}
            className="rounded-lg border border-slate-300 px-3 py-2 text-black"
            placeholder="Spot 2 Image URL"
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={3}
          className="rounded-lg border border-slate-300 px-3 py-2 text-black"
          placeholder="Description"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Package"
                : "Create Package"}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700"
          >
            Clear Form
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900">Existing Packages</h3>
        {loading ? (
          <p className="mt-2 text-sm text-slate-600">Loading packages...</p>
        ) : null}

        {!loading && packages.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No packages found.</p>
        ) : null}

        {!loading && packages.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {packages.map((pkg) => {
              const id = resolveId(pkg?._id || pkg?.id);
              return (
                <div
                  key={id || pkg?.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {pkg?.title || "Untitled Package"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {pkg?.destinationName || "Unknown Destination"} |{" "}
                        {pkg?.location || "No location"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ID: {id || "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(pkg)}
                        className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(pkg)}
                        disabled={deletingId === id}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                      >
                        {deletingId === id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CreatePackage;
