import { useState, useEffect } from 'react';
import { getAllOrders } from '../apis/bestellubersichtApis';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for fetching orders with pagination and search
 * @param {number} initialPage
 * @param {number} initialLimit
 * @returns {object} 
 */
export const useOrders = (initialPage = 1, initialLimit = 10) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Debounce search input to avoid too many API calls
    const debouncedSearch = useDebounce(search, 500);

    // Reset to page 1 when search changes
    useEffect(() => {
        if (debouncedSearch !== search && page !== 1) {
            setPage(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    useEffect(() => {
        let isCancelled = false;

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await getAllOrders(page, limit, debouncedSearch);
                
                // Only update state if component is still mounted and not cancelled
                if (!isCancelled) {
                    if (response && response.data) {
                        setOrders(response.data);
                        if (response.pagination) {
                            setPagination(response.pagination);
                        }
                    } else {
                        setOrders([]);
                    }
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(err.message);
                    setOrders([]);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchOrders();

        // Cleanup function to prevent state updates if component unmounts or dependencies change
        return () => {
            isCancelled = true;
        };
    }, [page, limit, debouncedSearch]);

    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    const nextPage = () => {
        if (pagination.hasNextPage) {
            setPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (pagination.hasPrevPage) {
            setPage(prev => prev - 1);
        }
    };

    const refreshOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllOrders(page, limit, debouncedSearch);
            if (response && response.data) {
                setOrders(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                setOrders([]);
            }
        } catch (err) {
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Optimistic update function - updates local state immediately
    const updateOrderStatusOptimistically = (orderId, newStatus) => {
        setOrders(prevOrders => {
            return prevOrders.map(order => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: newStatus
                    };
                }
                return order;
            });
        });
    };

    // Rollback function if API call fails
    const rollbackOrderStatus = (orderId, oldStatus) => {
        setOrders(prevOrders => {
            return prevOrders.map(order => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: oldStatus
                    };
                }
                return order;
            });
        });
    };

    return {
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
    };
};

export default useOrders;

