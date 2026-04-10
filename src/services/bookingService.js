import { fetchUserByIdentifier } from "./userService";

const BOOKINGS_API_URL = "http://localhost:3000/bookings";

const resolveId = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value.toString === "function") {
      const parsed = value.toString();
      if (parsed && parsed !== "[object Object]") return parsed;
    }
  }

  return "";
};

const normalizeBooking = (booking) => {
  if (!booking) return null;

  return {
    ...booking,
    _id: resolveId(booking._id || booking.id),
    userId: resolveId(booking.userId),
    packageId: resolveId(booking.packageId),
    packageName: booking.packageName || booking.title || "",
    userName: booking.userName || booking.name || "",
    totalPrice: Number(booking.totalPrice || 0),
    numberOfTravelers: Number(
      booking.numberOfTravelers || booking.travelerCount || 1,
    ),
    bookingDate: booking.bookingDate || new Date().toISOString(),
    travelDate: booking.travelDate || "",
    status: booking.status || "confirmed",
    paymentStatus: booking.paymentStatus || "pending",
    transactionId: booking.transactionId || "",
    specialRequests: booking.specialRequests || "",
  };
};

const readBookings = async () => {
  const response = await fetch(BOOKINGS_API_URL);

  if (!response.ok) {
    throw new Error("Failed to load bookings from API.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeBooking).filter(Boolean) : [];
};

export const getBookingsByUser = async (userId) => {
  if (!userId) return [];

  const bookings = await readBookings();
  const matchedUser = await fetchUserByIdentifier(userId);
  const targetUserId = String(matchedUser?._id || userId);

  return bookings.filter((booking) => String(booking.userId) === targetUserId);
};

export const createBookingForUser = async (bookingData) => {
  if (!bookingData) return null;

  const response = await fetch(BOOKINGS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error("Failed to create booking.");
  }

  const payload = await response.json();

  // Some APIs return only insert acknowledgement instead of the full document.
  if (payload?.insertedId) {
    return normalizeBooking({
      ...bookingData,
      _id: String(payload.insertedId),
    });
  }

  return normalizeBooking(payload);
};

export const saveBookingForUser = async (userId, bookingData) => {
  if (!userId || !bookingData) return null;

  return createBookingForUser({
    ...bookingData,
    userId: String(userId),
  });
};

export const updateBookingById = async (bookingId, updates) => {
  if (!bookingId || !updates) return null;

  const response = await fetch(`${BOOKINGS_API_URL}/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking.");
  }

  return normalizeBooking(await response.json());
};

export const updateBookingPaymentStatus = async (
  bookingId,
  paymentStatus = "paid",
  transactionId = "",
) => {
  if (!bookingId) return null;

  return updateBookingById(bookingId, {
    paymentStatus,
    transactionId,
  });
};

export const removeBookingForUser = async (userIdOrBookingId, bookingId) => {
  const targetBookingId = bookingId || userIdOrBookingId;

  if (!targetBookingId) return false;

  const response = await fetch(`${BOOKINGS_API_URL}/${targetBookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove booking.");
  }

  return true;
};

export const getBookingById = async (bookingId) => {
  if (!bookingId) return null;

  const response = await fetch(`${BOOKINGS_API_URL}/${bookingId}`);

  if (!response.ok) return null;

  return normalizeBooking(await response.json());
};
