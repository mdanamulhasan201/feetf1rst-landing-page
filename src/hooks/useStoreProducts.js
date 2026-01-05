import { useState, useEffect } from 'react'
import { getAllStoreProducts, createStoreProduct, updateStoreProduct, deleteStoreProduct, getStoreProductById } from '../apis/storageManagement'
import { useDebounce } from './useDebounce'
import toast from 'react-hot-toast'

export const useStoreProducts = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
        totalItems: 0
    })

    const fetchProducts = async (page = 1, search = '') => {
        setIsLoading(true)
        try {
            const itemsPerPage = 10
            const response = await getAllStoreProducts(page, itemsPerPage, search)
            if (response.success) {
                setProducts(response.data || [])
                setPagination(prev => ({
                    ...prev,
                    currentPage: response.pagination?.currentPage || page,
                    totalPages: response.pagination?.totalPages || 1,
                    totalItems: response.pagination?.totalItems || 0,
                    itemsPerPage: response.pagination?.itemsPerPage || itemsPerPage
                }))
            } else {
                toast.error(response.message || 'Fehler beim Laden der Produkte')
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error(error.message || 'Fehler beim Laden der Produkte')
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch products when debounced search term changes
    useEffect(() => {
        fetchProducts(1, debouncedSearchTerm)
    }, [debouncedSearchTerm])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProducts(newPage, debouncedSearchTerm)
        }
    }

    const refreshProducts = () => {
        fetchProducts(pagination.currentPage, debouncedSearchTerm)
    }

    const handleDelete = async (productId) => {
        try {
            const response = await deleteStoreProduct(productId)
            if (response.success) {
                toast.success(response.message || 'Produkt erfolgreich gelöscht')
                refreshProducts()
                return true
            } else {
                toast.error(response.message || 'Fehler beim Löschen des Produkts')
                return false
            }
        } catch (error) {
            console.error('Error deleting product:', error)
            toast.error(error.message || 'Fehler beim Löschen des Produkts')
            return false
        }
    }

    const loadProductForEdit = async (productId) => {
        try {
            const response = await getStoreProductById(productId)
            if (response.success && response.data) {
                return response.data
            } else {
                toast.error('Fehler beim Laden des Produkts')
                return null
            }
        } catch (error) {
            console.error('Error loading product:', error)
            toast.error(error.message || 'Fehler beim Laden des Produkts')
            return null
        }
    }

    return {
        products,
        isLoading,
        searchTerm,
        setSearchTerm,
        pagination,
        handlePageChange,
        refreshProducts,
        handleDelete,
        loadProductForEdit,
    }
}

