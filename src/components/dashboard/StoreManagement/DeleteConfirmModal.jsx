"use client"

import React, { useState } from 'react'
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { useStoreManagement } from '../../../context/StoreManagementContext'

export default function DeleteConfirmModal({ onConfirm }) {
    const { deleteConfirmId, closeDeleteModal } = useStoreManagement()
    const [isDeleting, setIsDeleting] = useState(false)

    if (!deleteConfirmId) return null

    const handleDelete = async () => {
        setIsDeleting(true)
        const success = await onConfirm(deleteConfirmId)
        if (success) {
            closeDeleteModal()
        }
        setIsDeleting(false)
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeDeleteModal}
        >
            <Card 
                className="w-full max-w-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <CardTitle>Produkt löschen?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-4">
                        Sind Sie sicher, dass Sie dieses Produkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={closeDeleteModal}
                            disabled={isDeleting}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

