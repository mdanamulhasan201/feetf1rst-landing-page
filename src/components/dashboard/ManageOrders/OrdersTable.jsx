'use client';

import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Eye, XCircle } from 'lucide-react';
import ReusableTable from '../../shared/ReusableTable';
import { calculateTotalPrice, formatCurrency, formatDateTime, getStatusBadge, getCustomerLabel } from './utils';

const OrdersTable = ({
    orders,
    loading = false,
    pagination = null,
    onViewDetails,
    onCancel,
    cancellingOrderId
}) => {
    return (
        <ReusableTable
            columns={[
                {
                    header: 'Bestellnummer',
                    accessor: (order) => order?.orderNumber || 'N/A',
                    width: '12%',
                    cellClassName: 'font-mono text-sm font-medium'
                },
                {
                    header: 'Partnergeschäft',
                    accessor: (order) => {
                        const customerName = getCustomerLabel(order);
                        return (
                            <div>
                                <p className="font-medium text-gray-800">
                                    {order.partner?.name || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {customerName}
                                </p>
                            </div>
                        );
                    },
                    width: '18%'
                },
                {
                    header: 'Kategorie',
                    accessor: (order) => {
                        const category = order.maßschaft_kollektion?.catagoary || 'Massschaft';
                        return (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {category}
                            </Badge>
                        );
                    },
                    width: '12%'
                },
                {
                    header: 'Modell',
                    accessor: (order) => {
                        const modelName = order.maßschaft_kollektion?.name || 'N/A';
                        return (
                            <p className="font-medium text-gray-800">
                                {modelName}
                            </p>
                        );
                    },
                    width: '15%'
                },
                {
                    header: 'Preis',
                    accessor: (order) => {
                        const totalPrice = formatCurrency(calculateTotalPrice(order));
                        const hasExtras = Boolean(order?.osen_einsetzen_price || order?.Passenden_schnursenkel_price);
                        return (
                            <>
                                <span className="font-semibold text-gray-800">
                                    {totalPrice}
                                </span>
                                {hasExtras && (
                                    <p className="text-xs text-gray-500">
                                        inkl. Extras
                                    </p>
                                )}
                            </>
                        );
                    },
                    width: '12%'
                },
                {
                    header: 'Status',
                    accessor: (order) => getStatusBadge(order?.status),
                    width: '12%'
                },
                {
                    header: 'Datum',
                    accessor: (order) => (
                        <p className="text-sm text-gray-600">
                            {formatDateTime(order.createdAt)}
                        </p>
                    ),
                    width: '12%'
                },
                {
                    header: 'Aktionen',
                    accessor: (order) => (
                        <div className="flex flex-col gap-1.5 items-center">
                            <Button
                                size="sm"
                                className="bg-[#00A63E] cursor-pointer hover:bg-[#00A63E]/40 text-white w-full"
                                onClick={() => onViewDetails(order)}
                            >
                                <Eye className="h-4 w-4 mr-1.5" />
                                Details
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 cursor-pointer text-red-600 hover:bg-red-50 w-full"
                                disabled={cancellingOrderId === order.id}
                                onClick={() => onCancel(order)}
                            >
                                <XCircle className="h-4 w-4 mr-1.5" />
                                {cancellingOrderId === order.id ? 'Abbrechen...' : 'Abbrechen'}
                            </Button>
                        </div>
                    ),
                    width: '7%'
                }
            ]}
            data={orders}
            loading={loading}
            emptyMessage="Keine Bestellungen gefunden"
            pagination={pagination}
            showPagination={false}
            containerClassName=""
        />
    );
};

export default OrdersTable;

