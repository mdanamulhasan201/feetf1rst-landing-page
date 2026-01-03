'use client';

import { Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const ManageOrderFilters = ({
    searchTerm,
    onSearchChange,
    searchLoading,
    selectedCategory,
    onCategoryChange,
    selectedStatus,
    onStatusChange,
    totalItems
}) => (
    <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                    </div>
                )}
                <Input
                    type="text"
                    placeholder="Suche nach Bestellnummer, Partnergeschäft oder Modell..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`pl-12 pr-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 ${searchLoading ? 'bg-blue-50' : ''
                        }`}
                />
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-full lg:w-48 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Alle Kategorien" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Kategorien</SelectItem>
                        <SelectItem value="Halbprobenerstellung">Halbprobenerstellung</SelectItem>
                        <SelectItem value="Massschafterstellung">Massschafterstellung</SelectItem>
                        <SelectItem value="Bodenkonstruktion">Bodenkonstruktion</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-full lg:w-48 h-12 border-blue-500 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Alle Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="Bestellung_eingegangen">Bestellung eingegangen</SelectItem>
                        <SelectItem value="In_Produktion">In Produktion</SelectItem>
                        <SelectItem value="Qualitätskontrolle">Qualitätskontrolle</SelectItem>
                        <SelectItem value="Versandt">Versandt</SelectItem>
                        <SelectItem value="Ausgeführt">Ausgeführt</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="mt-4">
            <p className="text-gray-600 text-sm">
                {totalItems} Bestellungen insgesamt
                {searchTerm && (
                    <span className="ml-2 text-blue-600">
                        (Suche nach: "{searchTerm}")
                    </span>
                )}
            </p>
        </div>
    </div>
);

export default ManageOrderFilters;

