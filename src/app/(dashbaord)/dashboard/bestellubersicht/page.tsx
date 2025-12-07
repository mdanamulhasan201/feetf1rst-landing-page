"use client"

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../../components/ui/table'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Check, X, Package } from 'lucide-react'

// Sample data based on the image
const ordersData = [
    {
        id: 1,
        orderDate: '14.11.2025 13:50',
        partnerName: 'Partner Shop 1',
        product: 'Kinder-Einlage Soft',
        manufacturer: 'Orthotech',
        size: 36,
        quantity: 12,
        status: 'Ausstehend',
        statusType: 'pending'
    },
    {
        id: 2,
        orderDate: '14.11.2025 12:50',
        partnerName: 'Partner Shop 2',
        product: 'Sport-Einlage Premium',
        manufacturer: 'Spannrit',
        size: 42,
        quantity: 25,
        status: 'Storniert',
        statusType: 'canceled'
    },
    {
        id: 3,
        orderDate: '14.11.2025 10:50',
        partnerName: 'Partner Shop 1',
        product: 'Orthopädische Einlage Komfort',
        manufacturer: 'Orthotech',
        size: 39,
        quantity: 15,
        status: 'Ausstehend',
        statusType: 'pending'
    },
    {
        id: 4,
        orderDate: '13.11.2025 14:50',
        partnerName: 'Partner Shop 3',
        product: 'Sport-Einlage Premium',
        manufacturer: 'Spannrit',
        size: 44,
        quantity: 30,
        status: 'Bestätigt',
        statusType: 'confirmed'
    },
    {
        id: 5,
        orderDate: '12.11.2025 14:50',
        partnerName: 'Partner Shop 2',
        product: 'Diabetes-Einlage Spezial',
        manufacturer: 'Spannrit',
        size: 38,
        quantity: 20,
        status: 'Bestätigt',
        statusType: 'confirmed'
    },
    {
        id: 6,
        orderDate: '11.11.2025 14:50',
        partnerName: 'Partner Shop 4',
        product: 'Sport-Einlage Premium',
        manufacturer: 'Spannrit',
        size: 43,
        quantity: 18,
        status: 'Storniert',
        statusType: 'canceled'
    },
    {
        id: 7,
        orderDate: '09.11.2025 14:50',
        partnerName: 'Partner Shop 1',
        product: 'Orthopädische Einlage Komfort',
        manufacturer: 'Orthotech',
        size: 41,
        quantity: 10,
        status: 'Geliefert',
        statusType: 'delivered'
    }
]

const getStatusBadge = (status: string, statusType: string) => {
    const baseClasses = "rounded-full px-3 py-1 text-xs font-medium"
    
    switch (statusType) {
        case 'pending':
            return (
                <Badge variant="secondary" className={`${baseClasses} bg-gray-100 text-gray-700`}>
                    {status}
                </Badge>
            )
        case 'canceled':
            return (
                <Badge variant="default" className={`${baseClasses} bg-red-100 text-red-700`}>
                    {status}
                </Badge>
            )
        case 'confirmed':
            return (
                <Badge variant="secondary" className={`${baseClasses} bg-gray-100 text-gray-700`}>
                    {status}
                </Badge>
            )
        case 'delivered':
            return (
                <Badge variant="default" className={`${baseClasses} bg-blue-100 text-blue-700`}>
                    {status}
                </Badge>
            )
        default:
            return (
                <Badge variant="secondary" className={baseClasses}>
                    {status}
                </Badge>
            )
    }
}

const getActionButtons = (statusType: string, orderId: number) => {
    switch (statusType) {
        case 'pending':
            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                        onClick={() => handleConfirm(orderId)}
                    >
                        <Check className="h-4 w-4 text-gray-700" />
                        Bestätigen
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
                        onClick={() => handleCancel(orderId)}
                    >
                        <X className="h-4 w-4 text-red-600" />
                        Stornieren
                    </Button>
                </div>
            )
        case 'confirmed':
            return (
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-200"
                    onClick={() => handleMarkDelivered(orderId)}
                >
                    <Package className="h-4 w-4 text-blue-600" />
                    Als geliefert markieren
                </Button>
            )
        case 'canceled':
        case 'delivered':
        default:
            return null
    }
}

const handleConfirm = (orderId: number) => {
    console.log('Confirm order:', orderId)
    // Add your confirmation logic here
}

const handleCancel = (orderId: number) => {
    console.log('Cancel order:', orderId)
    // Add your cancellation logic here
}

const handleMarkDelivered = (orderId: number) => {
    console.log('Mark as delivered:', orderId)
    // Add your delivery logic here
}

export default function Bestellubersicht() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Bestellübersicht
                </h1>
                <p className="text-gray-500">
                    Verwalten Sie alle eingehenden und automatischen Bestellungen
                </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="">
                        <TableHeader className="">
                            <TableRow className="bg-gray-50">
                                <TableHead className="font-semibold text-gray-700">Bestelldatum</TableHead>
                                <TableHead className="font-semibold text-gray-700">Partnername</TableHead>
                                <TableHead className="font-semibold text-gray-700">Produkt</TableHead>
                                <TableHead className="font-semibold text-gray-700">Hersteller</TableHead>
                                <TableHead className="font-semibold text-gray-700">Größe</TableHead>
                                <TableHead className="font-semibold text-gray-700">Menge</TableHead>
                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                <TableHead className="font-semibold text-gray-700">Aktionen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {ordersData.map((order) => (
                                <TableRow key={order.id} className="hover:bg-gray-50">
                                    <TableCell className="text-sm text-gray-600">
                                        {order.orderDate}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {order.partnerName}
                                    </TableCell>
                                    <TableCell className="text-gray-800">
                                        {order.product}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {order.manufacturer}
                                    </TableCell>
                                    <TableCell className="">
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                                            {order.size}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {order.quantity} Stück
                                    </TableCell>
                                    <TableCell className="">
                                        {getStatusBadge(order.status, order.statusType)}
                                    </TableCell>
                                    <TableCell className="">
                                        {getActionButtons(order.statusType, order.id)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
