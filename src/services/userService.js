const USERS_API_URL = "http://localhost:3000/users";

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
  const response = await fetch(url, options);
  const data = await parseJsonSafely(response);
  return { response, data };
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

  return {
    ...user,
    _id: resolveUserId(user._id || user.id),
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

export const getUsers = async () => {
  const { response, data } = await requestUsersApi(USERS_API_URL);
  if (!response.ok || !Array.isArray(data)) return [];

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

  const { response, data } = await requestUsersApi(
    `${USERS_API_URL}/${userId}`,
  );

  if (!response.ok || !data) {
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
        normalizedIdentifier.toLowerCase() ||
      String(user.uid || "") === normalizedIdentifier,
  );

  return normalizeUser(matchedUser);
};

export const updateUserById = async (userId, updates) => {
  if (!userId || !updates) return null;

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

    if (patchResult.response.ok) {
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

    if (!putResult.response.ok) return null;

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

  if (!response.ok) return null;
  return normalizeUser(data) || fetchUserById(userId);
};

export const putUserById = async (userId, payload) => {
  if (!userId || !payload) return null;

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

  if (!response.ok) return null;
  return normalizeUser(data) || fetchUserById(userId);
};

export const createUserProfile = async (payload) => {
  if (!payload) return null;

  const createPayload = {
    ...payload,
    role: "user",
  };

  // Let database generate the unique _id.
  delete createPayload._id;
  delete createPayload.id;

  const { response, data } = await requestUsersApi(USERS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createPayload),
  });

  if (!response.ok) {
    return null;
  }

  return normalizeUser(data);
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
