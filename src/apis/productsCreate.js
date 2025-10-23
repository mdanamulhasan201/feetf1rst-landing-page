import axiosClient from "../../lip/axiosClient";

// create products
export const createProducts = async (productData) => {
    try {
        const response = await axiosClient.post('/custom_shafts/create/mabschaft_kollektion', productData);
        if (response.data && response.data.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// get all products 
export const getAllProducts = async (page = number, limit = number, search = string) => {
    try {
        const response = await axiosClient.get(`/custom_shafts/mabschaft_kollektion?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// get product by id /custom_shafts/mabschaft_kollektion/4f1e6126-5f81-4601-a2e2-a7270f0e3107
export const getProductById = async (id) => {
    try {
        const response = await axiosClient.get(`/custom_shafts/mabschaft_kollektion/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// update product
export const updateProduct = async (id, productData) => {
    try {
        const response = await axiosClient.patch(`/custom_shafts/mabschaft_kollektion/${id}`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// delete product /custom_shafts/mabschaft_kollektion/:id
export const deleteProduct = async (id) => {
    try {
        const response = await axiosClient.delete(`/custom_shafts/mabschaft_kollektion/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}


// get all order 
export const getAllOrder = async (page = number, limit = number, search = string, status = string) => {
    try {
        const response = await axiosClient.get(`/custom_shafts/get?page=${page}&limit=${limit}&search=${search}&status=${status}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}

// get order by id
export const getOrderById = async (id) => {
    try {
        const response = await axiosClient.get(`/custom_shafts/get/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}


// status change in products 
export const statusChangeInOrder = async (id, status) => {
    try {
        const response = await axiosClient.patch(`/custom_shafts/update-status/${id}`, { status });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Something went wrong');
    }
}