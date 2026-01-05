"use client"

import React from 'react'
import { Button } from "../../ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ pagination, onPageChange, isLoading }) {
    if (pagination.totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
                Seite {pagination.currentPage} von {pagination.totalPages} ({pagination.totalItems} Produkte)
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Zurück
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || isLoading}
                >
                    Weiter
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

