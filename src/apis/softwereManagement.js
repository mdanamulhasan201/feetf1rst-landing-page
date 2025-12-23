import axiosClient from "../../lip/axiosClient";

// create software management
export const createSoftwareManagement = async (softwareManagementData) => {
  try {
    const response = await axiosClient.post(
      "/v2/software_version/create",
      softwareManagementData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
// get all software management /v2/software_version/get-all?page=1&limit=2
export const getAllSoftwareManagement = async (page, limit) => {
  try {
    const response = await axiosClient.get(
      `/v2/software_version/get-all?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

// get signle software management /v2/software_version/get-single/6cec44af-ca55-4ead-89b8-804ba72850bb
export const getSingleSoftwareManagement = async (id) => {
  try {
    const response = await axiosClient.get(
      `/v2/software_version/get-single/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

// update /v2/software_version/update/e046ad4e-daad-4c00-9df3-22cc863ccf68
export const updateSoftwareManagement = async (id, softwareManagementData) => {
  try {
    const response = await axiosClient.patch(
      `/v2/software_version/update/${id}`,
      softwareManagementData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

// delete software management /v2/software_version/delete/6cec44af-ca55-4ead-89b8-804ba72850bb
export const deleteSoftwareManagement = async (id) => {
  try {
    const response = await axiosClient.delete(
      `/v2/software_version/delete/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
