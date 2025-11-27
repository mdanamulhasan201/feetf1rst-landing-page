'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';

const CancelOrderDialog = ({
    open,
    onOpenChange,
    orderToCancel,
    onCancel,
    onClose,
    cancellingOrderId
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Bestellung stornieren</DialogTitle>
                <DialogDescription>
                    Sind Sie sicher, dass Sie die Bestellung{' '}
                    <span className="font-semibold">{orderToCancel?.orderNumber || orderToCancel?.id}</span> stornieren möchten? Diese Aktion
                    kann nicht rückgängig gemacht werden.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button variant="outline" onClick={onClose} disabled={!!cancellingOrderId} className="cursor-pointer">
                    Abbrechen
                </Button>
                <Button
                    variant="destructive"
                    onClick={onCancel}
                    disabled={!!cancellingOrderId}
                    className="min-w-[120px] cursor-pointer"
                >
                    {cancellingOrderId ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Wird gelöscht...
                        </>
                    ) : (
                        'Ja, stornieren'
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default CancelOrderDialog;

