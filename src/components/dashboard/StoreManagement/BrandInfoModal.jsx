"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog'
import { Loader2 } from 'lucide-react'
import { updateBrandInfo } from '../../../apis/storageManagement'
import toast from 'react-hot-toast'

const defaultSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']

export default function BrandInfoModal({ 
    isOpen, 
    onClose, 
    brandInfo, 
    onApply,
    isLoading 
}) {
    const [editableBrandInfo, setEditableBrandInfo] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (brandInfo && isOpen) {
            // Create editable copy
            const editableData = {
                ...brandInfo,
                groessenMengen: brandInfo.groessenMengen ? Object.entries(brandInfo.groessenMengen).reduce((acc, [size, data]) => {
                    acc[size] = {
                        length: data.length?.toString() || '',
                        quantity: data.quantity?.toString() || '0'
                    }
                    return acc
                }, {}) : {}
            }
            setEditableBrandInfo(editableData)
        }
    }, [brandInfo, isOpen])

    const handleFieldChange = (size, field, value) => {
        setEditableBrandInfo(prev => ({
            ...prev,
            groessenMengen: {
                ...prev.groessenMengen,
                [size]: {
                    ...prev.groessenMengen[size],
                    [field]: value
                }
            }
        }))
    }

    const handleApply = async () => {
        if (editableBrandInfo && editableBrandInfo.groessenMengen && editableBrandInfo.id) {
            setIsUpdating(true)
            try {
                // Convert groessenMengen to the correct format with numbers
                const groessenMengenData = Object.entries(editableBrandInfo.groessenMengen).reduce((acc, [size, data]) => {
                    acc[size] = {
                        length: parseFloat(data.length) || 0,
                        quantity: parseInt(data.quantity) || 0
                    }
                    return acc
                }, {})

                const updateData = {
                    groessenMengen: groessenMengenData
                }

                // Call update API
                const response = await updateBrandInfo(editableBrandInfo.id, updateData)
                
                if (response.success) {
                    toast.success(response.message || 'Markeninformationen erfolgreich aktualisiert')
                    // Call onApply callback to update the form
                    if (onApply) {
                        onApply(editableBrandInfo.groessenMengen)
                    }
                    onClose()
                } else {
                    toast.error(response.message || 'Fehler beim Aktualisieren der Markeninformationen')
                }
            } catch (error) {
                console.error('Error updating brand info:', error)
                toast.error(error.message || 'Fehler beim Aktualisieren der Markeninformationen')
            } finally {
                setIsUpdating(false)
            }
        }
    }

    const handleClose = () => {
        setEditableBrandInfo(null)
        onClose()
    }

    const handleOpenChange = (open) => {
        // Only close when explicitly set to false, not when clicking inside
        if (!open) {
            handleClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange} modal={true}>
            <DialogContent 
                className="max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <DialogHeader
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <DialogTitle>Markeninformationen: {editableBrandInfo?.brand || brandInfo?.brand}</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                        <p className="text-gray-600">Markendaten werden geladen...</p>
                    </div>
                ) : editableBrandInfo ? (
                    <div 
                        className="space-y-4"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-800">Größen & Länge</h3>
                            <div 
                                className="border rounded-lg overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Größe</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Länge (mm)</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Menge</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {defaultSizes.map((size) => {
                                                const sizeData = editableBrandInfo.groessenMengen?.[size] || { length: '', quantity: '0' }
                                                return (
                                                    <tr key={size} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3">
                                                            <div className="text-sm font-medium text-gray-900">{size}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Input
                                                                type="number"
                                                                step="1"
                                                                value={sizeData.length}
                                                                onChange={(e) => handleFieldChange(size, 'length', e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onFocus={(e) => e.stopPropagation()}
                                                                className="w-24"
                                                                autoComplete="off"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Input
                                                                type="number"
                                                                step="1"
                                                                min="0"
                                                                value={sizeData.quantity}
                                                                onChange={(e) => handleFieldChange(size, 'quantity', e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onFocus={(e) => e.stopPropagation()}
                                                                className="w-24"
                                                                autoComplete="off"
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                <DialogFooter
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClose()
                        }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleApply()
                        }}
                        disabled={!editableBrandInfo || isUpdating}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Wird gespeichert...
                            </>
                        ) : (
                            'OK'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

