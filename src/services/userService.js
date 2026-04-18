const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
)
  .trim()
  .replace(/\/$/, "");
const USERS_API_URL = API_BASE_URL ? `${API_BASE_URL}/users` : "";

const resolveUserId = (idValue) => {
  if (typeof idValue === "string" || typeof idValue === "number") {
    return String(idValue);
  }

  if (idValue && typeof idValue === "object") {
    if (typeof idValue.$oid === "string") return idValue.$oid;
    if (typeof idValue.$id === "string") return idValue.$id;
    if (idValue._id) return resolveUserId(idValue._id);
    if (idValue.id) return resolveUserId(idValue.id);

    if (typeof idValue.toString === "function") {
      const parsed = idValue.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }

  return "";
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const requestUsersApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await parseJsonSafely(response);
    return { response, data };
  } catch {
    return { response: null, data: null };
  }
};

const isMongoWriteResult = (payload) => {
  if (!payload || typeof payload !== "object") return false;

  return (
    "acknowledged" in payload ||
    "matchedCount" in payload ||
    "modifiedCount" in payload ||
    "upsertedId" in payload
  );
};

const isSuccessfulMongoWrite = (payload) => {
  if (!isMongoWriteResult(payload)) return false;

  const matchedCount = Number(payload.matchedCount || 0);
  const modifiedCount = Number(payload.modifiedCount || 0);

  return matchedCount > 0 || modifiedCount > 0 || Boolean(payload.upsertedId);
};

const normalizeUser = (user) => {
  if (!user) return null;

  const { uid, ...restUser } = user;

  return {
    ...restUser,
    _id: resolveUserId(restUser._id || restUser.id),
    name: restUser.name || restUser.displayName || "",
    email: restUser.email || "",
    phoneNumber: restUser.phoneNumber || "",
    address: restUser.address || "",
    bookingHistory: Array.isArray(restUser.bookingHistory)
      ? restUser.bookingHistory
      : [],
    wishlist: Array.isArray(restUser.wishlist) ? restUser.wishlist : [],
    preferences: Array.isArray(restUser.preferences)
      ? restUser.preferences
      : [],
  };
};

export const getUsers = async () => {
  if (!USERS_API_URL) return [];

  const { response, data } = await requestUsersApi(USERS_API_URL);
  if (!response?.ok || !Array.isArray(data)) return [];

  return data.map(normalizeUser).filter(Boolean);
};

export const fetchUserByEmail = async (email) => {
  if (!email) return null;

  const users = await getUsers();

  const matchedUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() === String(email).toLowerCase(),
  );

  return normalizeUser(matchedUser);
};

export const fetchUserById = async (userId) => {
  if (!userId) return null;
  if (!USERS_API_URL) return null;

  const { response, data } = await requestUsersApi(
    `${USERS_API_URL}/${userId}`,
  );

  if (!response?.ok || !data) {
    return null;
  }

  return normalizeUser(data);
};

export const fetchUserByIdentifier = async (identifier) => {
  if (!identifier) return null;

  const normalizedIdentifier = String(identifier).trim();

  if (normalizedIdentifier.includes("@")) {
    return fetchUserByEmail(normalizedIdentifier);
  }

  const byId = await fetchUserById(normalizedIdentifier);
  if (byId) return byId;

  const users = await getUsers();

  const matchedUser = users.find(
    (user) =>
      String(user.email || "").toLowerCase() ===
      normalizedIdentifier.toLowerCase(),
  );

  return normalizeUser(matchedUser);
};

export const updateUserById = async (userId, updates) => {
  if (!userId || !updates) return null;
  if (!USERS_API_URL) return null;

  const normalizedId = resolveUserId(userId);
  if (!normalizedId) return null;

  const tryPatchThenPut = async (targetId) => {
    const targetUrl = `${USERS_API_URL}/${targetId}`;

    const patchResult = await requestUsersApi(targetUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (patchResult.response?.ok) {
      if (isMongoWriteResult(patchResult.data)) {
        if (!isSuccessfulMongoWrite(patchResult.data)) return null;
        return fetchUserById(targetId);
      }

      return normalizeUser(patchResult.data) || fetchUserById(targetId);
    }

    // Fallback for APIs that disable PATCH but allow full-document PUT.
    const current = await fetchUserById(targetId);
    if (!current) return null;

    const putPayload = { ...current, ...updates };
    const putResult = await requestUsersApi(targetUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(putPayload),
    });

    if (!putResult.response?.ok) return null;

    if (isMongoWriteResult(putResult.data)) {
      if (!isSuccessfulMongoWrite(putResult.data)) return null;
      return fetchUserById(targetId);
    }

    return normalizeUser(putResult.data) || fetchUserById(targetId);
  };

  const primaryUpdated = await tryPatchThenPut(normalizedId);
  if (primaryUpdated) return primaryUpdated;

  // Some admin records can have mismatched/legacy IDs. Retry via email lookup.
  const fallbackEmail = String(updates?.email || "").trim();
  if (!fallbackEmail) return null;

  const byEmail = await fetchUserByEmail(fallbackEmail);
  const fallbackId = resolveUserId(byEmail?._id || byEmail?.id);

  if (!fallbackId || fallbackId === normalizedId) return null;
  return tryPatchThenPut(fallbackId);
};

export const patchUserById = async (userId, updates) => {
  if (!userId || !updates) return null;
  if (!USERS_API_URL) return null;

  const { response, data } = await requestUsersApi(
    `${USERS_API_URL}/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response?.ok) return null;
  return normalizeUser(data) || fetchUserById(userId);
};

export const putUserById = async (userId, payload) => {
  if (!userId || !payload) return null;
  if (!USERS_API_URL) return null;

  const { response, data } = await requestUsersApi(
    `${USERS_API_URL}/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response?.ok) return null;
  return normalizeUser(data) || fetchUserById(userId);
};

export const createUserProfile = async (payload) => {
  if (!payload) return null;
  if (!USERS_API_URL) return null;

  const createPayload = {
    ...payload,
    role: "user",
  };

  // Let database generate the unique _id.
  delete createPayload._id;
  delete createPayload.id;
  delete createPayload.uid;

  const { response, data } = await requestUsersApi(USERS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPayload),
  });

  if (!response?.ok) {
    return null;
  }

  return normalizeUser(data);
};

export const upsertGoogleUserProfile = async (googleUser) => {
  if (!googleUser?.email) return null;

  const googleProfile = {
    name: googleUser.displayName || "",
    email: googleUser.email,
    password: "",
    phoneNumber: googleUser.phoneNumber || "",
    address: "",
    profileImage: googleUser.photoURL || "",
    role: "user",
    travelStyle: "",
    preferences: [],
    wishlist: [],
    bookingHistory: [],
    createdAt: new Date().toISOString(),
  };

  const existingUser = await fetchUserByEmail(googleUser.email);

  if (!existingUser) {
    return createUserProfile(googleProfile);
  }

  const normalizedId = resolveUserId(existingUser._id || existingUser.id);

  if (!normalizedId) {
    return existingUser;
  }

  const mergedProfile = {
    name: googleProfile.name || existingUser.name || "",
    email: existingUser.email || googleProfile.email,
    phoneNumber: googleProfile.phoneNumber || existingUser.phoneNumber || "",
    address: existingUser.address || googleProfile.address,
    profileImage: googleProfile.profileImage || existingUser.profileImage || "",
    role: existingUser.role || "user",
    travelStyle: existingUser.travelStyle || "",
    preferences: Array.isArray(existingUser.preferences)
      ? existingUser.preferences
      : [],
    wishlist: Array.isArray(existingUser.wishlist) ? existingUser.wishlist : [],
    bookingHistory: Array.isArray(existingUser.bookingHistory)
      ? existingUser.bookingHistory
      : [],
    createdAt: existingUser.createdAt || googleProfile.createdAt,
  };

  return updateUserById(normalizedId, mergedProfile) || existingUser;
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
