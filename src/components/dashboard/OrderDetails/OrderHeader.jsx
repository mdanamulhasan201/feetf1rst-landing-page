import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';
import InvoiceGenerator from '../Invoice/InvoiceGenerator';
import { formatDateTime } from './utils';

const OrderHeader = ({ order, onBack }) => {
    if (!order) return null;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between gap-2 w-full">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="mb-4 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück zur Übersicht
                </Button>
                <InvoiceGenerator order={order} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">
                Bestelldetails #{order?.orderNumber || order.id}
            </h1>
            <p className="text-gray-500 mt-2">
                Erstellt am {formatDateTime(order.createdAt)}
            </p>
        </div>
    );
};

export default OrderHeader;

