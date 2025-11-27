'use client';

import { Button } from '../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Eye, XCircle } from 'lucide-react';
import { calculateTotalPrice, formatCurrency, formatDateTime, getStatusBadge, getCustomerLabel } from './utils';

const OrdersTable = ({
    orders,
    onViewDetails,
    onCancel,
    cancellingOrderId
}) => {
    if (!orders?.length) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 text-center py-8 text-gray-500">
                <p>Keine Bestellungen gefunden</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                        {orders.map((order) => {
                            const totalPrice = formatCurrency(calculateTotalPrice(order));
                            const hasExtras = Boolean(order?.osen_einsetzen_price || order?.Passenden_schnursenkel_price);
                            const customerName = getCustomerLabel(order);
                            const category = order.maßschaft_kollektion?.catagoary || 'Massschaft';
                            const modelName = order.maßschaft_kollektion?.name || 'N/A';

                            return (
                                <TableRow key={order.id} className="hover:bg-gray-50">
                                    <TableCell className="font-mono text-sm font-medium">
                                        {order?.orderNumber || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {order.partner?.name || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {customerName}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                            {category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-gray-800">
                                            {modelName}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-gray-800">
                                            {totalPrice}
                                        </span>
                                        {hasExtras && (
                                            <p className="text-xs text-gray-500">
                                                inkl. Extras
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(order?.status)}
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-gray-600">
                                            {formatDateTime(order.createdAt)}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <Button
                                                size="sm"
                                                className="bg-[#00A63E] cursor-pointer hover:bg-[#00A63E]/40 text-white"
                                                onClick={() => onViewDetails(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 cursor-pointer text-red-600 hover:bg-red-50"
                                                disabled={cancellingOrderId === order.id}
                                                onClick={() => onCancel(order)}
                                            >
                                                <XCircle className="h-4 w-4" />
                                                {cancellingOrderId === order.id ? 'Abbrechen...' : 'Abbrechen'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default OrdersTable;

