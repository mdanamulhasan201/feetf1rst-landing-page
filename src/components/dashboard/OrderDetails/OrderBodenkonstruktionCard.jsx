import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import STLViewer from '../STLViewer';

const OrderBodenkonstruktionCard = ({ data }) => {
    if (!data) return null;

    const {
        konstruktionsart,
        fersenkappe,
        farbauswahl,
        sohlenmaterial,
        absatzHoehe,
        absatzForm,
        abrollhilfe,
        laufsohleProfil,
        sohlenstaerke,
        besondereHinweise,
        models
    } = data;

    const Field = ({ label, value }) => (
        <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
                {label}
            </label>
            <p className="text-sm">{value || 'Keine Angabe'}</p>
        </div>
    );

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Bodenkonstruktion Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Field label="Konstruktionsart" value={konstruktionsart} />
                        <Field label="Fersenkappe" value={fersenkappe} />
                        <Field label="Farbauswahl Bodenkonstruktion" value={farbauswahl} />
                        <Field label="Sohlenmaterial" value={sohlenmaterial} />
                    </div>
                    <div className="space-y-4">
                        <Field label="Absatz Höhe" value={absatzHoehe} />
                        <Field label="Absatz Form" value={absatzForm} />
                        <Field label="Abrollhilfe / Rolle" value={abrollhilfe} />
                        <Field label="Laufsohle Profil Art" value={laufsohleProfil} />
                        <Field label="Sohlenstärke" value={sohlenstaerke} />
                    </div>
                </div>

                {besondereHinweise && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <label className="text-sm font-medium text-gray-600 block mb-2">
                            Besondere Hinweise
                        </label>
                        <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md p-3">
                            {besondereHinweise}
                        </p>
                    </div>
                )}

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

export default OrderBodenkonstruktionCard;

