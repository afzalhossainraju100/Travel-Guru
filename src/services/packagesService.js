const PACKAGES_API_URL = "http://localhost:3000/packages";

const resolvePackageId = (idValue) => {
  if (typeof idValue === "string") return idValue;
  if (idValue && typeof idValue === "object") {
    if (typeof idValue.$oid === "string") return idValue.$oid;
    if (typeof idValue.toString === "function") {
      const parsed = idValue.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }

  return "";
};

const formatDuration = (duration) => {
  if (typeof duration === "string") return duration;

  if (duration && typeof duration === "object") {
    const days = Number(duration.days || 0);
    const nights = Number(duration.nights || 0);

    if (days > 0 || nights > 0) {
      return `${days} Days / ${nights} Nights`;
    }
  }

  return "Duration not set";
};

const normalizeSpots = (spots) => {
  if (!Array.isArray(spots)) return [];

  return spots
    .map((spot) => {
      if (typeof spot === "string") return spot;
      if (spot && typeof spot === "object") return spot.name || "";
      return "";
    })
    .filter(Boolean);
};

const normalizeSpotImages = (pkg) => {
  if (Array.isArray(pkg?.spotImages)) {
    return pkg.spotImages;
  }

  if (!Array.isArray(pkg?.spots)) return [];

  return pkg.spots
    .filter((spot) => spot && typeof spot === "object" && spot.image)
    .map((spot) => ({
      name: spot.name || "Spot",
      image: spot.image,
    }));
};

const normalizePackage = (pkg) => ({
  ...pkg,
  _id: resolvePackageId(pkg?._id),
  duration: formatDuration(pkg?.duration),
  features: Array.isArray(pkg?.features) ? pkg.features : [],
  spots: normalizeSpots(pkg?.spots),
  spotImages: normalizeSpotImages(pkg),
});

const readPackages = async () => {
  const response = await fetch(PACKAGES_API_URL);

  if (!response.ok) {
    throw new Error("Failed to load packages from API.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizePackage) : [];
};

export const getAllPackages = async () => {
  return readPackages();
};

export const getPackageById = async (id) => {
  const packages = await readPackages();
  return packages.find((pkg) => String(pkg._id) === String(id)) || null;
};
