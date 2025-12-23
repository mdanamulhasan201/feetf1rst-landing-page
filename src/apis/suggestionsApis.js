import axiosClient from "../../lip/axiosClient";


// get all suggestions /suggestions/improvement?page=1&limit=1
export const getAllSuggestions = async (page, limit) => {
    try {
        const response = await axiosClient.get(`/suggestions/improvement?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// delete suggestion 1/suggestions/improvement
// {
//     "ids": ["a3489414-e7e3-45d2-a99b-6f3f85f18ded"]
// }
export const deleteSuggestion = async (ids) => {
    try {
        const response = await axiosClient.delete(`/suggestions/improvement`, {
            data: {
                ids: ids
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}