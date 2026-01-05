"use client"

import React, { useState } from 'react'
import Storemanagement from '../../../../components/dashboard/StoreManagement/Storemanagement'
import HistorySidebar from '../../../../components/dashboard/StoreManagement/HistorySidebar'
import { Button } from '../../../../components/ui/button'
import { History } from 'lucide-react'

export default function StoreManagementPage() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lagerverwaltung</h1>
                    <p className="text-gray-500 mt-1">Verwalten Sie Ihre Produkte und Bestände</p>
                </div>
                <Button
                    onClick={() => setIsHistoryOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <History className="h-4 w-4" />
                    Historie
                </Button>
            </div>

            <Storemanagement />
            
            <HistorySidebar 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
            />
        </div>
    )
}
