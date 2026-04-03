const getCheckoutKey = (userIdentifier) =>
  `travelGuruCheckout:${userIdentifier}`;

export const saveCheckoutDraft = (userIdentifier, draft) => {
  if (!userIdentifier || !draft) return;

  localStorage.setItem(getCheckoutKey(userIdentifier), JSON.stringify(draft));
};

export const getCheckoutDraft = (userIdentifier) => {
  if (!userIdentifier) return null;

  try {
    const rawDraft = localStorage.getItem(getCheckoutKey(userIdentifier));
    if (!rawDraft) return null;

    const parsed = JSON.parse(rawDraft);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const clearCheckoutDraft = (userIdentifier) => {
  if (!userIdentifier) return;

  localStorage.removeItem(getCheckoutKey(userIdentifier));
};
