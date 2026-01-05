"use client"

import React, { createContext, useContext, useState } from 'react'

const StoreManagementContext = createContext(undefined)

export const useStoreManagement = () => {
    const context = useContext(StoreManagementContext)
    if (!context) {
        throw new Error('useStoreManagement must be used within StoreManagementProvider')
    }
    return context
}

export const StoreManagementProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState(null)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => {
        setIsModalOpen(false)
        setIsEditMode(false)
        setEditingProductId(null)
    }

    const openEditModal = (productId) => {
        setEditingProductId(productId)
        setIsEditMode(true)
        setIsModalOpen(true)
    }

    const openDeleteModal = (productId) => setDeleteConfirmId(productId)
    const closeDeleteModal = () => setDeleteConfirmId(null)

    return (
        <StoreManagementContext.Provider
            value={{
                isModalOpen,
                isEditMode,
                editingProductId,
                deleteConfirmId,
                openModal,
                closeModal,
                openEditModal,
                openDeleteModal,
                closeDeleteModal,
            }}
        >
            {children}
        </StoreManagementContext.Provider>
    )
}

