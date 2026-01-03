'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, statusChangeInOrder } from '../../../../../../apis/productsCreate';
import { Button } from '../../../../../../components/ui/button';
import toast from 'react-hot-toast';
import OrderHeader from '../../../../../../components/dashboard/OrderDetails/OrderHeader';
import OrderCustomizationCard from '../../../../../../components/dashboard/OrderDetails/OrderCustomizationCard';
import OrderBodenkonstruktionCard from '../../../../../../components/dashboard/OrderDetails/OrderBodenkonstruktionCard';
import OrderHalbprobenerstellungCard from '../../../../../../components/dashboard/OrderDetails/OrderHalbprobenerstellungCard';
import OrderContactCard from '../../../../../../components/dashboard/OrderDetails/OrderContactCard';
import OrderPriceSummaryCard from '../../../../../../components/dashboard/OrderDetails/OrderPriceSummaryCard';
import OrderStatusCard from '../../../../../../components/dashboard/OrderDetails/OrderStatusCard';
import OrderDetailsSkeleton from '../../../../../../components/dashboard/OrderDetails/OrderDetailsSkeleton';
import { formatCurrencyValue, parseListField, getDisplayText } from '../../../../../../components/dashboard/OrderDetails/utils';

export default function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('Bestellung_eingegangen');

    const [statusError, setStatusError] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Status workflow configuration - using valid statuses from API
    const statusWorkflow = [
        { key: 'Bestellung_eingegangen', label: 'Bestellung eingegangen' },
        { key: 'In_Produktiony', label: 'In Produktion' },
        { key: 'Qualitätskontrolle', label: 'Qualitätskontrolle' },
        { key: 'Versandt', label: 'Versandt' },
        { key: 'Ausgeführt', label: 'Ausgeführt' }
    ];

    const getCurrentStatusIndex = () => {
        return statusWorkflow.findIndex(status => status.key === currentStatus);
    };

    const getNextStatus = () => {
        const currentIndex = getCurrentStatusIndex();
        return currentIndex < statusWorkflow.length - 1 ? statusWorkflow[currentIndex + 1] : null;
    };

    const getPreviousStatus = () => {
        const currentIndex = getCurrentStatusIndex();
        return currentIndex > 0 ? statusWorkflow[currentIndex - 1] : null;
    };

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await getOrderById(orderId);
            if (response && response.data) {
                setOrder(response.data);
                // Set initial status from order data
                setCurrentStatus(response.data.status || 'Bestellung_eingegangen');
            } else {
                setError('Order not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const handleStatusChange = async (newStatus) => {
        try {
            setIsUpdatingStatus(true);
            setStatusError(null);

            // Get all status keys from workflow
            const allStatuses = statusWorkflow.map(status => status.key);
            
            const response = await statusChangeInOrder(orderId, newStatus, allStatuses);

            if (response.success) {
                setCurrentStatus(newStatus);
                // Update the order data with new status
                setOrder(prev => ({ ...prev, status: newStatus }));
                toast.success('Status erfolgreich aktualisiert!');
            } else {
                const errorMsg = response.message || 'Failed to update status';
                setStatusError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = err.message || 'Error updating status';
            setStatusError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleNextStep = async () => {
        const nextStatus = getNextStatus();
        if (nextStatus) {
            await handleStatusChange(nextStatus.key);
        }
    };

    const handlePreviousStep = async () => {
        const prevStatus = getPreviousStatus();
        if (prevStatus) {
            await handleStatusChange(prevStatus.key);
        }
    };

    if (loading) {
        return <OrderDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center text-red-600">
                    <p>Error loading order: {error}</p>
                    <Button onClick={fetchOrderDetails} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-600">
                    <p>Order not found</p>
                </div>
            </div>
        );
    }

    const { customer, maßschaft_kollektion, partner, ...orderDetails } = order;
    const category = orderDetails.catagoary || 'Massschafterstellung';
    
    // Calculate price based on category
    let totalPrice = 0;
    if (orderDetails.totalPrice !== null && orderDetails.totalPrice !== undefined) {
        // For Halbprobenerstellung and Bodenkonstruktion, use direct totalPrice
        totalPrice = Number(orderDetails.totalPrice) || 0;
    } else {
        // For Massschafterstellung, calculate from maßschaft_kollektion
        const basePrice = Number(maßschaft_kollektion?.price) || 0;
        const osenPrice = Number(orderDetails.osen_einsetzen_price) || 0;
        const lacePrice = Number(orderDetails.Passenden_schnursenkel_price) || 0;
        totalPrice = basePrice + osenPrice + lacePrice;
    }

    const polsterungItems = parseListField(orderDetails.polsterung);
    const verstarkungItems = parseListField(orderDetails.vestarkungen || orderDetails.verstarkungen);
    const addonPrices = [
        { label: 'Ösen einsetzen', value: formatCurrencyValue(orderDetails.osen_einsetzen_price) },
        { label: 'Passende Schnürsenkel', value: formatCurrencyValue(orderDetails.Passenden_schnursenkel_price) }
    ];
    const hasAddonSelection = addonPrices.some((item) => Boolean(item.value));
    const resolvedCustomerName = customer ? [customer?.vorname, customer?.nachname].filter(Boolean).join(' ').trim() : '';
    const fallbackCustomerName = customer?.customerNumber ? `Kunde #${customer.customerNumber}` : 'Unbekannter Kunde';
    const customerFullName = resolvedCustomerName || orderDetails.other_customer_number || fallbackCustomerName;
    const addressParts = [
        customer?.straße,
        customer?.plz,
        customer?.ort,
        customer?.land
    ].filter(Boolean);
    const currentStatusInfo = statusWorkflow.find(status => status.key === currentStatus);
    const nextStatusInfo = getNextStatus();

    // Prepare data based on category
    const customizationData = {
        lederType: getDisplayText(orderDetails.lederType),
        lederfarbe: getDisplayText(orderDetails.lederfarbe),
        innenfutter: getDisplayText(orderDetails.innenfutter),
        schafthohe: getDisplayText(orderDetails.schafthohe),
        nahtfarbe: getDisplayText(orderDetails.nahtfarbe, 'Standard'),
        nahtfarbeText: orderDetails.nahtfarbe_text,
        otherCustomerNumber: orderDetails.other_customer_number,
        polsterungItems,
        polsterungText: orderDetails.polsterung_text,
        verstarkungItems,
        verstarkungText: orderDetails.vestarkungen_text,
        addonOptions: addonPrices,
        models: {
            first: order.image3d_1,
            second: order.image3d_2
        }
    };

    // Bodenkonstruktion data
    const bodenkonstruktionData = {
        konstruktionsart: orderDetails.Konstruktionsart,
        fersenkappe: orderDetails.Fersenkappe,
        farbauswahl: orderDetails.Farbauswahl_Bodenkonstruktion,
        sohlenmaterial: orderDetails.Sohlenmaterial,
        absatzHoehe: orderDetails.Absatz_Höhe,
        absatzForm: orderDetails.Absatz_Form,
        abrollhilfe: orderDetails.Abrollhilfe_Rolle,
        laufsohleProfil: orderDetails.Laufsohle_Profil_Art,
        sohlenstaerke: orderDetails.Sohlenstärke,
        besondereHinweise: orderDetails.Besondere_Hinweise,
        models: {
            first: order.image3d_1,
            second: order.image3d_2
        }
    };

    // Halbprobenerstellung data
    const halbprobenerstellungData = {
        bettungsdicke: orderDetails.Bettungsdicke,
        haertegradShore: orderDetails.Haertegrad_Shore,
        fersenschale: orderDetails.Fersenschale,
        laengsgewoelbestuetze: orderDetails.Laengsgewölbestütze,
        palotteOderQuerpalotte: orderDetails.Palotte_oder_Querpalotte,
        korrekturDerFussstellung: orderDetails.Korrektur_der_Fußstellung,
        zehenelementeDetails: orderDetails.Zehenelemente_Details,
        eineKorrekturNoetigIst: orderDetails.eine_korrektur_nötig_ist,
        speziellesFussproblem: orderDetails.Spezielles_Fußproblem,
        zusatzkorrekturAbsatzerhoehung: orderDetails.Zusatzkorrektur_Absatzerhöhung,
        vertiefungenAussparungen: orderDetails.Vertiefungen_Aussparungen,
        oberflaecheFinish: orderDetails.Oberfläche_finish,
        ueberzugStaerke: orderDetails.Überzug_Stärke,
        anmerkungenZurBettung: orderDetails.Anmerkungen_zur_Bettung,
        leistenMitOhnePlatzhalter: orderDetails.Leisten_mit_ohne_Platzhalter,
        schuhleistenTyp: orderDetails.Schuhleisten_Typ,
        materialDesLeisten: orderDetails.Material_des_Leisten,
        leistenGleicheLaenge: orderDetails.Leisten_gleiche_Länge,
        absatzhoehe: orderDetails.Absatzhöhe,
        abrollhilfe: orderDetails.Abrollhilfe,
        spezielleFussproblemeLeisten: orderDetails.Spezielle_Fußprobleme_Leisten,
        anmerkungenZumLeisten: orderDetails.Anmerkungen_zum_Leisten,
        models: {
            first: order.image3d_1,
            second: order.image3d_2
        }
    };

    const contactInfo = {
        customerName: customerFullName,
        customerNumber: customer?.customerNumber,
        email: customer?.email,
        phone: customer?.telefon,
        addressLines: addressParts,
        partnerName: partner?.name,
        partnerEmail: partner?.email
    };

    const collectionMeta = maßschaft_kollektion?.catagoary
        ? `${maßschaft_kollektion.catagoary}${maßschaft_kollektion?.gender ? ` · ${maßschaft_kollektion.gender}` : ''}`
        : maßschaft_kollektion?.gender || '';

    const basePrice = Number(maßschaft_kollektion?.price) || 0;
    const priceSummary = {
        collectionName: maßschaft_kollektion?.name || category,
        collectionMeta: category !== 'Massschafterstellung' ? category : collectionMeta,
        basePrice: formatCurrencyValue(basePrice),
        addons: addonPrices,
        totalPrice: formatCurrencyValue(totalPrice),
        hasAddonSelection
    };

    const statusCardProps = {
        currentStatus,
        currentStatusInfo,
        nextStatusInfo,
        statusWorkflow,
        statusError,
        isUpdatingStatus,
        onPrevious: handlePreviousStep,
        onNext: handleNextStep,
        onStatusChange: handleStatusChange,
        hasPreviousStep: Boolean(getPreviousStatus())
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            <OrderHeader order={order} onBack={() => router.back()} />

            <div className="flex flex-col gap-4">
                {/* Render customization card based on category */}
                {category === 'Bodenkonstruktion' && (
                    <OrderBodenkonstruktionCard data={bodenkonstruktionData} />
                )}
                {category === 'Halbprobenerstellung' && (
                    <OrderHalbprobenerstellungCard data={halbprobenerstellungData} />
                )}
                {category === 'Massschafterstellung' && (
                    <OrderCustomizationCard data={customizationData} />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <OrderContactCard contactInfo={contactInfo} />
                    <OrderPriceSummaryCard summary={priceSummary} />
                </div>

                <OrderStatusCard {...statusCardProps} />
            </div>
        </div>
    );
}
