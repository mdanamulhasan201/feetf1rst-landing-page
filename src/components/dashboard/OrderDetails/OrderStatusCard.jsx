import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const OrderStatusCard = ({
    currentStatus,
    currentStatusInfo,
    nextStatusInfo,
    statusWorkflow,
    statusError,
    isUpdatingStatus,
    onPrevious,
    onNext,
    onStatusChange,
    hasPreviousStep
}) => {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Bestellverwaltung
                </CardTitle>
                <CardDescription>
                    Status-Workflow
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPrevious}
                            disabled={!hasPreviousStep || isUpdatingStatus}
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
                            onClick={onNext}
                            disabled={!nextStatusInfo || isUpdatingStatus}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            Nächste Stufe
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {statusError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-red-800 text-sm">
                                <strong>Fehler:</strong> {statusError}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-600">
                            Oder Status manuell wählen:
                        </label>
                        <Select value={currentStatus} onValueChange={onStatusChange} disabled={isUpdatingStatus}>
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

                    {nextStatusInfo && (
                        <div className="bg-blue-50 p-3 rounded-lg mt-5">
                            <p className="text-sm text-blue-800">
                                <strong>Nächster Schritt:</strong> {nextStatusInfo.label}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderStatusCard;

