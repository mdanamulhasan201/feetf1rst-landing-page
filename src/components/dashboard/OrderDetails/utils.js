export const formatCurrencyValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
        return null;
    }
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(numericValue);
};

export const parseListField = (value) => {
    if (!value) {
        return [];
    }
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

export const getDisplayText = (value, fallback = 'Nicht angegeben') => {
    if (value === null || value === undefined || value === '' || value === 'default') {
        return fallback;
    }
    return value;
};

export const formatDateTime = (dateString) => {
    if (!dateString) {
        return '–';
    }
    return new Date(dateString).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

