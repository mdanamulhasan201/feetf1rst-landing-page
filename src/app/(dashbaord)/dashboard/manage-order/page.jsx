'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllOrder, deleteSingleOrder } from '../../../../apis/productsCreate';
import { Button } from '../../../../components/ui/button';
import { useDebounce } from '../../../../hooks/useDebounce';
import ManageOrderHeader from '../../../../components/dashboard/ManageOrders/ManageOrderHeader';
import ManageOrderFilters from '../../../../components/dashboard/ManageOrders/ManageOrderFilters';
import OrdersTable from '../../../../components/dashboard/ManageOrders/OrdersTable';
import ManageOrderPagination from '../../../../components/dashboard/ManageOrders/ManageOrderPagination';
import CancelOrderDialog from '../../../../components/dashboard/ManageOrders/CancelOrderDialog';

export default function ManageOrder() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pagination, setPagination] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const limit = 10;

    // Debounce search term with 500ms delay
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Function to update URL parameters
    const updateURL = (search, page) => {
        const params = new URLSearchParams();
        if (search && search.trim() !== '') {
            params.set('search', search.trim());
        }
        if (page && page > 1) {
            params.set('page', page.toString());
        }

        const newURL = params.toString() ? `?${params.toString()}` : '';
        router.replace(`/dashboard/manage-order${newURL}`, { scroll: false });
    };

    const fetchOrders = async (page = 1, search = '', status = '') => {
        try {
            // Show search loading only if it's a search operation (not initial load)
            if (search && search !== '') {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const response = await getAllOrder(page, limit, search, status);
            setOrders(response.data || []);
            setPagination(response.pagination || {});
            setTotalPages(response.pagination?.totalPages || 1);
            setTotalItems(response.pagination?.totalItems || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, debouncedSearchTerm, selectedStatus === 'all' ? '' : selectedStatus);
        updateURL(debouncedSearchTerm, currentPage);
    }, [currentPage, debouncedSearchTerm, selectedStatus]);

    // Reset to first page when search term or status changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm !== '') {
            setCurrentPage(1);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus]);

    // Handle URL changes on page load
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlPage = parseInt(searchParams.get('page')) || 1;

        if (urlSearch !== searchTerm) {
            setSearchTerm(urlSearch);
        }
        if (urlPage !== currentPage) {
            setCurrentPage(urlPage);
        }
    }, [searchParams]);

    // Search is now handled automatically by debounced useEffect

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (order) => {
        router.push(`/dashboard/manage-order/details/${order.id}`);
    };

    const openCancelModal = (order) => {
        if (cancellingOrderId) return;
        setOrderToCancel(order);
        setCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        if (cancellingOrderId) return;
        setOrderToCancel(null);
        setCancelModalOpen(false);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;

        try {
            setCancellingOrderId(orderToCancel.id);
            await deleteSingleOrder(orderToCancel.id);

            const deletedOrderId = orderToCancel.id;
            const isLastItemOnPage = orders.length === 1;
            const updatedTotalItems = Math.max((pagination?.totalItems ?? totalItems) - 1, 0);
            const updatedTotalPages = Math.max(Math.ceil(updatedTotalItems / limit), 1);

            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== deletedOrderId));

            if (isLastItemOnPage && currentPage > 1) {
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
            }

            setTotalItems(updatedTotalItems);
            setPagination((prevPagination) =>
                prevPagination
                    ? {
                        ...prevPagination,
                        totalItems: updatedTotalItems,
                        totalPages: updatedTotalPages
                    }
                    : prevPagination
            );
            setTotalPages(updatedTotalPages);

            setCancelModalOpen(false);
            setOrderToCancel(null);
        } catch (err) {
            window.alert(err.message || 'Fehler beim Stornieren der Bestellung.');
        } finally {
            setCancellingOrderId(null);
        }
    };

    if (error) {
        return (
            <div className="p-6 h- flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error loading orders: {error}</p>
                    <Button onClick={() => {
                        setError(null);
                        fetchOrders(currentPage, debouncedSearchTerm);
                    }} className="mt-4 cursor-pointer">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6">
                <ManageOrderHeader />

                <ManageOrderFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchLoading={searchLoading}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    totalItems={totalItems}
                />

                <OrdersTable
                    orders={orders}
                    loading={loading}
                    pagination={pagination}
                    onViewDetails={handleViewDetails}
                    onCancel={openCancelModal}
                    cancellingOrderId={cancellingOrderId}
                />

                <ManageOrderPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <CancelOrderDialog
                open={cancelModalOpen}
                onOpenChange={(open) => (open ? setCancelModalOpen(true) : closeCancelModal())}
                orderToCancel={orderToCancel}
                onCancel={confirmCancelOrder}
                onClose={closeCancelModal}
                cancellingOrderId={cancellingOrderId}
            />
        </>
    );
}
