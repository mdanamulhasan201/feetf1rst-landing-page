'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllOrder } from '../../../../apis/productsCreate';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../../../../components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useDebounce } from '../../../../hooks/useDebounce';
import { Eye, Search, Download } from 'lucide-react';

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

    const fetchOrders = async (page = 1, search = '') => {
        try {
            // Show search loading only if it's a search operation (not initial load)
            if (search && search !== '') {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }

            const response = await getAllOrder(page, limit, search);
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
        fetchOrders(currentPage, debouncedSearchTerm);
        updateURL(debouncedSearchTerm, currentPage);
    }, [currentPage, debouncedSearchTerm]);

    // Reset to first page when search term changes
    useEffect(() => {
        if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm !== '') {
            setCurrentPage(1);
        }
    }, [debouncedSearchTerm]);

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (order) => {
        // Use actual order status from API response
        // Since your API doesn't have status field, we'll show "Neu" as default
        // You can add status field to your API response if needed
        return <Badge className="bg-blue-100 text-blue-800">Neu</Badge>;
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

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
        <div className="p-6">
            <div className="mb-8">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">Alle Bestellungen</h1>
                    <p className="text-gray-500 mt-2 text-base">
                        Verwalten Sie alle Bestellungen Ihrer Partnergeschäfte an einem Ort
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        {searchLoading && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                        <Input
                            type="text"
                            placeholder="Suche nach Bestellnummer, Partnergeschäft oder Modell..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-12 pr-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${searchLoading ? 'bg-blue-50' : ''
                                }`}
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex gap-3">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Alle Kategorien" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Kategorien</SelectItem>
                                <SelectItem value="massschaft">Massschaft</SelectItem>
                                <SelectItem value="shoes">Schuhe</SelectItem>
                                <SelectItem value="ski">Ski</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-48 h-12 border-blue-500 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Alle Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Status</SelectItem>
                                <SelectItem value="neu">Neu</SelectItem>
                                <SelectItem value="in_production">In Produktion</SelectItem>
                                <SelectItem value="sent_to_producer">Zu Produzent abgeschickt</SelectItem>
                                <SelectItem value="completed">Abgeschlossen</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Order Count */}
                <div className="mt-4">
                    <p className="text-gray-600 text-sm">
                        {totalItems} Bestellungen insgesamt
                        {searchTerm && (
                            <span className="ml-2 text-blue-600">
                                (Suche nach: "{searchTerm}")
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Keine Bestellungen gefunden</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">Bestellnummer</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Partnergeschäft</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Kategorie</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Modell</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Preis</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Datum</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Aktionen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50">
                                        <TableCell className="font-mono text-sm font-medium">
                                            {order?.orderNumber || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {order.partner?.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.customer?.vorname} {order.customer?.nachname}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                {order.maßschaft_kollektion?.catagoary || 'Massschaft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-gray-800">
                                                {order.maßschaft_kollektion?.name}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-gray-800">
                                                {order.maßschaft_kollektion?.price} €
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order)}
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) {
                                            handlePageChange(currentPage - 1);
                                        }
                                    }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber;
                                if (totalPages <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(pageNumber);
                                            }}
                                            isActive={currentPage === pageNumber}
                                            className="cursor-pointer"
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) {
                                            handlePageChange(currentPage + 1);
                                        }
                                    }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

        </div>
    );
}
