"use client"

import React from 'react'
import { Input } from "../../ui/input"
import { Search, X } from 'lucide-react'

export default function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Suchen nach Produktname, Hersteller, Artikelnummer..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 w-80"
            />
            {searchTerm && (
                <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}

