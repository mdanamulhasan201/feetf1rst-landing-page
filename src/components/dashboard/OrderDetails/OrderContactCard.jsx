import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

const OrderContactCard = ({ contactInfo }) => {
    if (!contactInfo) return null;
    const {
        customerName,
        customerNumber,
        email,
        phone,
        addressLines,
        partnerName,
        partnerEmail
    } = contactInfo;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Kontakt & Partner
                </CardTitle>
                <CardDescription>
                    Angaben aus dem Bestellformular
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div>
                    <LabelText label="Kunde" value={customerName} />
                    {customerNumber && (
                        <p className="text-xs text-gray-500">
                            Kundennummer: {customerNumber}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LabelText label="E-Mail" value={email || 'Keine Angabe'} />
                    <LabelText label="Telefon" value={phone || 'Keine Angabe'} />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                        Adresse
                    </label>
                    {addressLines?.length ? (
                        <p className="text-sm">{addressLines.join(', ')}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Keine Adresse hinterlegt</p>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <LabelText label="Betreuender Partner" value={partnerName || 'Noch nicht zugewiesen'} />
                    {partnerEmail && (
                        <p className="text-xs text-gray-500">
                            {partnerEmail}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const LabelText = ({ label, value }) => (
    <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
            {label}
        </label>
        <p className="text-sm">{value}</p>
    </div>
);

export default OrderContactCard;

