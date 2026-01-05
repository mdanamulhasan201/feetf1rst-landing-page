"use client"

import React, { useState, useEffect } from 'react'
import { X, Package, User, Calendar, Hash, MapPin, Building2, Phone, Mail, Euro } from 'lucide-react'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { getOrderHistory, getTotalPrice } from '../../../apis/storageManagement'

export default function HistorySidebar({ isOpen, onClose }) {
    const [historyData, setHistoryData] = useState([])
    const [totalPrice, setTotalPrice] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            fetchHistory()
            fetchTotalPrice()
        }
    }, [isOpen])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await getOrderHistory()
            if (result.success) {
                setHistoryData(result.data || [])
            } else {
                setError(result.message || 'Failed to fetch history')
            }
        } catch (err) {
            setError(err.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTotalPrice = async () => {
        try {
            const result = await getTotalPrice()
            if (result.success) {
                setTotalPrice(result.data)
            }
        } catch (err) {
            console.error('Failed to fetch total price:', err)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTotalQuantity = (groessenMengen) => {
        if (!groessenMengen) return 0
        return Object.values(groessenMengen).reduce((sum, item) => sum + (item.quantity || 0), 0)
    }

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Bestellhistorie</h2>
                        <p className="text-sm text-gray-500 mt-1">Alle Lagerbestände und Bestellungen</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Total Price Card */}
                    {totalPrice !== null && (
                        <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-600 p-3 rounded-full">
                                            <Euro className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Gesamtpreis</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                                €{totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Lade Historie...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={fetchHistory} variant="outline">
                                Erneut versuchen
                            </Button>
                        </div>
                    ) : historyData.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Keine Historie gefunden</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {historyData.map((item) => (
                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2 flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-green-600" />
                                                    {item.produktname || 'Unbenanntes Produkt'}
                                                </CardTitle>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {item.hersteller && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Building2 className="h-3 w-3 mr-1" />
                                                            {item.hersteller}
                                                        </Badge>
                                                    )}
                                                    {item.artikelnummer && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Hash className="h-3 w-3 mr-1" />
                                                            {item.artikelnummer}
                                                        </Badge>
                                                    )}
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        {getTotalQuantity(item.groessenMengen)} Stück
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Partner Information */}
                                        {item.partner && (
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                    <h4 className="font-semibold text-sm text-gray-700">Partner Information</h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-600">Name:</span>
                                                        <span className="text-gray-800">{item.partner.name}</span>
                                                    </div>
                                                    {item.partner.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-gray-500" />
                                                            <span className="text-gray-800">{item.partner.email}</span>
                                                        </div>
                                                    )}
                                                    {item.partner.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-500" />
                                                            <span className="text-gray-800">{item.partner.phone}</span>
                                                        </div>
                                                    )}
                                                    {item.partner.image && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={item.partner.image}
                                                                alt={item.partner.name}
                                                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Size and Quantity Details */}
                                        {item.groessenMengen && Object.keys(item.groessenMengen).length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Größen & Mengen
                                                </h4>
                                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                                                    {Object.entries(item.groessenMengen).map(([size, data]) => (
                                                        <div
                                                            key={size}
                                                            className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center"
                                                        >
                                                            <div className="text-xs font-semibold text-blue-900 mb-1">
                                                                Größe {size}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                <div>Menge: <span className="font-semibold">{data.quantity || 0}</span></div>
                                                                {data.length && (
                                                                    <div className="mt-1">Länge: <span className="font-semibold">{data.length}</span></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                                            {item.lagerort && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-600">Lagerort:</span>
                                                    <span className="font-medium text-gray-800">{item.lagerort}</span>
                                                </div>
                                            )}
                                            {item.mindestbestand !== null && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Package className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-600">Mindestbestand:</span>
                                                    <span className="font-medium text-gray-800">{item.mindestbestand}</span>
                                                </div>
                                            )}
                                            {item.price !== null && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-600">Preis:</span>
                                                    <span className="font-medium text-gray-800">€{item.price}</span>
                                                </div>
                                            )}
                                            {item.parcessAt && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-600">Verarbeitet am:</span>
                                                    <span className="font-medium text-gray-800">{formatDate(item.parcessAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

