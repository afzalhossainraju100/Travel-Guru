const normalizePackageId = (packageId) => String(packageId || "");

const getStorageKey = (userIdentifier) =>
  `travel-guru:wishlist:${String(userIdentifier || "").toLowerCase()}`;

const normalizeWishlistItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    _id: String(item._id || item.id || item.packageId || ""),
  };
};

const readWishlistFromStorage = (userIdentifier) => {
  if (!userIdentifier) return [];

  try {
    const raw = localStorage.getItem(getStorageKey(userIdentifier));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(normalizeWishlistItem).filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

const writeWishlistToStorage = (userIdentifier, wishlist) => {
  if (!userIdentifier) return;

  const normalized = Array.isArray(wishlist)
    ? wishlist.map(normalizeWishlistItem).filter(Boolean)
    : [];

  localStorage.setItem(
    getStorageKey(userIdentifier),
    JSON.stringify(normalized),
  );
};

export const getWishlistByUser = async (userIdentifier) => {
  if (!userIdentifier) return [];

  return readWishlistFromStorage(userIdentifier);
};

export const isPackageWishlisted = async (userIdentifier, packageId) => {
  if (!userIdentifier || !packageId) return false;

  const targetPackageId = normalizePackageId(packageId);
  const wishlist = await getWishlistByUser(userIdentifier);

  return wishlist.some(
    (item) => normalizePackageId(item._id) === targetPackageId,
  );
};

export const addWishlistForUser = async (userIdentifier, packageData) => {
  if (!userIdentifier || !packageData) return null;

  const currentWishlist = readWishlistFromStorage(userIdentifier);
  const packageId = normalizePackageId(packageData._id || packageData.id);

  const alreadySaved = currentWishlist.some(
    (item) =>
      normalizePackageId(item._id || item.id || item.packageId) === packageId,
  );

  if (alreadySaved) return currentWishlist;

  const nextWishlist = [
    {
      ...packageData,
      _id: packageId,
      addedAt: new Date().toISOString(),
    },
    ...currentWishlist,
  ];

  writeWishlistToStorage(userIdentifier, nextWishlist);
  return nextWishlist;
};

export const removeWishlistForUser = async (userIdentifier, packageId) => {
  if (!userIdentifier || !packageId) return null;

  const targetPackageId = normalizePackageId(packageId);
  const currentWishlist = readWishlistFromStorage(userIdentifier);
  const nextWishlist = currentWishlist.filter(
    (item) =>
      normalizePackageId(item._id || item.id || item.packageId) !==
      targetPackageId,
  );

  writeWishlistToStorage(userIdentifier, nextWishlist);
  return nextWishlist;
};
