"use client"

import React from 'react'
import { Input } from "../../ui/input"

const defaultSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48']

export default function SizesTable({ formData, onSizeFieldChange, disabled = false }) {
    return (
        <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Größen & Länge</h3>
            <div className="border rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-50 border-b">
                    <div className="grid grid-cols-2 gap-2 px-3 py-2">
                        <div className="text-sm font-semibold text-gray-700">Größe</div>
                        <div className="text-sm font-semibold text-gray-700">Länge (cm)</div>
                    </div>
                </div>
                <div className="divide-y">
                    {defaultSizes.map((size) => (
                        <div key={size} className="grid grid-cols-2 gap-2 px-3 py-2 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center font-medium text-gray-700">{size}</div>
                            <div>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="z.B. 225"
                                    value={formData.groessenMengen[size]?.length || ''}
                                    onChange={(e) => onSizeFieldChange(size, 'length', e.target.value)}
                                    className="h-8 text-sm"
                                    disabled={disabled}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

