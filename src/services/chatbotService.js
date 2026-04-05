import { getAllPackages } from "./packagesService";

const moneyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text, keywords) =>
  keywords.some((word) => text.includes(word));

const findPackageFromQuery = (query, packagesData) => {
  const normalizedQuery = normalize(query);

  return packagesData.find((pkg) => {
    const title = normalize(pkg.title);
    const location = normalize(pkg.location);
    const locationTokens = location.split(" ");

    return (
      normalizedQuery.includes(title) ||
      normalizedQuery.includes(location) ||
      locationTokens.some(
        (token) => token.length > 3 && normalizedQuery.includes(token),
      )
    );
  });
};

const packageSummary = (pkg) => {
  const spots = pkg.spots?.join(", ") || "top local attractions";

  return `${pkg.title} in ${pkg.location} costs ${moneyFormatter.format(pkg.priceBdt)} for ${pkg.duration}. Tour dates: ${dateFormatter.format(new Date(pkg.startDate))} to ${dateFormatter.format(new Date(pkg.endDate))}. You will visit: ${spots}.`;
};

export const getChatbotReply = async (rawInput) => {
  const input = rawInput?.trim();

  if (!input) {
    return "Please type your question. You can ask about package price, dates, duration, spots, or recommendations.";
  }

  const packagesData = await getAllPackages();
  const query = normalize(input);
  const selectedPackage = findPackageFromQuery(query, packagesData);

  if (includesAny(query, ["hi", "hello", "hey", "assalamualaikum", "salam"])) {
    return "Hello! I am your Travel Guru assistant. Ask me about package prices, dates, spots, or which tour is best for you.";
  }

  if (
    selectedPackage &&
    includesAny(query, ["price", "cost", "bdt", "tk", "taka"])
  ) {
    return `${selectedPackage.title} price is ${moneyFormatter.format(selectedPackage.priceBdt)}.`;
  }

  if (
    selectedPackage &&
    includesAny(query, ["date", "start", "end", "when", "time"])
  ) {
    return `${selectedPackage.title} starts on ${dateFormatter.format(new Date(selectedPackage.startDate))} and ends on ${dateFormatter.format(new Date(selectedPackage.endDate))}.`;
  }

  if (
    selectedPackage &&
    includesAny(query, ["spot", "visit", "place", "itinerary", "location"])
  ) {
    return `With our team, you will visit these spots in ${selectedPackage.title}: ${selectedPackage.spots?.join(", ")}.`;
  }

  if (
    selectedPackage &&
    includesAny(query, ["feature", "include", "included"])
  ) {
    return `${selectedPackage.title} includes: ${selectedPackage.features?.join(", ")}.`;
  }

  if (selectedPackage) {
    return packageSummary(selectedPackage);
  }

  if (
    includesAny(query, ["cheap", "budget", "lowest", "low price", "minimum"])
  ) {
    const cheapest = [...packagesData].sort(
      (a, b) => a.priceBdt - b.priceBdt,
    )[0];

    return `Best budget option is ${cheapest.title} at ${moneyFormatter.format(cheapest.priceBdt)}.`;
  }

  if (includesAny(query, ["expensive", "premium", "highest", "luxury"])) {
    const premium = [...packagesData].sort(
      (a, b) => b.priceBdt - a.priceBdt,
    )[0];

    return `Most premium option is ${premium.title} at ${moneyFormatter.format(premium.priceBdt)}.`;
  }

  if (includesAny(query, ["beach", "sea"])) {
    const beachPkg = packagesData.find((pkg) =>
      normalize(pkg.location).includes("cox"),
    );

    return beachPkg
      ? `For beach travel, I recommend ${beachPkg.title}. ${packageSummary(beachPkg)}`
      : "I could not find a beach package right now.";
  }

  if (includesAny(query, ["hill", "mountain", "sajek"])) {
    const hillPkg = packagesData.find((pkg) =>
      normalize(pkg.title).includes("sajek"),
    );

    return hillPkg
      ? `For hill views, choose ${hillPkg.title}. ${packageSummary(hillPkg)}`
      : "I could not find a hill package right now.";
  }

  if (includesAny(query, ["tea", "forest", "sreemangal", "sylhet"])) {
    const teaPkg = packagesData.find((pkg) =>
      normalize(pkg.title).includes("sreemangal"),
    );

    return teaPkg
      ? `For tea garden and forest experience, go with ${teaPkg.title}. ${packageSummary(teaPkg)}`
      : "I could not find a tea-garden package right now.";
  }

  if (
    includesAny(query, [
      "all package",
      "all packages",
      "list",
      "show package",
      "show packages",
    ])
  ) {
    const summaries = packagesData
      .map(
        (pkg, index) =>
          `${index + 1}. ${pkg.title} - ${moneyFormatter.format(pkg.priceBdt)} - ${pkg.duration}`,
      )
      .join("\n");

    return `Current packages:\n${summaries}`;
  }

  return "I can help with package price, duration, start/end dates, included features, and visit spots. Try asking: 'price of Sajek package' or 'which package is best for beach trip?'";
};
