import { Badge } from '../../ui/badge';

export const formatCurrency = (value, currency = 'EUR') => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return '0,00 €';
    }

    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency
    }).format(numeric);
};

export const formatDateTime = (value) => {
    if (!value) return '–';
    return new Date(value).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const statusConfig = {
    'Neu': { className: 'bg-blue-100 text-blue-800', label: 'Neu' },
    'Zu_Produzent_abgeschickt': { className: 'bg-yellow-100 text-yellow-800', label: 'Zu Produzent abgeschickt' },
    'In_Bearbeitung': { className: 'bg-orange-100 text-orange-800', label: 'In Bearbeitung' },
    'Zu_Kunde_abgeschickt': { className: 'bg-purple-100 text-purple-800', label: 'Zu Kunde abgeschickt' },
    'Bei_uns_angekommen': { className: 'bg-green-100 text-green-800', label: 'Bei uns angekommen' },
    'Beim_Kunden_angekommen': { className: 'bg-emerald-100 text-emerald-800', label: 'Beim Kunden angekommen' }
};

export const getStatusBadge = (status = 'Neu') => {
    const config = statusConfig[status] || statusConfig['Neu'];
    return <Badge className={config.className}>{config.label}</Badge>;
};

export const calculateTotalPrice = (order) => {
    const basePrice = Number(order?.maßschaft_kollektion?.price) || 0;
    const osenPrice = Number(order?.osen_einsetzen_price) || 0;
    const lacePrice = Number(order?.Passenden_schnursenkel_price) || 0;
    return basePrice + osenPrice + lacePrice;
};

export const getCustomerLabel = (order) => {
    if (order?.customer) {
        const { vorname, nachname } = order.customer;
        const fullName = `${vorname || ''} ${nachname || ''}`.trim();
        if (fullName) return fullName;
    }
    return order?.other_customer_number || 'N/A';
};

