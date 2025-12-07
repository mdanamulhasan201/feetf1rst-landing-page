"use client"
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { updateUserProfile, changePassword } from '../../../../apis/authApis'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import AddPartner from '../../../../components/dashboard/AddPartner/AddPartner'
import Image from 'next/image'

export default function Settings() {
    const { user, updateUser } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [isEditing, setIsEditing] = useState({
        name: false,
        email: false
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const { register, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors } } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        if (user) {
            setUsername(user.name || '')
            setEmail(user.email || '')
            if (user.image) {
                setProfileImage(user.image)
            } else if (user.profileImage) {
                setProfileImage(user.profileImage)
            }
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const hasNameChange = username !== user.name;
            const hasEmailChange = email !== user.email;
            const hasImageChange = profileImage instanceof File;

            setHasChanges(hasNameChange || hasEmailChange || hasImageChange);
        }
    }, [username, email, profileImage, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Form submitted, activeTab:', activeTab);

        if (activeTab === 'profile') {
            try {
                const userData = {
                    name: username,
                    email: email,
                };
                if (profileImage instanceof File) {
                    userData.image = profileImage;
                }
                const response = await updateUserProfile(user.id, userData);

                if (response.success) {
                    updateUser({
                        name: username,
                        email: email,
                        image: response.user.image || profileImage
                    });

                    // Show success message
                    toast.success('Profile updated successfully!');
                }
            } catch (error) {
                // console.error('Error updating profile:', error);
                toast.error(error.message || 'Failed to update profile');
            }
        } else if (activeTab === 'security') {
            try {
                // Validate passwords
                if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error('All password fields are required');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    toast.error('New passwords do not match');
                    return;
                }

                if (newPassword.length < 6) {
                    toast.error('New password must be at least 6 characters long');
                    return;
                }

                // Call the API to change password
                const response = await changePassword(currentPassword, newPassword);

                if (response.success) {
                    // Clear password fields
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');

                    // Show success message
                    toast.success('Password changed successfully');
                }
            } catch (error) {
                console.error('Detailed error:', error);
                toast.error(error.message || 'Failed to change password');
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                setProfileImage(file);
            } catch (error) {
                console.error('Error handling image:', error);
                toast.error('Error handling image upload');
            }
        }
    };

    const handleEditClick = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const onPasswordSubmit = async (data) => {
        try {
            // Validate passwords match
            if (data.newPassword !== data.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }

            if (data.newPassword.length < 6) {
                toast.error('New password must be at least 6 characters long');
                return;
            }

            // Call the API to change password
            const response = await changePassword(data.currentPassword, data.newPassword);

            if (response.success) {
                // Reset form
                resetPasswordForm();
                // Show success message
                toast.success('Password changed successfully');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Failed to change password');
        }
    };

    // Update the form fields to include edit buttons
    const renderInputWithEdit = (field, value, setValue, label, icon, type = 'text') => (
        <div>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    id={field}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={!isEditing[field]}
                    className={`pl-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${!isEditing[field] ? 'bg-gray-50' : ''}`}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                />
                <button
                    type="button"
                    onClick={() => handleEditClick(field)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${isEditing[field] ? 'text-green-600' : 'text-gray-400'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-4">
                    <button
                        className={`py-2 cursor-pointer px-4 border-b-2 font-medium transition-colors ${activeTab === 'profile'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`py-2 px-4 cursor-pointer border-b-2 font-medium transition-colors ${activeTab === 'security'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => setActiveTab('security')}
                    >
                        Security
                    </button>

                </div>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-lg font-medium text-gray-800 mb-5">Personal Information</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Profile Picture
                                </label>
                                <div className="relative w-32 h-32 mx-auto">
                                    <div className="w-full h-full rounded-full p-2 border">
                                        {profileImage ? (
                                            <Image
                                                width={400}
                                                height={400}
                                                src={typeof profileImage === 'string' ? profileImage : URL.createObjectURL(profileImage)}
                                                alt="Profile preview"
                                                className="w-full h-full p-3"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Camera Icon Overlay */}
                                    <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-75 rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        <input
                                            id="profileImage"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div>
                                {/* Name Input with Edit */}
                                {renderInputWithEdit(
                                    'username',
                                    username,
                                    setUsername,
                                    'Username',
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                {/* Email Input with Edit */}
                                {renderInputWithEdit(
                                    'email',
                                    email,
                                    setEmail,
                                    'Email Address',
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>,
                                    'email'
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!hasChanges}
                            className={`px-5 py-2 cursor-pointer rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium shadow-sm
                                ${hasChanges
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            )}

            {/* Security Tab Content */}
            {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-lg font-medium text-gray-800 mb-5">Change Password</h2>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        {...register("currentPassword", {
                                            required: "Current password is required"
                                        })}
                                        className={`pl-10 pr-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${errors.currentPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        {...register("newPassword", {
                                            required: "New password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        className={`pl-10 pr-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${errors.newPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value, formValues) =>
                                                value === formValues.newPassword || "Passwords do not match"
                                        })}
                                        className={`pl-10 pr-10 mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium shadow-sm"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            )}

            {/* Manage Partner Tab Content */}
            {activeTab === 'partner' && (
                <div>
                    <AddPartner />
                </div>
            )}
        </div>
    )
}
