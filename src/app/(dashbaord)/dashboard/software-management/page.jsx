"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { 
  getAllSoftwareManagement, 
  deleteSoftwareManagement 
} from "../../../../apis/softwereManagement"
import ReusableTable from "../../../../components/shared/ReusableTable"
import SoftwareManagementFormModal from "../../../../components/dashboard/SoftwareManagement/SoftwareManagementFormModal"
import ConfirmModal from "../../../../components/shared/ConfirmModal"

export default function SoftwareManagement() {
  const [softwareVersions, setSoftwareVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  // Fetch all software versions
  const fetchSoftwareVersions = async (page = 1) => {
    setLoading(true)
    try {
      const response = await getAllSoftwareManagement(page, itemsPerPage)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        setSoftwareVersions(response.data)
      } else if (Array.isArray(response)) {
        setSoftwareVersions(response)
      } else if (response.softwareVersions && Array.isArray(response.softwareVersions)) {
        setSoftwareVersions(response.softwareVersions)
      } else {
        setSoftwareVersions([])
      }

      // Handle pagination
      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage || page)
        setTotalPages(response.pagination.totalPages || 1)
        setTotalItems(response.pagination.total || response.total || 0)
      } else if (response.totalPages) {
        setTotalPages(response.totalPages)
        setTotalItems(response.total || 0)
      } else {
        setTotalPages(1)
        setTotalItems(response.data?.length || response.length || 0)
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch software versions")
      setSoftwareVersions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSoftwareVersions(currentPage)
  }, [currentPage])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchSoftwareVersions(page)
  }

  // Handle create new
  const handleCreateNew = () => {
    setEditingData(null)
    setModalOpen(true)
  }

  // Handle edit
  const handleEdit = (item) => {
    setEditingData(item)
    setModalOpen(true)
  }

  // Handle delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      await deleteSoftwareManagement(itemToDelete.id)
      toast.success("Software version deleted successfully!")
      setDeleteModalOpen(false)
      setItemToDelete(null)
      fetchSoftwareVersions(currentPage)
    } catch (error) {
      toast.error(error.message || "Failed to delete software version")
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle modal success
  const handleModalSuccess = () => {
    fetchSoftwareVersions(currentPage)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Table columns
  const columns = [
    {
      header: 'Version',
      accessor: (item) => (
        <div className="flex items-center gap-2 flex-nowrap">
          <span className="font-semibold text-gray-900 whitespace-nowrap">{item.version}</span>
          {item.isNewest && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 whitespace-nowrap flex-shrink-0">
              Newest
            </Badge>
          )}
        </div>
      ),
      width: '15%'
    },
    {
      header: 'Title',
      accessor: (item) => (
        <span className="text-gray-900">{item.title || "-"}</span>
      ),
      width: '25%'
    },
    {
      header: 'Release Date',
      accessor: (item) => (
        <span className="text-gray-600">{formatDate(item.releaseDate)}</span>
      ),
      width: '15%'
    },
    {
      header: 'Description Sections',
      accessor: (item) => (
        <span className="text-gray-600">
          {item.description?.length || 0} section(s)
        </span>
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
            onClick={() => handleEdit(item)}
            className="flex cursor-pointer items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
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
      width: '20%',
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
            Software Management
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage software release notes
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-green-600 cursor-pointer hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Version
        </Button>
      </div>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={softwareVersions}
        loading={loading}
        emptyMessage="No software versions found. Create your first version!"
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage
        }}
        onPageChange={handlePageChange}
        itemLabel="versions"
        showPagination={true}
      />

      {/* Create/Edit Modal */}
      <SoftwareManagementFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingData={editingData}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Software Version"
        description={`Are you sure you want to delete version "${itemToDelete?.version}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
