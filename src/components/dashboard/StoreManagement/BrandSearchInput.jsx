"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Loader2, Plus } from 'lucide-react'
import { searchBrandStore, getBrandInfo } from '../../../apis/storageManagement'
import toast from 'react-hot-toast'

export default function BrandSearchInput({ 
    value, 
    onChange, 
    onBrandSelect,
    disabled = false,
    required = false
}) {
    const [searchValue, setSearchValue] = useState(value || '')
    const [brandList, setBrandList] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingAll, setIsLoadingAll] = useState(false)
    const [selectedBrandId, setSelectedBrandId] = useState(null)
    
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)

    // Load all brands when input is clicked/focused
    const loadAllBrands = async () => {
        setIsLoadingAll(true)
        try {
            const response = await searchBrandStore(1, 10, '') // Load 10 brands per page
            if (response.success) {
                setBrandList(response.data || [])
                setShowDropdown(true)
            } else {
                setBrandList([])
                toast.error(response.message || 'Fehler beim Laden der Marken')
            }
        } catch (error) {
            console.error('Error loading brands:', error)
            toast.error(error.message || 'Fehler beim Laden der Marken')
            setBrandList([])
        } finally {
            setIsLoadingAll(false)
        }
    }

    // Debounced search
    useEffect(() => {
        if (!searchValue.trim()) {
            // If empty, load all brands
            if (showDropdown) {
                loadAllBrands()
            }
            return
        }

        const searchTimeout = setTimeout(async () => {
            setIsSearching(true)
            try {
                const response = await searchBrandStore(1, 10, searchValue) // Search with 10 items per page
                if (response.success) {
                    setBrandList(response.data || [])
                    setShowDropdown(true)
                } else {
                    setBrandList([])
                    setShowDropdown(false)
                }
            } catch (error) {
                console.error('Error searching brands:', error)
                setBrandList([])
                setShowDropdown(false)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(searchTimeout)
    }, [searchValue])

    // Handle input click/focus - load all brands first
    const handleInputClick = () => {
        if (!showDropdown && !isLoadingAll) {
            loadAllBrands()
        } else {
            setShowDropdown(true)
        }
    }

    const handleInputFocus = () => {
        if (!showDropdown && !isLoadingAll) {
            loadAllBrands()
        } else {
            setShowDropdown(true)
        }
    }

    // Handle brand selection
    const handleBrandSelect = async (brand) => {
        setSearchValue(brand.brand)
        onChange(brand.brand)
        setSelectedBrandId(brand.id)
        setShowDropdown(false)
        
        // Focus back on input
        if (inputRef.current) {
            inputRef.current.focus()
        }
        
        // Load brand info and call callback
        if (onBrandSelect) {
            try {
                const response = await getBrandInfo(brand.id)
                if (response.success && response.data) {
                    onBrandSelect(response.data)
                }
            } catch (error) {
                console.error('Error loading brand info:', error)
                toast.error(error.message || 'Fehler beim Laden der Markeninformationen')
            }
        }
    }

    // Handle manual input
    const handleInputChange = (e) => {
        const newValue = e.target.value
        setSearchValue(newValue)
        onChange(newValue)
        setSelectedBrandId(null) // Clear selected brand when typing manually
        if (newValue.trim()) {
            setShowDropdown(true)
        } else {
            setShowDropdown(false)
        }
    }

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showDropdown])

    // Sync value prop
    useEffect(() => {
        if (value !== searchValue) {
            setSearchValue(value || '')
        }
    }, [value])

    return (
        <div className="space-y-2 relative">
            <Label htmlFor="brand">Hersteller</Label>
            <div className="relative" ref={dropdownRef}>
                <Input
                    ref={inputRef}
                    id="brand"
                    type="text"
                    placeholder="Hersteller eingeben oder auswählen"
                    value={searchValue}
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    className="w-full pr-10"
                    required={required}
                    disabled={disabled}
                    autoComplete="off"
                />
                {(isSearching || isLoadingAll) && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
                
                {showDropdown && (
                    <div 
                        className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                    >
                        {isLoadingAll ? (
                            <div className="px-4 py-8 text-center">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Marken werden geladen...</p>
                            </div>
                        ) : brandList.length > 0 ? (
                            <>
                                {brandList.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleBrandSelect(brand)
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleBrandSelect(brand)
                                        }}
                                    >
                                        <div className="text-sm font-medium text-gray-900">{brand.brand}</div>
                                    </div>
                                ))}
                                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                                    {brandList.length} Marke{brandList.length !== 1 ? 'n' : ''} gefunden
                                    {searchValue && ` für "${searchValue}"`}
                                </div>
                            </>
                        ) : searchValue ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-500 mb-2">Keine Marke gefunden</p>
                                <p className="text-xs text-gray-400">Sie können die Marke manuell eingeben</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            {searchValue && !selectedBrandId && (
                <p className="text-xs text-gray-500 mt-1">
                    💡 Sie können eine neue Marke manuell eingeben oder eine bestehende aus der Liste auswählen
                </p>
            )}
        </div>
    )
}

