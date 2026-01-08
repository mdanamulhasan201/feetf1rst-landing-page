import axiosClient from "../../lip/axiosClient";


// create store product - manually add product to store
export const createStoreProduct = async (productData) => {
    try {
        const response = await axiosClient.post('/store/admin-store/create', productData);
        if (response.data && response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to create product',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// get all store products store/admin-store/get-all?psge=1&limit=1&search=d
export const getAllStoreProducts = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await axiosClient.get(`/store/admin-store/get-all?page=${page}&limit=${limit}&search=${search}`);
        if (response.data && response.data.success) {
            return {
                success: true,
                data: response.data.data,
                pagination: response.data.pagination,
            };
        }
        return {
            success: false,
            message: response.data.message,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// update store product store/admin-store/update/0806bd81-568c-4657-9e2f-cb3bc6581f8f
export const updateStoreProduct = async (id, productData) => {
    try {
        const response = await axiosClient.patch(`/store/admin-store/update/${id}`, productData);
        if (response.data && response.data.success) {
            return {
                success: true,
                message: response.data.message,
                data: response.data.data,
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to update product',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// get store product by id store/admin-store/get
export const getStoreProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/store/admin-store/get/${id}`);
        if (response.data && response.data.success) {
            return {
                success: true,
                data: response.data.data,
            };
        }
        return {
            success: false,
            message: response.data.message,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// delete store product store/admin-store/delete/0806bd81-568c-4657-9e2f-cb3bc6581f8f
export const deleteStoreProduct = async (id) => {
    try {
        const response = await axiosClient.delete(`/store/admin-store/delete/${id}`);
        if (response.data && response.data.success) {
            return {
                success: true,
                message: response.data.message,
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to delete product',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}


// order history store/admin-store/track-storage
export const getOrderHistory = async () => {
    try {
        const response = await axiosClient.get(`/store/admin-store/track-storage`);
        if (response.data && response.data.success) {
            return {
                success: true,
                data: response.data.data,
                pagination: response.data.pagination,
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to get order history',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}



// get total price store/admin-store/track-price
export const getTotalPrice = async () => {
    try {
        const response = await axiosClient.get(`/store/admin-store/track-price`);
        if (response.data && response.data.success) {
            return {
                success: true,
                data: response.data.data,
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to get total price',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}
