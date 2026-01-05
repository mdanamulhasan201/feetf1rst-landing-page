"use client"

import React from 'react'
import { Button } from "../../ui/button"
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { useStoreManagement } from '../../../context/StoreManagementContext'
import Image from 'next/image'

export default function ProductTable({ products, onEdit, onDelete }) {
    const { openDeleteModal } = useStoreManagement()

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bild</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produktname</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hersteller</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Artikelnummer</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Preis (€)</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Eigenschaften</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Größen</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{product.productName}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-gray-600">{product.brand}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-gray-600">{product.artikelnummer || 'N/A'}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm font-medium">€{product.price}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-gray-600 max-w-xs truncate">{product.eigenschaften || 'N/A'}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs text-gray-500">
                                        {Object.keys(product.groessenMengen || {}).length} Größen
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(product.id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDeleteModal(product.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

