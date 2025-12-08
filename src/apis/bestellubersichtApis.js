import axiosClient from "../../lip/axiosClient";


// get all orders store/store-overview?page=&limit=&search=
export const getAllOrders = async (page = 1, limit = 10, search = '') => {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        
        const response = await axiosClient.get(`/store/store-overview?${params.toString()}`);
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}


// get order by id store/get-store-overview-by-id/d7d5cf8a-68bf-4851-af06-e7de5197769d
export const getOrderById = async (id) => {
    try {
        const response = await axiosClient.get(`/store/get-store-overview-by-id/${id}`);
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// update order status store/update-overview-statu

export const updateOrderStatus = async (ids, status) => {
    try {
        const response = await axiosClient.patch(`/store/update-overview-statu`, { ids, status });
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}
