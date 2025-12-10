"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog"
import Image from 'next/image'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAllProducts, getProductById, updateProduct, deleteProduct } from '../../../../apis/productsCreate'
import toast from 'react-hot-toast'
import ReusableTable from '../../../../components/shared/ReusableTable'


export default function UploadProduct() {
  const router = useRouter()

  // State management
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingProductId, setUpdatingProductId] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const itemsPerPage = 10

  // Fetch products function
  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const response = await getAllProducts(page, itemsPerPage, search)

      if (response.success) {
        setProducts(response.data)
        setPagination(response.pagination)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Pagination function
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page, searchTerm)
    }
  }

  const handleDelete = (productId) => {
    const product = products.find(p => p.id === productId)
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      setIsDeleting(true)
      const response = await deleteProduct(productToDelete.id)

      if (response.success) {
        toast.success('Product deleted successfully!')
        setDeleteModalOpen(false)
        setProductToDelete(null)

        // Refresh the product list
        fetchProducts(pagination.currentPage, searchTerm)
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleUpdate = async (productId) => {
    try {
      setUpdatingProductId(productId)
      const response = await getProductById(productId)

      if (response.success) {
        router.push(`/dashboard/add-products?id=${productId}`)
      } else {
        toast.error('Failed to load product')
      }
    } catch (error) {
      console.error('Error getting product:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setUpdatingProductId(null)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Define table columns
  const columns = [
    {
      header: 'Product Name',
      accessor: (product) => (
        <span className="font-medium">{product.name}</span>
      ),
      width: '20%'
    },
    {
      header: 'Image',
      accessor: (product) => (
        <div className="w-16 h-16 relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ),
      width: '12%'
    },
    {
      header: 'Price',
      accessor: (product) => (
        <span className="font-semibold">{formatPrice(product.price)}</span>
      ),
      width: '12%'
    },
    {
      header: 'Category',
      accessor: (product) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {product.catagoary}
        </span>
      ),
      width: '15%'
    },
    {
      header: 'Gender',
      accessor: (product) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          product.gender === 'Herren'
            ? 'bg-green-100 text-green-800'
            : product.gender === 'Damen'
            ? 'bg-pink-100 text-pink-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {product.gender}
        </span>
      ),
      width: '12%'
    },
    {
      header: 'Create Date',
      accessor: (product) => (
        <span className="text-muted-foreground">{formatDate(product.createdAt)}</span>
      ),
      width: '14%'
    },
    {
      header: 'Actions',
      accessor: (product) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdate(product.id)}
            className="text-blue-600 cursor-pointer hover:text-blue-700"
            disabled={updatingProductId === product.id}
          >
            {updatingProductId === product.id ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              'Update'
            )}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(product.id)}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
      ),
      width: '15%',
      align: 'right'
    }
  ]

  // handle add products 
  const handleAddProducts = () => {
    router.push('/dashboard/add-products')
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-5">
        <div >
          <h1 className=" text-2xl 2xl:text-2xl font-semibold">Upload Product</h1>
          <p className="text-gray-500 mt-2 text-sm 2xl:text-base">Manage all your products</p>
        </div>
        <div>
          <Button onClick={handleAddProducts} className="bg-green-600 cursor-pointer hover:bg-green-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products found. Start by uploading your first product!"
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          itemsPerPage: itemsPerPage
        }}
        onPageChange={handlePageChange}
        itemLabel="products"
        showPagination={true}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
