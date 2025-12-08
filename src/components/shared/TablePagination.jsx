"use client"

import React from 'react'
import { Button } from '../ui/button'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

/**
 * Reusable Table Pagination Component
 * Similar to ManagePartnerPage design
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.total - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {number} props.startIndex - Starting index (0-based)
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onPageChange - Function to handle page change
 * @param {string} props.itemLabel - Label for items (e.g., "partners", "orders", "Einträgen")
 * @param {boolean} props.showItemCount - Whether to show item count on left
 */
export default function TablePagination({
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    startIndex,
    loading = false,
    onPageChange,
    itemLabel = "items",
    showItemCount = true
}) {
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
            return pageNumbers
        }
        pageNumbers.push(1)
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)
        if (currentPage <= 2) {
            end = 4
        } else if (currentPage >= totalPages - 1) {
            start = totalPages - 3
        }
        if (start > 2) pageNumbers.push('...')
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i)
        }
        if (end < totalPages - 1) pageNumbers.push('...')
        if (totalPages > 1) pageNumbers.push(totalPages)
        return pageNumbers
    }

    const hasPreviousPage = currentPage > 1
    const hasNextPage = currentPage < totalPages

    if (totalPages <= 0) return null

    // Determine if we should use German text based on itemLabel
    const useGerman = itemLabel === "Einträgen" || itemLabel === "Bestellungen"
    const showingText = useGerman ? "Zeige" : "Showing"

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            {showItemCount && (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
                    {!loading && total > 0 && (
                        <>
                            {useGerman ? (
                                <>
                                    {showingText} {startIndex + 1}-
                                    {Math.min(currentPage * itemsPerPage, total)} von {total} {itemLabel}
                                </>
                            ) : (
                                <>
                                    {showingText} {startIndex + 1}-
                                    {Math.min(currentPage * itemsPerPage, total)} of {total} {itemLabel}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(1)}
                    disabled={!hasPreviousPage || loading}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPreviousPage || loading}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2">...</span>
                    ) : (
                        <Button
                            key={`page-${page}`}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            className={`h-8 w-8 ${currentPage === page ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => onPageChange(page)}
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
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage || loading}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage || loading}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

