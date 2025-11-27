import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

const OrderPriceSummaryCard = ({ summary }) => {
    if (!summary) return null;

    const {
        collectionName,
        collectionMeta,
        basePrice,
        addons,
        totalPrice,
        hasAddonSelection
    } = summary;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Kollektion & Preisübersicht
                </CardTitle>
                <CardDescription>
                    Auf Basis der gewählten Optionen
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                        Maßschaft-Kollektion
                    </label>
                    <p className="text-sm">{collectionName || 'Keine Kollektion ausgewählt'}</p>
                    {collectionMeta && (
                        <p className="text-xs text-gray-500">{collectionMeta}</p>
                    )}
                </div>

                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                        <span>Grundpreis Kollektion</span>
                        <span className="font-medium">{basePrice || '–'}</span>
                    </div>
                    {addons.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="font-medium">
                                {item.value || 'Nicht ausgewählt'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between text-base font-semibold border-t border-gray-100 pt-4">
                    <span>Gesamtpreis (netto)</span>
                    <span>{totalPrice || '–'}</span>
                </div>

                {!hasAddonSelection && (
                    <p className="text-xs text-gray-500">
                        Keine kostenpflichtigen Zusatzoptionen gewählt.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderPriceSummaryCard;

