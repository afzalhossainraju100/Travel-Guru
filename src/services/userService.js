const USERS_API_URL = "http://localhost:3000/users";

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    _id: String(user._id || user.id || ""),
    name: user.name || user.displayName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    bookingHistory: Array.isArray(user.bookingHistory)
      ? user.bookingHistory
      : [],
    wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
    preferences: Array.isArray(user.preferences) ? user.preferences : [],
  };
};

export const fetchUserByEmail = async (email) => {
  if (!email) return null;

  const response = await fetch(USERS_API_URL);

  if (!response.ok) {
    throw new Error("Failed to load user profile from API.");
  }

  const users = await response.json();
  if (!Array.isArray(users)) return null;

  const matchedUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() === String(email).toLowerCase(),
  );

  return normalizeUser(matchedUser);
};

export const fetchUserById = async (userId) => {
  if (!userId) return null;

  const response = await fetch(`${USERS_API_URL}/${userId}`);

  if (!response.ok) {
    return null;
  }

  return normalizeUser(await response.json());
};

export const fetchUserByIdentifier = async (identifier) => {
  if (!identifier) return null;

  const normalizedIdentifier = String(identifier).trim();

  if (normalizedIdentifier.includes("@")) {
    return fetchUserByEmail(normalizedIdentifier);
  }

  const byId = await fetchUserById(normalizedIdentifier);
  if (byId) return byId;

  const response = await fetch(USERS_API_URL);
  if (!response.ok) return null;

  const users = await response.json();
  if (!Array.isArray(users)) return null;

  const matchedUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() ===
        normalizedIdentifier.toLowerCase() ||
      String(user.uid || "") === normalizedIdentifier,
  );

  return normalizeUser(matchedUser);
};

export const updateUserById = async (userId, updates) => {
  if (!userId || !updates) return null;

  const response = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    return null;
  }

  return normalizeUser(await response.json());
};

export const createUserProfile = async (payload) => {
  if (!payload) return null;

  const response = await fetch(USERS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return null;
  }

  return normalizeUser(await response.json());
};

export const updateUserWishlist = async (userId, wishlist) => {
  if (!userId) return null;

  return updateUserById(userId, { wishlist });
};

export const appendBookingHistoryToUser = async (userId, bookingId) => {
  if (!userId || !bookingId) return null;

  try {
    const currentUser = await fetchUserById(userId);
    if (!currentUser) return null;

    const nextBookingHistory = Array.from(
      new Set([...(currentUser.bookingHistory || []), bookingId]),
    );

    return updateUserById(userId, { bookingHistory: nextBookingHistory });
  } catch {
    return null;
  }
};
