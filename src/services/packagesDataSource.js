import packagesData from "./packagesData";

const USE_REMOTE_PACKAGES_API = false;

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const getLocalPackages = async () => {
  await delay(120);
  return packagesData;
};

const getRemotePackages = async () => {
  // Keep future API integration here only.
  throw new Error("Remote packages API is not configured yet.");
};

const readPackages = async () => {
  return USE_REMOTE_PACKAGES_API ? getRemotePackages() : getLocalPackages();
};

export const fetchPackages = async () => {
  return readPackages();
};

export const fetchPackageById = async (id) => {
  const packageId = Number(id);
  const packages = await readPackages();
  return packages.find((pkg) => pkg.id === packageId) || null;
};
