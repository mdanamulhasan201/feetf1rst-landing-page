"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog"
import { Trash2, Eye } from "lucide-react"
import { toast } from "react-hot-toast"
import { 
  getAllSuggestions, 
  deleteSuggestion 
} from "../../../../apis/suggestionsApis"
import ReusableTable from "../../../../components/shared/ReusableTable"
import ConfirmModal from "../../../../components/shared/ConfirmModal"

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemsToDelete, setItemsToDelete] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Fetch all suggestions
  const fetchSuggestions = async (page = 1) => {
    setLoading(true)
    try {
      const response = await getAllSuggestions(page, itemsPerPage)
      
      // Handle response structure
      if (response.improvements && Array.isArray(response.improvements)) {
        setSuggestions(response.improvements)
      } else if (response.data && Array.isArray(response.data)) {
        setSuggestions(response.data)
      } else if (Array.isArray(response)) {
        setSuggestions(response)
      } else {
        setSuggestions([])
      }

      // Handle pagination
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage || page)
        setTotalPages(response.pagination.totalPages || 1)
        setTotalItems(response.pagination.totalItems || 0)
      } else {
        setTotalPages(1)
        setTotalItems(response.improvements?.length || response.data?.length || response.length || 0)
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch suggestions")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions(currentPage)
  }, [currentPage])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchSuggestions(page)
  }

  // Handle delete click
  const handleDeleteClick = (item) => {
    setItemsToDelete([item.id])
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return

    setIsDeleting(true)
    try {
      await deleteSuggestion(itemsToDelete)
      toast.success("Suggestion(s) deleted successfully!")
      setDeleteModalOpen(false)
      setItemsToDelete([])
      fetchSuggestions(currentPage)
    } catch (error) {
      toast.error(error.message || "Failed to delete suggestion(s)")
    } finally {
      setIsDeleting(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Truncate text
  const truncateText = (text, maxLength = 60) => {
    if (!text) return "-"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Handle view detail
  const handleViewDetail = (item) => {
    setSelectedSuggestion(item)
    setDetailModalOpen(true)
  }

  // Table columns
  const columns = [
    {
      header: 'Suggestion',
      accessor: (item) => (
        <div className="max-w-md">
          <p 
            className="text-gray-900 text-sm cursor-pointer hover:text-blue-600 hover:underline"
            onClick={() => handleViewDetail(item)}
          >
            {truncateText(item.suggestion, 60)}
          </p>
          {item.image && item.image.length > 0 && (
            <div className="mt-2 flex gap-2">
              {item.image.slice(0, 1).map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Suggestion ${idx + 1}`}
                  className="w-10 h-10 object-cover rounded border border-gray-200 cursor-pointer"
                  onClick={() => handleViewDetail(item)}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ))}
              {item.image.length > 1 && (
                <div 
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs text-gray-600 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleViewDetail(item)}
                >
                  +{item.image.length - 1}
                </div>
              )}
            </div>
          )}
        </div>
      ),
      width: '35%'
    },
    {
      header: 'Category',
      accessor: (item) => (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {item.category || "N/A"}
        </Badge>
      ),
      width: '12%'
    },
    {
      header: 'User',
      accessor: (item) => (
        <div className="flex items-center gap-2">
          {item.user?.image && (
            <img 
              src={item.user.image} 
              alt={item.user?.name || "User"}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{item.user?.name || "N/A"}</p>
            <p className="text-xs text-gray-500">{item.user?.email || ""}</p>
          </div>
        </div>
      ),
      width: '20%'
    },
    {
      header: 'Date',
      accessor: (item) => (
        <span className="text-gray-600 text-sm">{formatDate(item.createdAt)}</span>
      ),
      width: '15%'
    },
    {
      header: 'Actions',
      accessor: (item) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(item)}
            className="flex cursor-pointer items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
      width: '18%',
      align: 'center',
      headerClassName: 'text-center'
    }
  ]

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Suggestions
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage user suggestions
          </p>
        </div>
      </div>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={suggestions}
        loading={loading}
        emptyMessage="No suggestions found."
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        }}
        onPageChange={handlePageChange}
        itemLabel="suggestions"
        showPagination={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Suggestion"
        description={`Are you sure you want to delete this suggestion? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Detail View Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suggestion</DialogTitle>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="py-4">
              <p className="text-gray-900 whitespace-pre-wrap text-base leading-relaxed">
                {selectedSuggestion.suggestion || "N/A"}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDetailModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
