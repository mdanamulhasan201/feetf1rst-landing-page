'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '../../../../../../apis/productsCreate';
import { Button } from '../../../../../../components/ui/button';
import { Badge } from '../../../../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../components/ui/select';
import { Textarea } from '../../../../../../components/ui/textarea';
import { ArrowLeft, ArrowRight, Save, FileTextIcon } from 'lucide-react';
import InvoiceGenerator from '../../../../../../components/dashboard/Invoice/InvoiceGenerator';

export default function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('neu');
    const [productionNotes, setProductionNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Status workflow configuration
    const statusWorkflow = [
        { key: 'neu', label: 'Neu', next: 'in_production' },
        { key: 'in_production', label: 'Zu Produzent Abgeschickt', next: 'Zu_Produzent_Abgeschickt' },
        { key: 'sent_to_producer', label: 'In Bearbeitung', next: 'In_Bearbeitung' },
        { key: 'Zu_Kunde_Abgeschickt', label: 'Zu Kunde abgeschickt', next: 'Zu_Kunde_Abgeschickt' },
        { key: 'Bei_uns_angekommen', label: 'Bei uns angekommen', next: 'Bei uns angekommen' },
        { key: 'Beim_Kunden_angekommen', label: 'Beim Kunden angekommen', next: 'Beim Kunden angekommen' }
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
                // Set initial production notes if available
                setProductionNotes(response.data.productionNotes || '');
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

    const handleStatusChange = (newStatus) => {
        setCurrentStatus(newStatus);
    };

    const handleNextStep = () => {
        const nextStatus = getNextStatus();
        if (nextStatus) {
            setCurrentStatus(nextStatus.key);
        }
    };

    const handlePreviousStep = () => {
        const prevStatus = getPreviousStatus();
        if (prevStatus) {
            setCurrentStatus(prevStatus.key);
        }
    };

    const handleSaveNotes = async () => {
        setIsSaving(true);
        try {
            // Here you would typically save to your API
            console.log('Saving production notes:', productionNotes);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Production notes saved successfully!');
        } catch (err) {
            alert('Error saving notes: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading order details...</p>
                    </div>
                </div>
            </div>
        );
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
    const currentStatusInfo = statusWorkflow.find(status => status.key === currentStatus);
    const nextStatusInfo = getNextStatus();

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="mb-8">
                <div>
                    <div className="flex items-center justify-between gap-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="mb-4 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Zurück zur Übersicht
                        </Button>
                        {/* download invoice */}
                        {order && (
                            <InvoiceGenerator order={order} />
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Bestelldetails #{order?.orderNumber || order.id}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Erstellt am {formatDate(order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Left Column - Individualisierung */}
                <div className="space-y-6">
                    <Card className="shadow-none ">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Individualisierung
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Leder bereitgestellt
                                        </label>
                                        <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                                            Nein (+24,99 €)
                                        </Badge>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Innenfutter
                                        </label>
                                        <p className="text-sm">{orderDetails.innenfutter || 'Leder'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Schafthöhe
                                        </label>
                                        <p className="text-sm">{orderDetails.schafthohe || '9cm'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Polsterung
                                        </label>
                                        <Badge variant="secondary" className="px-3 py-1">
                                            {orderDetails.polsterung || 'Standard'}
                                        </Badge>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Verstärkungen
                                        </label>
                                        <div className="space-y-2">
                                            <Badge variant="secondary" className="px-3 py-1 mr-2">
                                                Fersenverstärkung
                                            </Badge>
                                            <Badge variant="secondary" className="px-3 py-1">
                                                Innen-Außenknöchel
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Fersen- und Knöchelverstärkung für Wanderungen
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Lederfarbe
                                        </label>
                                        <p className="text-sm">{orderDetails.lederfarbe || 'Tan'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Nahtfarbe
                                        </label>
                                        <p className="text-sm">{orderDetails.nahtfarbe || 'Beige'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-2">
                                            Schaftform
                                        </label>
                                        <p className="text-sm">Eher steif</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column - Bestellverwaltung */}
                <div className="space-y-6">
                    <Card className="shadow-none ">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                Bestellverwaltung
                            </CardTitle>
                            <CardDescription>
                                Status-Workflow
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status Workflow */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handlePreviousStep}
                                        disabled={!getPreviousStatus()}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Zurück
                                    </Button>

                                    <Badge className="bg-blue-600 text-white px-4 py-2">
                                        {currentStatusInfo?.label}
                                    </Badge>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNextStep}
                                        disabled={!nextStatusInfo}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        Nächste Stufe
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Manual Status Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-600">
                                        Oder Status manuell wählen:
                                    </label>
                                    <Select value={currentStatus} onValueChange={handleStatusChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusWorkflow.map((status) => (
                                                <SelectItem key={status.key} value={status.key}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Next Step Info */}
                                {nextStatusInfo && (
                                    <div className="bg-blue-50 p-3 rounded-lg mt-5">
                                        <p className="text-sm text-blue-800">
                                            <strong>Nächster Schritt:</strong> {nextStatusInfo.label}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Production Notes */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">
                                    Produktionsnotizen
                                </label>
                                <Textarea
                                    value={productionNotes}
                                    onChange={(e) => setProductionNotes(e.target.value)}
                                    placeholder="Fügen Sie hier interne Notizen zur Produktion hinzu..."
                                    className="min-h-[120px] resize-y"
                                />
                                <div className="flex justify-end mt-3">
                                    <Button
                                        onClick={handleSaveNotes}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <Save className="h-4 w-4" />
                                        {isSaving ? 'Speichern...' : 'Status speichern'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
