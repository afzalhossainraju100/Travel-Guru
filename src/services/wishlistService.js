const getWishlistKey = (userIdentifier) =>
  `travelGuruWishlists:${userIdentifier}`;

export const getWishlistByUser = (userIdentifier) => {
  if (!userIdentifier) return [];

  try {
    const rawWishlist = localStorage.getItem(getWishlistKey(userIdentifier));
    if (!rawWishlist) return [];

    const parsed = JSON.parse(rawWishlist);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isPackageWishlisted = (userIdentifier, packageId) => {
  if (!userIdentifier || !packageId) return false;

  return getWishlistByUser(userIdentifier).some(
    (item) => item.id === Number(packageId),
  );
};

export const addWishlistForUser = (userIdentifier, packageData) => {
  if (!userIdentifier || !packageData) return;

  const currentWishlist = getWishlistByUser(userIdentifier);
  const alreadySaved = currentWishlist.some(
    (item) => item.id === packageData.id,
  );

  if (alreadySaved) return;

  const wishlistItem = {
    wishlistId: `${packageData.id}-${Date.now()}`,
    addedAt: new Date().toISOString(),
    ...packageData,
  };

  localStorage.setItem(
    getWishlistKey(userIdentifier),
    JSON.stringify([wishlistItem, ...currentWishlist]),
  );
};

export const removeWishlistForUser = (userIdentifier, packageId) => {
  if (!userIdentifier || !packageId) return;

  const currentWishlist = getWishlistByUser(userIdentifier);
  const nextWishlist = currentWishlist.filter(
    (item) => item.id !== Number(packageId),
  );

  localStorage.setItem(
    getWishlistKey(userIdentifier),
    JSON.stringify(nextWishlist),
  );
};
