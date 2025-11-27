import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import STLViewer from '../STLViewer';

const OrderCustomizationCard = ({ data }) => {
    if (!data) return null;
    const {
        lederType,
        lederfarbe,
        innenfutter,
        schafthohe,
        nahtfarbe,
        nahtfarbeText,
        otherCustomerNumber,
        polsterungItems,
        polsterungText,
        verstarkungItems,
        verstarkungText,
        addonOptions,
        models
    } = data;

    const renderBadgeList = (items) => {
        if (!items?.length) {
            return <p className="text-sm text-gray-500">Keine Auswahl getroffen</p>;
        }
        return (
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <Badge key={item} variant="secondary" className="px-3 py-1">
                        {item}
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Individualisierung
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Field label="Ledertyp" value={lederType} />
                        <Field label="Lederfarbe" value={lederfarbe} />
                        <Field label="Innenfutter" value={innenfutter} />
                        <Field label="Schafthöhe" value={schafthohe} />
                        <Field label="Nahtfarbe" value={nahtfarbe} note={nahtfarbeText} />
                        {otherCustomerNumber && (
                            <Field label="Kundenreferenz / Freitext" value={otherCustomerNumber} />
                        )}
                    </div>
                    <div className="space-y-4">
                        <Field label="Polsterung" customContent={renderBadgeList(polsterungItems)} note={polsterungText} />
                        <Field label="Verstärkungen" customContent={renderBadgeList(verstarkungItems)} note={verstarkungText} />
                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-2">
                                Zusatzoptionen
                            </label>
                            <div className="space-y-2 text-sm">
                                {addonOptions.map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <span>{item.label}</span>
                                        <span className="font-medium">
                                            {item.value || 'Nicht ausgewählt'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {(models?.first || models?.second) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            3D-Modelle
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {models?.first && (
                                <STLViewer
                                    stlUrl={models.first}
                                    label="3D-Modell 1"
                                />
                            )}
                            {models?.second && (
                                <STLViewer
                                    stlUrl={models.second}
                                    label="3D-Modell 2"
                                />
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const Field = ({ label, value, note, customContent }) => (
    <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
            {label}
        </label>
        {customContent || <p className="text-sm">{value}</p>}
        {note && (
            <p className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md p-2">
                {note}
            </p>
        )}
    </div>
);

export default OrderCustomizationCard;

