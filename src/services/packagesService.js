import packagesData from "../data/packagesData";

export const getAllPackages = async () => {
  // Replace with API call later, e.g. fetch('/api/packages')
  return packagesData;
};

export const getPackageById = async (id) => {
  // Replace with API call later, e.g. fetch(`/api/packages/${id}`)
  const packageId = Number(id);
  return packagesData.find((pkg) => pkg.id === packageId) || null;
};
