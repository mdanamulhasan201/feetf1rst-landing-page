import axiosClient from "../../lip/axiosClient";

export const loginUser = async (email, password) => {
    try {
        const response = await axiosClient.post('/users/login', {
            email,
            password,
        });

        if (!response.data?.token || !response.data?.user) {
            throw new Error('Invalid response from server');
        }

        if (!response.data.user.role) {
            throw new Error('User role not found in response');
        }

        return {
            success: true,
            message: response.data.message || 'Successfully logged in!',
            token: response.data.token,
            user: response.data.user
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        throw new Error(errorMessage);
    }
};

export const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};


// update user profile
export const updateUserProfile = async (id, userData) => {
    try {
        const formData = new FormData();
        if (userData.name) formData.append('name', userData.name);
        if (userData.email) {
            formData.append('email', userData.email.toLowerCase().trim());
        }
        if (userData.image instanceof File) {
            formData.append('image', userData.image);
        }
        const response = await axiosClient.put('/users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (!response.data.user || !response.data.user.email) {
            throw new Error('Invalid response from server');
        }
        return {
            success: true,
            user: {
                ...response.data.user,
                email: response.data.user.email.toLowerCase().trim()
            },
            message: response.data.message || 'Profile updated successfully'
        };
    } catch (error) {
        if (error.response?.data?.message?.toLowerCase().includes('email')) {
            throw new Error('This email address is already in use');
        }
        const errorMessage = error.response?.data?.message || 'Error updating profile';
        throw new Error(errorMessage);
    }
};


// change password
export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axiosClient.patch('/users/change-password', {
            oldPassword,
            newPassword
        });

        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        return {
            success: true,
            message: response.data.message || 'Password changed successfully'
        };
    } catch (error) {
        // console.error('Password change error:', error.response || error);
        const errorMessage = error.response?.data?.message || 'Failed to change password';
        throw new Error(errorMessage);
    }
};


// add partner  
export const addPartner = async (partnerData) => {
    try {
        const response = await axiosClient.post('/partner/create', partnerData);
        if (!response.data) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error adding partner';
        throw new Error(errorMessage);
    }
};


// api.ts or wherever you define this
export const getAllPartners = async ({ page = 1, limit = 8, search = '' }) => {

    try {
        const response = await axiosClient.get(`/partner?search=${search}&page=${page}&limit=${limit}`);
        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching partners';
        throw new Error(errorMessage);
    }
};


// delete partner
export const deletePartner = async (id) => {
    try {
        const response = await axiosClient.delete(`/partner/delete/${id}`);
        if (!response.data) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting partner';
        throw new Error(errorMessage);
    }
};

// update partner
export const updatePartner = async (id, partnerData) => {
    try {
        const response = await axiosClient.put(`/partner/update/${id}`, partnerData);
        if (!response.data) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error updating partner';
        throw new Error(errorMessage);
    }
};


// get partner by id
export const getPartnerById = async (id) => {
    try {
        const response = await axiosClient.get(`/partner/${id}`);
        if (!response.data) {
            throw new Error('Invalid response from server');
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching partner';
        throw new Error(errorMessage);
    }
};