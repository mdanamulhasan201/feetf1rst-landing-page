"use client"

import React, { useState } from 'react'
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
import { Input } from '../../../../components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../../components/ui/dialog'
import { Check, X, Package, Search, Loader2, ArrowLeft } from 'lucide-react'
import { useOrders } from '../../../../hooks/useOrders'
import TablePagination from '../../../../components/shared/TablePagination'
import { updateOrderStatus } from '../../../../apis/bestellubersichtApis'
import toast from 'react-hot-toast'

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Map API status to display status and status type
const mapStatus = (status: string) => {
    const statusMap: { [key: string]: { display: string; type: string } } = {
        'In_bearbeitung': { display: 'In Bearbeitung', type: 'in_progress' },
        'Versendet': { display: 'Versendet', type: 'sent' },
        'Geliefert': { display: 'Geliefert', type: 'delivered' },
        'Storniert': { display: 'Storniert', type: 'canceled' },
    };

    return statusMap[status] || { display: status, type: 'in_progress' };
}

const getStatusBadge = (status: string, statusType: string) => {
    const baseClasses = "rounded-full px-3 py-1 text-xs font-medium"

    switch (statusType) {
        case 'in_progress':
            return (
                <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
                    {status}
                </Badge>
            )
        case 'sent':
            return (
                <Badge variant="secondary" className={`${baseClasses} bg-blue-100 text-blue-700`}>
                    {status}
                </Badge>
            )
        case 'canceled':
            return (
                <Badge variant="default" className={`${baseClasses} bg-red-100 text-red-700`}>
                    {status}
                </Badge>
            )
        case 'delivered':
            return (
                <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-700`}>
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

const getActionButtons = (
    statusType: string,
    orderId: string,
    currentStatus: string,
    onStatusUpdate: (id: string, newStatus: string, currentStatus: string) => void,
    updatingActions: Set<string>
) => {
    switch (statusType) {
        case 'in_progress': // In_bearbeitung
            const isConfirming = updatingActions.has(`${orderId}:Versendet`);
            const isCanceling = updatingActions.has(`${orderId}:Storniert`);
            return (
                <div className="flex gap-2 flex-wrap">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                        onClick={() => onStatusUpdate(orderId, 'Versendet', currentStatus)}
                        disabled={isConfirming || isCanceling}
                    >
                        {isConfirming ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                        ) : (
                            <Check className="h-4 w-4 text-gray-700" />
                        )}
                        Bestätigen
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
                        onClick={() => onStatusUpdate(orderId, 'Storniert', currentStatus)}
                        disabled={isConfirming || isCanceling}
                    >
                        {isCanceling ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                        ) : (
                            <X className="h-4 w-4 text-red-600" />
                        )}
                        Stornieren
                    </Button>
                </div>
            )
        case 'sent': // Versendet
            const isMarkingDelivered = updatingActions.has(`${orderId}:Geliefert`);
            const isGoingBackFromSent = updatingActions.has(`${orderId}:In_bearbeitung`);
            return (
                <div className="flex gap-2 flex-wrap">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-200"
                        onClick={() => onStatusUpdate(orderId, 'Geliefert', currentStatus)}
                        disabled={isMarkingDelivered || isGoingBackFromSent}
                    >
                        {isMarkingDelivered ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        ) : (
                            <Package className="h-4 w-4 text-blue-600" />
                        )}
                        Als geliefert markieren
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                        onClick={() => onStatusUpdate(orderId, 'In_bearbeitung', currentStatus)}
                        disabled={isMarkingDelivered || isGoingBackFromSent}
                    >
                        {isGoingBackFromSent ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                        ) : (
                            <ArrowLeft className="h-4 w-4 text-gray-700" />
                        )}
                        Zurück
                    </Button>
                </div>
            )
        case 'canceled': // Storniert
            const isGoingBackFromCanceled = updatingActions.has(`${orderId}:In_bearbeitung`);
            return (
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                    onClick={() => onStatusUpdate(orderId, 'In_bearbeitung', currentStatus)}
                    disabled={isGoingBackFromCanceled}
                >
                    {isGoingBackFromCanceled ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                    ) : (
                        <ArrowLeft className="h-4 w-4 text-gray-700" />
                    )}
                    Zurück
                </Button>
            )
        case 'delivered': // Geliefert - Final status, no actions
            return (
                <span className="text-sm text-gray-400 italic">Abgeschlossen</span>
            )
        default:
            return null
    }
}

export default function Bestellubersicht() {
    const {
        orders,
        loading,
        error,
        pagination,
        page,
        limit,
        search,
        setSearch,
        setLimit,
        goToPage,
        nextPage,
        prevPage,
        refreshOrders,
        updateOrderStatusOptimistically,
        rollbackOrderStatus
    } = useOrders(1, 10);

    const [updatingActions, setUpdatingActions] = useState<Set<string>>(new Set());
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{ orderId: string; newStatus: string; currentStatus: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const openConfirmModal = (orderId: string, newStatus: string, currentStatus: string) => {
        setPendingUpdate({ orderId, newStatus, currentStatus });
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
        setPendingUpdate(null);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        const actionKey = `${orderId}:${newStatus}`;

        // Find the current order to get old status for rollback
        const currentOrder = orders.find(order => order.id === orderId);
        const oldStatus = currentOrder?.status;

        if (!oldStatus) {
            toast.error('Bestellung nicht gefunden');
            return;
        }

        try {
            setUpdatingActions(prev => new Set(prev).add(actionKey));

            // Optimistic update - update UI immediately
            updateOrderStatusOptimistically(orderId, newStatus);

            // Make API call in background
            const response = await updateOrderStatus([orderId], newStatus);

            if (response && response.success) {
                toast.success(`Status erfolgreich auf "${mapStatus(newStatus).display}" geändert`);
                // No background refresh - optimistic update is enough
                // The status is already updated in the UI
            } else {
                throw new Error('Status update failed');
            }
        } catch (error: any) {
            console.error('Failed to update status:', error);
            // Rollback optimistic update on error
            rollbackOrderStatus(orderId, oldStatus);
            toast.error(error.message || 'Status konnte nicht aktualisiert werden');
        } finally {
            setUpdatingActions(prev => {
                const newSet = new Set(prev);
                newSet.delete(actionKey);
                return newSet;
            });
        }
    };

    const confirmStatusUpdate = async () => {
        if (!pendingUpdate || isProcessing) return;

        const { orderId, newStatus } = pendingUpdate;

        setIsProcessing(true);

        // Keep modal open to show loading in modal button
        // Start the update process
        await handleStatusUpdate(orderId, newStatus);

        // Close modal after update completes
        closeConfirmModal();
        setIsProcessing(false);
    };


    return (
        <div className="p-6 w-full">
            <div className="mb-6 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Bestellübersicht
                </h1>
                <p className="text-gray-500">
                    Verwalten Sie alle eingehenden und automatischen Bestellungen
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Suchen nach Partner, Produkt..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-600">Laden...</span>
                    </div>
                ) : (
                    <>
                        <Table className="w-full">
                            <TableHeader className="w-full">
                                <TableRow className="bg-gray-50 w-full">
                                    <TableHead className="font-semibold text-gray-700 min-w-[150px]">Bestelldatum</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[180px]">Partnername</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Größe</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Länge</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Menge</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-700 min-w-[200px]">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {orders.length === 0 ? (
                                    <TableRow className="">
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Keine Bestellungen gefunden
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => {
                                        const statusInfo = mapStatus(order.status);
                                        // Get partner name - prioritize name field, then busnessName
                                        const partnerName = order.partner
                                            ? (order.partner.name || order.partner.busnessName || 'N/A')
                                            : 'N/A';

                                        // Debug: uncomment to check partner data
                                        // console.log('Order partner:', order.partner, 'Partner name:', partnerName);

                                        return (
                                            <TableRow key={order.id} className="hover:bg-gray-50 w-full">
                                                <TableCell className="text-sm text-gray-600 min-w-[150px]">
                                                    {formatDate(order.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-gray-700 min-w-[180px]">
                                                    {partnerName}
                                                </TableCell>
                                                <TableCell className="min-w-[100px]">
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                                                        {order.size}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-700 min-w-[100px]">
                                                    {order.length} mm
                                                </TableCell>
                                                <TableCell className="text-gray-700 min-w-[100px]">
                                                    {order.quantity} Stück
                                                </TableCell>
                                                <TableCell className="min-w-[120px]">
                                                    {getStatusBadge(statusInfo.display, statusInfo.type)}
                                                </TableCell>
                                                <TableCell className="min-w-[200px]">
                                                    {getActionButtons(statusInfo.type, order.id, order.status, openConfirmModal, updatingActions)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {pagination.totalPages > 0 && (
                            <TablePagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                total={pagination.totalItems}
                                itemsPerPage={pagination.itemsPerPage}
                                startIndex={(pagination.currentPage - 1) * pagination.itemsPerPage}
                                loading={loading}
                                onPageChange={goToPage}
                                itemLabel="Einträgen"
                                showItemCount={true}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Status Update Confirmation Modal */}
            <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="">
                        <DialogTitle className="">Status ändern bestätigen</DialogTitle>
                        <DialogDescription className="">
                            {pendingUpdate && (
                                <>
                                    Möchten Sie den Status wirklich von <strong>"{mapStatus(pendingUpdate.currentStatus).display}"</strong> auf <strong>"{mapStatus(pendingUpdate.newStatus).display}"</strong> ändern?
                                    {pendingUpdate.newStatus === 'Geliefert' && (
                                        <span className="block mt-2 text-amber-600 font-medium">
                                            Hinweis: Dieser Status kann nicht rückgängig gemacht werden.
                                        </span>
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button
                            variant="outline"
                            size="default"
                            className="cursor-pointer"
                            onClick={closeConfirmModal}
                            disabled={isProcessing || (pendingUpdate ? updatingActions.has(`${pendingUpdate.orderId}:${pendingUpdate.newStatus}`) : false)}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            variant="default"
                            size="default"
                            onClick={confirmStatusUpdate}
                            disabled={isProcessing || (pendingUpdate ? updatingActions.has(`${pendingUpdate.orderId}:${pendingUpdate.newStatus}`) : false)}
                            className="bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(isProcessing || (pendingUpdate && updatingActions.has(`${pendingUpdate.orderId}:${pendingUpdate.newStatus}`))) ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Wird verarbeitet...
                                </>
                            ) : (
                                'Bestätigen'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
