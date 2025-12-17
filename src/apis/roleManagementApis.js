
import axiosClient from "../../lip/axiosClient";

// get all permissions

// feature-access/get/33bceab8-7b11-4da5-9fd1-20a51c8be35f
export const getAllPermissions = async (id) => {
  try {
    const response = await axiosClient.get(`/v2/feature-access/get/${id}`);
    if (response.data && response.data.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};


// post all permissions feature-access/manage/33bceab8-7b11-4da5-9fd1-20a51c8be35f
export const postAllPermissions = async (id, data) => {
  try {
    const response = await axiosClient.post(`/v2/feature-access/manage/${id}`, data);
    if (response.data && response.data.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Something went wrong");
  }
};
