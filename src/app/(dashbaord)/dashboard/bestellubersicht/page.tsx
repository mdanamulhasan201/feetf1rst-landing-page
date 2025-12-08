"use client"

import React, { useState } from 'react'
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
import ReusableTable from '../../../../components/shared/ReusableTable'
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
                <div className="flex flex-col gap-1.5 items-center">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 border-gray-200 w-full"
                        onClick={() => onStatusUpdate(orderId, 'Versendet', currentStatus)}
                        disabled={isConfirming || isCanceling}
                    >
                        {isConfirming ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-700 mr-1.5" />
                        ) : (
                            <Check className="h-4 w-4 text-gray-700 mr-1.5" />
                        )}
                        Bestätigen
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-100 cursor-pointer hover:bg-red-200 text-red-600 border-red-200 w-full"
                        onClick={() => onStatusUpdate(orderId, 'Storniert', currentStatus)}
                        disabled={isConfirming || isCanceling}
                    >
                        {isCanceling ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600 mr-1.5" />
                        ) : (
                            <X className="h-4 w-4 text-red-600 mr-1.5" />
                        )}
                        Stornieren
                    </Button>
                </div>
            )
        case 'sent': // Versendet
            const isMarkingDelivered = updatingActions.has(`${orderId}:Geliefert`);
            const isGoingBackFromSent = updatingActions.has(`${orderId}:In_bearbeitung`);
            return (
                <div className="flex flex-col gap-1.5 items-center">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-100 cursor-pointer hover:bg-blue-200 text-blue-600 border-blue-200 w-full"
                        onClick={() => onStatusUpdate(orderId, 'Geliefert', currentStatus)}
                        disabled={isMarkingDelivered || isGoingBackFromSent}
                    >
                        {isMarkingDelivered ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-1.5" />
                        ) : (
                            <Package className="h-4 w-4 text-blue-600 mr-1.5" />
                        )}
                        Als geliefert markieren
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 border-gray-200 w-full"
                        onClick={() => onStatusUpdate(orderId, 'In_bearbeitung', currentStatus)}
                        disabled={isMarkingDelivered || isGoingBackFromSent}
                    >
                        {isGoingBackFromSent ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-700 mr-1.5" />
                        ) : (
                            <ArrowLeft className="h-4 w-4 text-gray-700 mr-1.5" />
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
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 border-gray-200 w-full"
                    onClick={() => onStatusUpdate(orderId, 'In_bearbeitung', currentStatus)}
                    disabled={isGoingBackFromCanceled}
                >
                    {isGoingBackFromCanceled ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-700 mr-1.5" />
                    ) : (
                        <ArrowLeft className="h-4 w-4 text-gray-700 mr-1.5" />
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
            <ReusableTable
                    columns={[
                        {
                            header: 'Bestelldatum',
                            accessor: (order) => formatDate(order.createdAt),
                            width: '14.28%',
                            cellClassName: 'text-sm text-gray-600'
                        },
                        {
                            header: 'Partnername',
                            accessor: (order) => {
                                const partnerName = order.partner
                                    ? (order.partner.name || order.partner.busnessName || 'N/A')
                                    : 'N/A';
                                return (
                                    <span className="truncate block max-w-full" title={partnerName}>
                                        {partnerName}
                                    </span>
                                );
                            },
                            width: '14.28%'
                        },
                        {
                            header: 'Größe',
                            accessor: (order) => (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 inline-block">
                                    {order.size}
                                </Badge>
                            ),
                            width: '14.28%',
                            align: 'center'
                        },
                        {
                            header: 'Länge',
                            accessor: (order) => `${order.length} mm`,
                            width: '14.28%',
                            align: 'center'
                        },
                        {
                            header: 'Menge',
                            accessor: (order) => `${order.quantity} Stück`,
                            width: '14.28%',
                            align: 'center'
                        },
                        {
                            header: 'Status',
                            accessor: (order) => {
                                const statusInfo = mapStatus(order.status);
                                return getStatusBadge(statusInfo.display, statusInfo.type);
                            },
                            width: '14.28%',
                            align: 'center'
                        },
                        {
                            header: 'Aktionen',
                            accessor: (order) => {
                                const statusInfo = mapStatus(order.status);
                                return getActionButtons(statusInfo.type, order.id, order.status, openConfirmModal, updatingActions);
                            },
                            width: '14.32%'
                        }
                    ]}
                    data={orders}
                    loading={loading}
                    emptyMessage="Keine Bestellungen gefunden"
                    pagination={pagination}
                    onPageChange={goToPage}
                    itemLabel="Einträgen"
                    showPagination={true}
                    tableClassName=""
                    containerClassName=""
                />

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
