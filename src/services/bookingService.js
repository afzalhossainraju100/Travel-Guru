const getBookingKey = (userIdentifier) =>
  `travelGuruBookings:${userIdentifier}`;

export const getBookingsByUser = (userIdentifier) => {
  if (!userIdentifier) return [];

  try {
    const rawBookings = localStorage.getItem(getBookingKey(userIdentifier));
    if (!rawBookings) return [];

    const parsed = JSON.parse(rawBookings);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveBookingForUser = (userIdentifier, packageData) => {
  if (!userIdentifier || !packageData) return;

  const currentBookings = getBookingsByUser(userIdentifier);

  const bookingItem = {
    bookingId: `${packageData.id}-${Date.now()}`,
    bookedAt: new Date().toISOString(),
    ...packageData,
  };

  localStorage.setItem(
    getBookingKey(userIdentifier),
    JSON.stringify([bookingItem, ...currentBookings]),
  );
};
