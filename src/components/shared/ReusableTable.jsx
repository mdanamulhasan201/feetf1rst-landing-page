"use client"

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import TablePagination from './TablePagination'

/**
 * Reusable Table Component
 * Follows Bestellubersicht design pattern
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column configuration objects
 * @param {Array} props.data - Array of data objects to display
 * @param {boolean} props.loading - Loading state
 * @param {string} props.emptyMessage - Message to show when no data
 * @param {Object} props.pagination - Pagination object { currentPage, totalPages, totalItems, itemsPerPage }
 * @param {Function} props.onPageChange - Function to handle page change
 * @param {string} props.itemLabel - Label for pagination (e.g., "Einträgen", "partners")
 * @param {boolean} props.showPagination - Whether to show pagination (default: true)
 * @param {string} props.tableClassName - Additional classes for table
 * @param {string} props.containerClassName - Additional classes for container
 */
// Shimmer skeleton component for table rows
const TableRowSkeleton = ({ columns, columnWidth }) => {
    return (
        <TableRow className="hover:bg-gray-50 w-full h-[57px]">
            {columns.map((column, colIndex) => (
                <TableCell
                    key={colIndex}
                    className={`px-2 py-3 h-[57px] ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                >
                    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" 
                         style={{ 
                             width: column.skeletonWidth || (column.align === 'center' ? '60%' : column.align === 'right' ? '70%' : '80%'),
                             margin: column.align === 'center' ? '0 auto' : column.align === 'right' ? '0 0 0 auto' : '0'
                         }}
                    />
                </TableCell>
            ))}
        </TableRow>
    )
}

export default function ReusableTable({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "Keine Daten gefunden",
    pagination = null,
    onPageChange = () => {},
    itemLabel = "Einträgen",
    showPagination = true,
    tableClassName = "",
    containerClassName = "",
    skeletonRows = null // If null, will use pagination.itemsPerPage
}) {
    // Calculate column widths if not provided
    const columnCount = columns.length
    const columnWidth = columnCount > 0 ? `${100 / columnCount}%` : 'auto'
    
    // Calculate number of shimmer rows dynamically based on itemsPerPage
    const shimmerRowsCount = skeletonRows !== null 
        ? skeletonRows 
        : (pagination?.itemsPerPage || 10)
    
    // Calculate min height for table body to maintain consistent height
    // Each row is approximately 57px (py-3 = 12px top + 12px bottom + content)
    const minTableBodyHeight = shimmerRowsCount * 57

    return (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden w-full ${containerClassName}`}>
            <div className="overflow-x-auto overflow-y-visible -mx-1">
                <div className="inline-block min-w-full align-middle">
                    <Table 
                        className={`w-full table-fixed border-collapse ${tableClassName}`} 
                        style={{ tableLayout: 'fixed', width: '100%', minWidth: '900px', borderSpacing: 0 }}
                    >
                    <colgroup>
                        {columns.map((col, index) => (
                            <col 
                                key={index} 
                                style={{ width: col.width || columnWidth }} 
                            />
                        ))}
                    </colgroup>
                    <TableHeader className="w-full">
                        <TableRow className="bg-gray-50 w-full">
                            {columns.map((column, index) => (
                                <TableHead
                                    key={index}
                                    className={`font-semibold text-gray-700 px-3 py-3 whitespace-nowrap ${column.headerClassName || ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{ minHeight: `${minTableBodyHeight}px` }}>
                        {loading ? (
                            // Show shimmer skeleton rows when loading - dynamic based on itemsPerPage
                            Array.from({ length: shimmerRowsCount }).map((_, index) => (
                                <TableRowSkeleton key={`skeleton-${index}`} columns={columns} columnWidth={columnWidth} />
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="text-center py-8 text-gray-500"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, rowIndex) => (
                                <TableRow 
                                    key={row.id || rowIndex} 
                                    className="hover:bg-gray-50 w-full h-[57px]"
                                >
                                    {columns.map((column, colIndex) => {
                                        // Get cell content
                                        let cellContent = null
                                        
                                        if (column.render) {
                                            // Custom render function
                                            cellContent = column.render(row, rowIndex)
                                        } else if (column.accessor) {
                                            // Accessor function or key path
                                            if (typeof column.accessor === 'function') {
                                                cellContent = column.accessor(row, rowIndex)
                                            } else {
                                                // Key path like "partner.name"
                                                const keys = column.accessor.split('.')
                                                cellContent = keys.reduce((obj, key) => obj?.[key], row)
                                            }
                                        } else if (column.key) {
                                            // Simple key access
                                            cellContent = row[column.key]
                                        }

                                        // Ensure cellContent is never null, undefined, or NaN
                                        if (cellContent === null || cellContent === undefined || (typeof cellContent === 'number' && isNaN(cellContent))) {
                                            cellContent = ''
                                        }

                                        return (
                                            <TableCell
                                                key={colIndex}
                                                className={`px-3 py-3 whitespace-nowrap ${column.cellClassName || ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                                            >
                                                {cellContent}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {showPagination && pagination && pagination.totalPages > 0 && (
                <TablePagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    total={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    startIndex={(pagination.currentPage - 1) * pagination.itemsPerPage}
                    loading={loading}
                    onPageChange={onPageChange}
                    itemLabel={itemLabel}
                    showItemCount={true}
                />
            )}
        </div>
    )
}

