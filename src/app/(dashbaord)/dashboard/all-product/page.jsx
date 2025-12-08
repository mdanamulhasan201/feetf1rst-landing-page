"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from "react-hot-toast"
import { format } from 'date-fns'

import ReusableTable from "../../../../components/shared/ReusableTable"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Plus
} from "lucide-react"
import { getAllProduct, deleteProduct } from '../../../../apis/productsApis'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog"
import Image from 'next/image'

export default function AllProduct() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 0,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 8
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [startIndex, setStartIndex] = useState(0)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get('search') || '')

  // Debounced search handler
  const debounceSearch = useCallback((value) => {
    setSearchTerm(value)

    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout)
    }

    // Set new timeout for the actual search
    window.searchTimeout = setTimeout(() => {
      setDebouncedSearchTerm(value)
      setPagination(prev => ({ ...prev, currentPage: 1 }))
      updateURL(value, 1)
    }, 500)
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const result = await getAllProduct({
        search: debouncedSearchTerm,
        page: pagination.currentPage,
        limit: itemsPerPage
      })

      setProducts(result.products)
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        total: result.total,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      })

      setStartIndex((result.currentPage - 1) * itemsPerPage)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError(error.message)
      setProducts([])
      setStartIndex(0)
    } finally {
      setLoading(false)
    }
  }

  // Simple function to update URL
  function updateURL(search, page) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page.toString())

    router.push(`?${params.toString() || ''}`, { scroll: false })
  }



  // Simplified page change handler
  function changePage(newPage) {
    if (newPage === pagination.currentPage) return
    setPagination(prev => ({ ...prev, currentPage: newPage }))
    updateURL(searchTerm, newPage)
  }

  // Update delete handler
  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct(productToDelete.id)
      toast.success('Product deleted successfully')
      setDeleteModalOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product. Please try again.')
    }
  }

  // Add modal open handler
  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  // Update useEffect to use debouncedSearchTerm
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    const search = searchParams.get('search') || ''

    setSearchTerm(search)
    setDebouncedSearchTerm(search)
    setPagination(prev => ({ ...prev, currentPage: page }))
    fetchProducts()
  }, [searchParams])

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout)
      }
    }
  }, [])

  const handleAddNewShoes = () => {
    router.push('/dashboard/create-products')
  }

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Footwear Collection</h1>
          <p className="text-gray-500 mt-1">Manage your shoes inventory by gender and style</p>
        </div>
        <Button className="bg-green-600 cursor-pointer hover:bg-green-700 flex items-center gap-2" onClick={handleAddNewShoes}>
          <Plus className="h-4 w-4" />
          Add New Shoes
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => debounceSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      <ReusableTable
          columns={[
            {
              header: 'Index',
              accessor: (product, index) => {
                const idx = (startIndex || 0) + (index || 0) + 1;
                return isNaN(idx) ? '' : idx;
              },
              width: '8%',
              align: 'center',
              cellClassName: 'font-medium'
            },
            {
              header: 'Product',
              accessor: (product) => (
                <div className="flex items-center gap-3">
                  {product.colors && product.colors[0] && product.colors[0].images && product.colors[0].images[0] ? (
                    <div className="relative w-14 h-14">
                      <Image
                        src={product.colors[0].images[0].url}
                        width={100}
                        height={100}
                        alt={product.name}
                        className="w-full h-full rounded-md object-cover border border-gray-200"
                      />
                      {product.colors.length > 1 && (
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="secondary" className="text-xs">
                            +{product.colors.length - 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500">{product.typeOfShoes}</span>
                  </div>
                </div>
              ),
              width: '25%'
            },
            {
              header: 'Colors',
              accessor: (product) => (
                <div className="flex items-center justify-center gap-1">
                  {product.colors.map((color) => (
                    <div
                      key={color.id}
                      className="group relative"
                      title={color.colorName}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.colorCode }}
                      />
                      <div className="absolute hidden group-hover:block z-10 -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                        {color.colorName}
                      </div>
                    </div>
                  ))}
                </div>
              ),
              width: '12%',
              align: 'center'
            },
            {
              header: 'Gender',
              accessor: (product) => (
                <Badge className={`font-normal ${product.gender === "MALE" ? "bg-blue-100 text-blue-800" :
                  product.gender === "FEMALE" ? "bg-pink-100 text-pink-800" :
                    "bg-purple-100 text-purple-800"
                  }`}>
                  {product.gender}
                </Badge>
              ),
              width: '10%',
              align: 'center'
            },
            {
              header: 'Price',
              accessor: (product) => (
                <div className="flex flex-col items-center">
                  <span className="font-medium">€{product?.price?.toFixed(2)}</span>
                  {product?.offer > 0 && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      {product?.offer}% OFF
                    </Badge>
                  )}
                </div>
              ),
              width: '10%',
              align: 'center'
            },
            {
              header: 'Brand',
              accessor: 'brand',
              width: '10%',
              align: 'center'
            },
            {
              header: 'Created At',
              accessor: (product) => format(new Date(product.createdAt), 'MMM d, yyyy'),
              width: '12%',
              align: 'center',
              cellClassName: 'text-gray-500'
            },
            {
              header: 'Actions',
              accessor: (product) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/create-products?edit=${product.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Product</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600"
                      onClick={() => openDeleteModal(product)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
              width: '13%',
              align: 'center'
            }
          ]}
          data={products}
          loading={loading}
          emptyMessage={error ? `Error: ${error}` : "No shoes found. Try adjusting your search."}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalItems: pagination.total,
            itemsPerPage: itemsPerPage
          }}
          onPageChange={changePage}
          itemLabel="shoes"
          showPagination={true}
          tableClassName=""
          containerClassName=""
        />

      {/* Add the delete confirmation modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
