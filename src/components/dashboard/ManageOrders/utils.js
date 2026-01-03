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
    'Bestellung_eingegangen': { className: 'bg-blue-100 text-blue-800', label: 'Bestellung eingegangen' },
    'In_Produktion': { className: 'bg-yellow-100 text-yellow-800', label: 'In Produktion' },
    'Qualitätskontrolle': { className: 'bg-orange-100 text-orange-800', label: 'Qualitätskontrolle' },
    'Versandt': { className: 'bg-purple-100 text-purple-800', label: 'Versandt' },
    'Ausgeführt': { className: 'bg-green-100 text-green-800', label: 'Ausgeführt' }
};

export const getStatusBadge = (status = 'Bestellung_eingegangen') => {
    const config = statusConfig[status] || statusConfig['Bestellung_eingegangen'];
    return <Badge className={config.className}>{config.label}</Badge>;
};

export const calculateTotalPrice = (order) => {
    // If totalPrice exists directly (for Halbprobenerstellung and Bodenkonstruktion), use it
    if (order?.totalPrice !== null && order?.totalPrice !== undefined) {
        const directPrice = Number(order.totalPrice) || 0;
        if (directPrice > 0) {
            return directPrice;
        }
    }
    
    // Otherwise calculate from maßschaft_kollektion (for Massschafterstellung)
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

