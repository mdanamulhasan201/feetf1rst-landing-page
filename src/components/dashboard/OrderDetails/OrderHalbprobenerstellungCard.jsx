import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import STLViewer from '../STLViewer';

const OrderHalbprobenerstellungCard = ({ data }) => {
    if (!data) return null;

    const {
        bettungsdicke,
        haertegradShore,
        fersenschale,
        laengsgewoelbestuetze,
        palotteOderQuerpalotte,
        korrekturDerFussstellung,
        zehenelementeDetails,
        eineKorrekturNoetigIst,
        speziellesFussproblem,
        zusatzkorrekturAbsatzerhoehung,
        vertiefungenAussparungen,
        oberflaecheFinish,
        ueberzugStaerke,
        anmerkungenZurBettung,
        leistenMitOhnePlatzhalter,
        schuhleistenTyp,
        materialDesLeisten,
        leistenGleicheLaenge,
        absatzhoehe,
        abrollhilfe,
        spezielleFussproblemeLeisten,
        anmerkungenZumLeisten,
        models
    } = data;

    const Field = ({ label, value, note }) => (
        <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
                {label}
            </label>
            <p className="text-sm">{value || 'Keine Angabe'}</p>
            {note && (
                <p className="mt-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md p-2">
                    {note}
                </p>
            )}
        </div>
    );

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                    Halbprobenerstellung Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bettung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Bettungsdicke" value={bettungsdicke} />
                            <Field label="Härtegrad Shore" value={haertegradShore} />
                            <Field label="Fersenschale" value={fersenschale} />
                            <Field label="Längsgewölbestütze" value={laengsgewoelbestuetze} />
                            <Field label="Palotte oder Querpalotte" value={palotteOderQuerpalotte} />
                            <Field label="Korrektur der Fußstellung" value={korrekturDerFussstellung} />
                            <Field label="Zehenelemente Details" value={zehenelementeDetails} />
                        </div>
                        <div className="space-y-4">
                            <Field label="Eine Korrektur nötig ist" value={eineKorrekturNoetigIst} />
                            <Field label="Spezielles Fußproblem" value={speziellesFussproblem} />
                            <Field label="Zusatzkorrektur Absatzerhöhung" value={zusatzkorrekturAbsatzerhoehung} />
                            <Field label="Vertiefungen / Aussparungen" value={vertiefungenAussparungen} />
                            <Field label="Oberfläche / Finish" value={oberflaecheFinish} />
                            <Field label="Überzug Stärke" value={ueberzugStaerke} />
                            <Field label="Anmerkungen zur Bettung" value={anmerkungenZurBettung} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leisten</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Field label="Leisten mit/ohne Platzhalter" value={leistenMitOhnePlatzhalter} />
                            <Field label="Schuhleisten Typ" value={schuhleistenTyp} />
                            <Field label="Material des Leisten" value={materialDesLeisten} />
                            <Field 
                                label="Leisten gleiche Länge" 
                                value={leistenGleicheLaenge !== undefined ? (leistenGleicheLaenge ? 'Ja' : 'Nein') : 'Keine Angabe'} 
                            />
                        </div>
                        <div className="space-y-4">
                            <Field label="Absatzhöhe" value={absatzhoehe} />
                            <Field label="Abrollhilfe" value={abrollhilfe} />
                            <Field label="Spezielle Fußprobleme Leisten" value={spezielleFussproblemeLeisten} />
                            <Field label="Anmerkungen zum Leisten" value={anmerkungenZumLeisten} />
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

export default OrderHalbprobenerstellungCard;

