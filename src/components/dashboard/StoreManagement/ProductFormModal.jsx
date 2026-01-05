"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useStoreManagement } from '../../../context/StoreManagementContext'
import { createStoreProduct, updateStoreProduct } from '../../../apis/storageManagement'
import toast from 'react-hot-toast'
import Image from 'next/image'
import SizesTable from './SizesTable'

const defaultSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']

const initialFormData = {
    productName: '',
    brand: '',
    artikelnummer: '',
    price: '0',
    eigenschaften: '',
    groessenMengen: defaultSizes.reduce((acc, size) => {
        acc[size] = {
            length: '',
            quantity: '0'
        }
        return acc
    }, {})
}

export default function ProductFormModal({ productData, onSuccess, loadProductForEdit }) {
    const { isModalOpen, isEditMode, editingProductId, closeModal } = useStoreManagement()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState(initialFormData)
    const [bulkUpdateValue, setBulkUpdateValue] = useState('')

    // Load product data when editing
    useEffect(() => {
        if (isModalOpen && isEditMode && editingProductId && loadProductForEdit) {
            const loadProduct = async () => {
                setIsLoadingProduct(true)
                try {
                    const product = await loadProductForEdit(editingProductId)
                    if (product) {
                        setFormData({
                            productName: product.productName || '',
                            brand: product.brand || '',
                            artikelnummer: product.artikelnummer || '',
                            price: product.price?.toString() || '0',
                            eigenschaften: product.eigenschaften || '',
                            groessenMengen: product.groessenMengen ? Object.entries(product.groessenMengen).reduce((acc, [size, data]) => {
                                acc[size] = {
                                    length: data.length?.toString() || '',
                                    quantity: data.quantity?.toString() || '0'
                                }
                                return acc
                            }, {}) : initialFormData.groessenMengen
                        })
                        if (product.image) {
                            setImagePreview(product.image)
                        }
                    }
                } catch (error) {
                    console.error('Error loading product:', error)
                } finally {
                    setIsLoadingProduct(false)
                }
            }
            loadProduct()
        } else if (isModalOpen && !isEditMode) {
            // Reset form for new product
            setFormData(initialFormData)
            setImagePreview(null)
            setImageFile(null)
            setBulkUpdateValue('')
            setIsLoadingProduct(false)
        }
    }, [isModalOpen, isEditMode, editingProductId, loadProductForEdit])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSizeFieldChange = (size, field, value) => {
        setFormData(prev => ({
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    const handleBulkUpdate = () => {
        const increment = parseInt(bulkUpdateValue) || 0
        if (increment === 0) {
            toast.error('Bitte geben Sie eine gültige Anzahl ein')
            return
        }

        setFormData(prev => {
            const updatedGroessenMengen = { ...prev.groessenMengen }
            Object.keys(updatedGroessenMengen).forEach(size => {
                const currentQuantity = parseInt(updatedGroessenMengen[size].quantity) || 0
                updatedGroessenMengen[size].quantity = (currentQuantity + increment).toString()
            })
            return {
                ...prev,
                groessenMengen: updatedGroessenMengen
            }
        })

        setBulkUpdateValue('')
        toast.success(`Alle Größen um ${increment} erhöht`)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!formData.productName.trim()) {
                toast.error('Produktname ist erforderlich')
                setIsLoading(false)
                return
            }

            if (!formData.brand.trim()) {
                toast.error('Hersteller ist erforderlich')
                setIsLoading(false)
                return
            }

            const productData = new FormData()
            productData.append('productName', formData.productName)
            productData.append('brand', formData.brand)
            productData.append('artikelnummer', formData.artikelnummer)
            productData.append('price', parseFloat(formData.price) || 0)
            productData.append('eigenschaften', formData.eigenschaften)
            
            const groessenMengen = Object.entries(formData.groessenMengen).reduce((acc, [size, data]) => {
                acc[size] = {
                    length: parseFloat(data.length) || 0,
                    quantity: parseInt(data.quantity) || 0
                }
                return acc
            }, {})
            productData.append('groessenMengen', JSON.stringify(groessenMengen))

            if (imageFile) {
                productData.append('image', imageFile)
            }

            let response
            if (isEditMode && editingProductId) {
                response = await updateStoreProduct(editingProductId, productData)
            } else {
                response = await createStoreProduct(productData)
            }

            if (response.success) {
                toast.success(response.message || (isEditMode ? 'Produkt erfolgreich aktualisiert' : 'Produkt erfolgreich hinzugefügt'))
                setFormData(initialFormData)
                setImageFile(null)
                setImagePreview(null)
                closeModal()
                if (onSuccess) onSuccess()
            } else {
                toast.error(response.message || 'Fehler beim Speichern des Produkts')
            }
        } catch (error) {
            console.error('Error saving product:', error)
            toast.error(error.message || 'Fehler beim Speichern des Produkts')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isModalOpen) return null

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
        >
            <Card 
                className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <CardTitle className="text-xl font-bold cursor-pointer">
                        {isEditMode ? 'Produkt bearbeiten' : 'Produkt manuell hinzufügen'}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeModal}
                        className="h-8 w-8"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </CardHeader>

                <CardContent className="pt-6">
                    {isLoadingProduct ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                            <p className="text-gray-600">Produktdaten werden geladen...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Produktdetails</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="productName">Produktname</Label>
                                        <Input
                                            id="productName"
                                            type="text"
                                            placeholder="Produktname eingeben"
                                            value={formData.productName}
                                            onChange={(e) => handleInputChange('productName', e.target.value)}
                                            className="w-full"
                                            required
                                            disabled={isLoadingProduct}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand">Hersteller</Label>
                                        <Input
                                            id="brand"
                                            type="text"
                                            placeholder="Hersteller eingeben"
                                            value={formData.brand}
                                            onChange={(e) => handleInputChange('brand', e.target.value)}
                                            className="w-full"
                                            required
                                            disabled={isLoadingProduct}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="artikelnummer">Artikelnummer</Label>
                                    <Input
                                        id="artikelnummer"
                                        type="text"
                                        placeholder="Artikelnummer eingeben"
                                        value={formData.artikelnummer}
                                        onChange={(e) => handleInputChange('artikelnummer', e.target.value)}
                                        className="w-full"
                                        disabled={isLoadingProduct}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Preis (€)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        className="w-full"
                                        placeholder="0"
                                        disabled={isLoadingProduct}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eigenschaften">Eigenschaften</Label>
                                    <Input
                                        id="eigenschaften"
                                        type="text"
                                        placeholder="Eigenschaften eingeben"
                                        value={formData.eigenschaften}
                                        onChange={(e) => handleInputChange('eigenschaften', e.target.value)}
                                        className="w-full"
                                        disabled={isLoadingProduct}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Produktbild</Label>
                                    <div className="space-y-4">
                                        {imagePreview ? (
                                            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    onClick={handleRemoveImage}
                                                    disabled={isLoadingProduct}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600 mb-2">Klicken Sie, um ein Bild hochzuladen</p>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={isLoadingProduct}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => document.getElementById('image').click()}
                                                    disabled={isLoadingProduct}
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Datei auswählen
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Update Section */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-lg font-semibold text-gray-800">Massenaktualisierung</h3>
                                <div className="flex items-center gap-3">
                                    <Label htmlFor="bulkUpdate" className="whitespace-nowrap">
                                        Alle Größen um X erhöhen
                                    </Label>
                                    <Input
                                        id="bulkUpdate"
                                        type="number"
                                        placeholder="Anzahl eingeben..."
                                        value={bulkUpdateValue}
                                        onChange={(e) => setBulkUpdateValue(e.target.value)}
                                        className="w-48"
                                        disabled={isLoadingProduct}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleBulkUpdate}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isLoadingProduct}
                                    >
                                        Hinzufügen
                                    </Button>
                                </div>
                            </div>

                            <SizesTable
                                formData={formData}
                                onSizeFieldChange={handleSizeFieldChange}
                                disabled={isLoadingProduct}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                    disabled={isLoading || isLoadingProduct}
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={isLoading || isLoadingProduct}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Wird gespeichert...
                                        </>
                                    ) : (
                                        isEditMode ? 'Produkt aktualisieren' : 'Produkt hinzufügen'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

