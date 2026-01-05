"use client"

import React from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { useStoreManagement } from '../../../context/StoreManagementContext'
import { useStoreProducts } from '../../../hooks/useStoreProducts'
import ProductFormModal from './ProductFormModal'
import ProductTable from './ProductTable'
import SearchBar from './SearchBar'
import Pagination from './Pagination'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function Storemanagement() {
    const { openModal, openEditModal } = useStoreManagement()
    const {
        products,
        isLoading,
        searchTerm,
        setSearchTerm,
        pagination,
        handlePageChange,
        refreshProducts,
        handleDelete,
        loadProductForEdit,
    } = useStoreProducts()

    const handleEdit = (productId) => {
        openEditModal(productId)
    }

    return (
        <>
            <div className="mb-4">
                <Button
                    onClick={openModal}
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                    Produkt manuell hinzufügen
                </Button>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Produktliste</CardTitle>
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Lade Produkte...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Keine Produkte gefunden</p>
                        </div>
                    ) : (
                        <>
                            <ProductTable
                                products={products}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            <ProductFormModal
                onSuccess={refreshProducts}
                loadProductForEdit={loadProductForEdit}
            />

            <DeleteConfirmModal
                onConfirm={handleDelete}
            />
        </>
    )
}
