import { fetchPackageById, fetchPackages } from "./packagesDataSource";

export const getAllPackages = async () => {
  return fetchPackages();
};

export const getPackageById = async (id) => {
  return fetchPackageById(id);
};
