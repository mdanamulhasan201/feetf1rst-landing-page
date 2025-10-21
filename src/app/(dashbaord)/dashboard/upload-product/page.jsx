"use client"

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table"
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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAllProducts, getProductById, updateProduct, deleteProduct } from '../../../../apis/productsCreate'
import toast from 'react-hot-toast'


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

  // Pagination functions
  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page, searchTerm)
    }
  }

  const getPageNumbers = () => {
    const current = pagination.currentPage
    const total = pagination.totalPages
    const pages = []

    if (total <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (current > 4) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (current < total - 3) {
        pages.push('...')
      }

      // Always show last page
      if (total > 1) {
        pages.push(total)
      }
    }

    return pages
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

      <div className="rounded-md border bg-white p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] ">Product Name</TableHead>
              <TableHead className="w-[12%]">Image</TableHead>
              <TableHead className="w-[12%] ">Price</TableHead>
              <TableHead className="w-[15%] ">Category</TableHead>
              <TableHead className="w-[12%] ">Gender</TableHead>
              <TableHead className="w-[14%] ">Create Date</TableHead>
              <TableHead className="w-[15%] text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-16 relative ">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {product.catagoary}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.gender === 'Herren'
                      ? 'bg-green-100 text-green-800'
                      : product.gender === 'Damen'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {product.gender}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell>
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
                        className="cursor-pointer "
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No products found. Start by uploading your first product!</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
          {!loading && products.length > 0 && (
            <>
              Showing {((pagination.currentPage - 1) * itemsPerPage) + 1}-
              {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} products
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => changePage(1)}
            disabled={!pagination.hasPrevPage || loading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => changePage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={`page-${page}`}
                variant={pagination.currentPage === page ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${pagination.currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => changePage(page)}
                disabled={loading}
              >
                {page}
              </Button>
            )
          ))}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => changePage(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => changePage(pagination.totalPages)}
            disabled={!pagination.hasNextPage || loading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md ml-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>
      </div>

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
