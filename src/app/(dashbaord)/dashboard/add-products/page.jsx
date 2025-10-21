"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createProducts, getProductById, updateProduct } from '../../../../apis/productsCreate'
import toast from 'react-hot-toast'

export default function AddProducts() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const productId = searchParams.get('id')
    const isEditMode = !!productId

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        gender: '',
        description: '',
        image: null,
        imagePreview: null
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)

    const categories = [
        'Running Shoes',
        'Casual Shoes',
        'Sports Shoes',
        'Formal Shoes',
        'Sneakers',
        'Boots',
        'Sandals'
    ]

    const genders = [
        'Herren',
        'Damen ',
    ]

    // Load product data when in edit mode
    useEffect(() => {
        if (isEditMode && productId) {
            loadProductData()
        }
    }, [isEditMode, productId])

    const loadProductData = async () => {
        try {
            setIsLoadingProduct(true)
            const response = await getProductById(productId)

            if (response.success) {
                const product = response.data
                setFormData({
                    name: product.name || '',
                    price: product.price || '',
                    category: product.catagoary || '', // API uses 'catagoary'
                    gender: product.gender || '',
                    description: product.description || '',
                    image: null, // Don't load existing image file
                    imagePreview: product.image || null // Show existing image URL
                })
            } else {
                toast.error('Failed to load product data')
                router.push('/dashboard/upload-product')
            }
        } catch (error) {
            console.error('Error loading product:', error)
            toast.error(`Error: ${error.message}`)
            router.push('/dashboard/upload-product')
        } finally {
            setIsLoadingProduct(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }))
        }
    }

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required'
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price is required'
        }

        if (!formData.category) {
            newErrors.category = 'Category is required'
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required'
        }

        if (!formData.image && !formData.imagePreview) {
            newErrors.image = 'Product image is required'
        }


        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            let response

            if (isEditMode) {
                // Update existing product
                const productFormData = new FormData()
                productFormData.append('name', formData.name)
                productFormData.append('price', formData.price)
                productFormData.append('catagoary', formData.category)
                productFormData.append('gender', formData.gender)
                productFormData.append('description', formData.description)
                
                // Only append image if a new one was uploaded
                if (formData.image) {
                    productFormData.append('image', formData.image)
                }

                response = await updateProduct(productId, productFormData)

                if (response && response.success) {
                    toast.success(response.message || 'Product updated successfully!')
                } else {
                    toast.error('Failed to update product. Please try again.')
                }
            } else {
                // Create new product
                const productFormData = new FormData()
                productFormData.append('name', formData.name)
                productFormData.append('price', formData.price)
                productFormData.append('catagoary', formData.category)
                productFormData.append('gender', formData.gender)
                productFormData.append('description', formData.description)
                productFormData.append('image', formData.image)

                response = await createProducts(productFormData)

                if (response && response.success) {
                    toast.success(response.message || 'Product created successfully!')

                    // Reset form only for new products
                    setFormData({
                        name: '',
                        price: '',
                        category: '',
                        gender: '',
                        description: '',
                        image: null,
                        imagePreview: null
                    })
                } else {
                    toast.error('Failed to create product. Please try again.')
                }
            }

            // Navigate after a short delay to let user see the toast
            setTimeout(() => {
                router.push('/dashboard/upload-product')
            }, 1500)
        } catch (error) {
            console.error('Error creating product:', error)
            toast.error(`Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.push('/dashboard/upload-product')
    }

    return (
        <div className="p-6">
            <div className="mb-6  ">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="mb-4 flex cursor-pointer items-center gap-2"

                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Products
                </Button>
                <div className=''>
                    <h1 className="text-xl font-bold text-center">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-center">
                        {isEditMode ? 'Update the product details below' : 'Fill in the details to add a new product'}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>
                            Enter the product details below. All fields marked with * are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Enter price"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className={errors.price ? 'border-red-500' : ''}
                                    min="0"
                                    step="0.01"
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                            </div>

                            {/* Category & Gender - half/half */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                        <SelectTrigger className={errors.category ? 'border-red-500 w-full' : 'w-full'}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                        <SelectTrigger className={errors.gender ? 'border-red-500 w-full' : 'w-full'}>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genders.map((gender) => (
                                                <SelectItem key={gender} value={gender}>
                                                    {gender}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter product description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Product Image *</Label>
                                <div className="space-y-4">
                                    {formData.imagePreview ? (
                                        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 mb-2">Click to upload product image</p>
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('image').click()}
                                            >
                                                Choose File
                                            </Button>
                                        </div>
                                    )}
                                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    type="submit"
                                    className="bg-green-600 cursor-pointer hover:bg-green-700"
                                    disabled={isLoading || isLoadingProduct}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isEditMode ? 'Updating Product...' : 'Adding Product...'}
                                        </>
                                    ) : (
                                        isEditMode ? 'Update Product' : 'Add Product'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="cursor-pointer"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
