'use client'
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useSearchParams, useRouter } from 'next/navigation';
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import * as Slider from "@radix-ui/react-slider";

export default function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const colors = Object.entries({
        '#000000': 'Black',
        '#FFFFFF': 'White',
        '#FF0000': 'Red',
        '#0000FF': 'Blue',
        '#008000': 'Green',
        '#FFFF00': 'Yellow',
        '#FFA500': 'Orange',
        '#800080': 'Purple',
        '#A52A2A': 'Brown',
        '#808080': 'Gray',
        '#FFC0CB': 'Pink',
        '#40E0D0': 'Turquoise',
        '#FFD700': 'Gold',
        '#C0C0C0': 'Silver',
        '#ADD8E6': 'Light Blue',
        '#90EE90': 'Light Green',
        '#FFB6C1': 'Light Pink',
        '#D3D3D3': 'Light Gray',
        '#F08080': 'Light Coral',
        '#E6E6FA': 'Lavender',
        '#00FFFF': 'Cyan',
        '#8B0000': 'Dark Red',
        '#006400': 'Dark Green',
        '#00008B': 'Dark Blue',
        '#B22222': 'Fire Brick',
        '#DAA520': 'Goldenrod',
        '#F5DEB3': 'Wheat',
        '#FFE4C4': 'Bisque',
        '#D2691E': 'Chocolate',
        '#FA8072': 'Salmon',
        '#FF1493': 'Deep Pink',
        '#7FFFD4': 'Aquamarine',
        '#B0E0E6': 'Powder Blue',
        '#DC143C': 'Crimson',
        '#4B0082': 'Indigo',
        '#2F4F4F': 'Dark Slate Gray',
        '#708090': 'Slate Gray',
    }).map(([value, name]) => ({ value, name }));

    const [openSections, setOpenSections] = useState(() => {
        return {
            schuhtyp: !!searchParams.get('typeOfShoes'),
            geschlecht: !!searchParams.get('gender'),
            marken: !!searchParams.get('brand'),
            grosse: searchParams.getAll('size[]').length > 0,
            feetFirstFit: false,
            farbe: searchParams.getAll('colorName[]').length > 0,
            preis: !!(searchParams.get('minPrice') || searchParams.get('maxPrice')),
            verfugbarkeit: !!searchParams.get('availability'),
            angebote: false
        };
    });

    const [filters, setFilters] = useState(() => {
        const colorNames = Array.from(searchParams.getAll('colorName[]'));
        const selectedColorCodes = colors
            .filter(color => colorNames.includes(color.name.toLowerCase()))
            .map(color => color.value);

        return {
            typeOfShoes: Array.from(searchParams.getAll('typeOfShoes[]')) || [],
            gender: searchParams.get('gender') || '',
            brand: searchParams.get('brand') || '',
            size: Array.from(searchParams.getAll('size[]')) || [],
            colors: selectedColorCodes,
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            availability: searchParams.get('availability') === 'true' || false,
        };
    });

    const [priceRange, setPriceRange] = useState([
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '1000')
    ]);

    // Add state for shoe types
    const [typeOfShoes, setTypeOfShoes] = useState([]);

    // Add state for brands
    const [brands, setBrands] = useState([]);

    // Add useEffect to fetch shoe types
    useEffect(() => {
        fetchShoeTypes();
        fetchBrands();
    }, []);
    const fetchShoeTypes = async () => {
        try {
            const response = await fetch('/data/shoesTypeDropdown.json');
            const data = await response.json();
            // Extract just the values from the data
            const shoeTypes = data.map(type => type.value);
            setTypeOfShoes(shoeTypes);
        } catch (error) {
            console.error('Error loading shoe types:', error);
        }
    };

    // Add useEffect to fetch brands
    const fetchBrands = async () => {
        try {
            const response = await fetch('/data/brandName.json');
            const data = await response.json();
            // Extract just the values from the data
            const brandNames = data.map(brand => brand.value);
            setBrands(brandNames);
        } catch (error) {
            console.error('Error loading brands:', error);
        }
    };


    // Filter Options
    const genders = ['MALE', 'FEMALE', 'UNISEX'];

    const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        // Update openSections based on the filter change
        setOpenSections(prev => ({
            ...prev,
            schuhtyp: key === 'typeOfShoes' ? !!value : prev.schuhtyp,
            geschlecht: key === 'gender' ? !!value : prev.geschlecht,
            grosse: key === 'size' ? value.length > 0 : prev.grosse,
            farbe: key === 'colors' ? value.length > 0 : prev.farbe,
            preis: key.includes('Price') ? !!(newFilters.minPrice || newFilters.maxPrice) : prev.preis,
            verfugbarkeit: key === 'availability' ? !!value : prev.verfugbarkeit,
        }));

        const params = new URLSearchParams(searchParams);

        if (key === 'colors' && Array.isArray(value)) {
            params.delete('colorName[]');
            if (value.length > 0) {
                value.forEach(colorCode => {
                    const colorName = colors.find(c => c.value === colorCode)?.name.toLowerCase();
                    if (colorName) {
                        params.append('colorName[]', colorName);
                    }
                });
            }
        } else {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }

        router.push(`/shoes?${params.toString()}`);
    };

    const handleSizeToggle = (size) => {
        const newSizes = filters.size.includes(size)
            ? filters.size.filter(s => s !== size)
            : [...filters.size, size].sort();
        setFilters(prev => ({ ...prev, size: newSizes }));
        const params = new URLSearchParams(searchParams);
        params.delete('size[]');
        if (newSizes.length > 0) {
            newSizes.forEach(size => params.append('size[]', size));
        }
        router.replace(`/shoes?${params.toString()}`, { scroll: false });
    };

    const handlePriceRangeChange = (values) => {
        setPriceRange(values);
    };

    const handlePriceInputChange = (type, value) => {
        const numValue = parseInt(value) || 0;
        if (type === 'min') {
            const newMin = Math.max(0, Math.min(numValue, priceRange[1]));
            setPriceRange([newMin, priceRange[1]]);
        } else {
            const newMax = Math.min(1000, Math.max(numValue, priceRange[0]));
            setPriceRange([priceRange[0], newMax]);
        }
    };

    const handlePriceApply = () => {
        const validMinPrice = Math.max(0, Math.min(priceRange[0], 1000));
        const validMaxPrice = Math.max(validMinPrice, Math.min(priceRange[1], 1000));
        const params = new URLSearchParams(searchParams);
        params.set('minPrice', validMinPrice.toString());
        params.set('maxPrice', validMaxPrice.toString());
        router.push(`/shoes?${params.toString()}`);
    };

    const resetFilters = () => {
        // clear all session storage
        sessionStorage.clear();

        setFilters({
            typeOfShoes: [],
            gender: '',
            brand: '',
            size: [],
            colors: [],
            minPrice: '',
            maxPrice: '',
            availability: false,
        });

        setOpenSections({
            schuhtyp: false,
            geschlecht: false,
            marken: false,
            grosse: false,
            feetFirstFit: false,
            farbe: false,
            preis: false,
            verfugbarkeit: false,
            angebote: false
        });

        // Add page=1 when resetting filters
        const params = new URLSearchParams();
        params.set('page', '1');
        router.replace(`/shoes?${params.toString()}`);
    };

    const handleTypeOfShoesToggle = (type) => {
        const newTypes = filters.typeOfShoes.includes(type)
            ? filters.typeOfShoes.filter(t => t !== type)
            : [...filters.typeOfShoes, type].sort();
        setFilters(prev => ({ ...prev, typeOfShoes: newTypes }));
        setOpenSections(prev => ({
            ...prev,
            schuhtyp: true
        }));

        // Batch URL updates
        const params = new URLSearchParams(searchParams);
        params.delete('typeOfShoes[]');

        if (newTypes.length > 0) {
            newTypes.forEach(type => params.append('typeOfShoes[]', type));
        }

        router.replace(`/shoes?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        setOpenSections(prev => ({
            ...prev,
            schuhtyp: !!searchParams.get('typeOfShoes'),
            geschlecht: !!searchParams.get('gender'),
            grosse: searchParams.getAll('size[]').length > 0,
            farbe: searchParams.getAll('colorName[]').length > 0,
            preis: !!(searchParams.get('minPrice') || searchParams.get('maxPrice')),
            verfugbarkeit: !!searchParams.get('availability'),
        }));
    }, [searchParams]);

    useEffect(() => {
        const colorNames = Array.from(searchParams.getAll('colorName[]'));
        const selectedColorCodes = colors
            .filter(color => colorNames.includes(color.name.toLowerCase()))
            .map(color => color.value);

        setFilters(prev => ({
            ...prev,
            colors: selectedColorCodes,
            typeOfShoes: Array.from(searchParams.getAll('typeOfShoes[]')) || [],
            gender: searchParams.get('gender') || '',
            size: Array.from(searchParams.getAll('size[]')) || [],
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            availability: searchParams.get('availability') === 'true' || false,
        }));
    }, [searchParams]);



    return (
        <>
            <div className='px-4'>
                <div className=' flex items-center justify-between border-b border-gray-200 pb-4 gap-2 mt-3 mb-7'>
                    <h1 className=" font-bold text-2xl md:text-3xl lg:text-[28px]">Filter by
                    </h1>
                    <IoIosArrowDown className='text-2xl' />
                </div>
            </div>
            {/* filter */}
            <div className=" bg-white shadow-sm rounded-xl sticky top-36">

                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold">Filter</h2>
                        <button
                            onClick={resetFilters}
                            className="text-sm cursor-pointer text-[#62A07B] hover:underline"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('schuhtyp')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Schuhtyp</span>
                            <IoIosArrowDown
                                className={`transform transition-transform duration-200 ${openSections.schuhtyp ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {(openSections.schuhtyp || filters.typeOfShoes.length > 0) && (
                            <div className="py- px-4">
                                {typeOfShoes.map((type) => (
                                    <div key={type} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                            id={type}
                                            checked={filters.typeOfShoes.includes(type)}
                                            onCheckedChange={() => handleTypeOfShoesToggle(type)}
                                        />
                                        <Label htmlFor={type} className="capitalize">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Marken Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('marken')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Marken</span>
                            <IoIosArrowDown
                                className={`transform transition-transform duration-200 ${openSections.marken ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {openSections.marken && (
                            <div className="py-2 px-4">
                                {brands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                            id={brand}
                                            checked={filters.brand === brand}
                                            onCheckedChange={() => handleFilterChange('brand', filters.brand === brand ? '' : brand)}
                                        />
                                        <Label htmlFor={brand}>{brand}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Gender Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('geschlecht')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Geschlecht</span>
                            <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.geschlecht ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.geschlecht && (
                            <div className="py-2 px-4">
                                {genders.map((gender) => (
                                    <div key={gender} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                            id={gender}
                                            checked={filters.gender === gender}
                                            onCheckedChange={() => handleFilterChange('gender', filters.gender === gender ? '' : gender)}
                                        />
                                        <Label htmlFor={gender}>
                                            {gender === 'MALE' ? 'Herren' : gender === 'FEMALE' ? 'Frauen' : 'Unisex'}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Color Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('farbe')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Farbe</span>
                            <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.farbe ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.farbe && (
                            <div className="py-2 px-4">
                                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <div className="grid grid-cols-2 gap-2">
                                        {colors.map((color) => {
                                            const isSelected = filters.colors.includes(color.value);
                                            return (
                                                <div
                                                    key={color.value}
                                                    onClick={() => {
                                                        const newColors = isSelected
                                                            ? filters.colors.filter(c => c !== color.value)
                                                            : [...filters.colors, color.value];
                                                        handleFilterChange('colors', newColors);
                                                    }}
                                                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200
                                                    ${isSelected ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className={`w-6 h-6 rounded-full border flex-shrink-0 ${isSelected ? 'border-[#62A07B]' : 'border-gray-300'
                                                                }`}
                                                            style={{ backgroundColor: color.value }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">
                                                        {color.name}
                                                        {isSelected && (
                                                            <span className="ml-1 text-[#62A07B]">✓</span>
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Size Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('grosse')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Größe</span>
                            <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.grosse ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.grosse && (
                            <div className="py-2 px-4">
                                <div className="grid grid-cols-4 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeToggle(size)}
                                            className={`p-2 text-sm border rounded-md ${filters.size.includes(size)
                                                ? 'bg-[#62A07B] text-white border-[#62A07B]'
                                                : 'border-gray-300 hover:border-[#62A07B]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('preis')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Preis</span>
                            <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.preis ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.preis && (
                            <div className="py-4 px-4">
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1 relative">
                                            <span className="absolute text-xs text-gray-500 -top-5 left-0 capitalize">Min</span>
                                            <input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                                min="0"
                                                max={priceRange[1]}
                                                className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:border-transparent"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                        </div>
                                        <span className="text-gray-400">—</span>
                                        <div className="flex-1 relative">
                                            <span className="absolute text-xs text-gray-500 -top-5 left-0 capitalize">Max</span>
                                            <input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                                min={priceRange[0]}
                                                max="1000"
                                                className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:border-transparent"
                                                placeholder="1000"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                                        </div>
                                    </div>

                                    <Slider.Root
                                        className="relative flex items-center select-none touch-none w-full h-5"
                                        value={priceRange}
                                        max={1000}
                                        step={10}
                                        minStepsBetweenThumbs={1}
                                        onValueChange={handlePriceRangeChange}
                                    >
                                        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                                            <Slider.Range className="absolute bg-[#62A07B] rounded-full h-full" />
                                        </Slider.Track>
                                        <Slider.Thumb
                                            className="block w-5 h-5 bg-white border-2 border-[#62A07B] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:ring-offset-2"
                                            aria-label="Min price"
                                        />
                                        <Slider.Thumb
                                            className="block w-5 h-5 bg-white border-2 border-[#62A07B] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#62A07B] focus:ring-offset-2"
                                            aria-label="Max price"
                                        />
                                    </Slider.Root>

                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>0€</span>
                                        <span>500€</span>
                                        <span>1000€</span>
                                    </div>

                                    <button
                                        onClick={handlePriceApply}
                                        className="w-full bg-[#62A07B] text-white py-2 px-4 rounded-md hover:bg-[#528c67] transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Availability Filter */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('verfugbarkeit')}
                            className="w-full py-4 px-2 flex justify-between items-center hover:bg-gray-50"
                        >
                            <span className="font-pathway-extreme text-sm font-semibold">Verfügbarkeit</span>
                            <IoIosArrowDown className={`transform transition-transform duration-200 ${openSections.verfugbarkeit ? 'rotate-180' : ''}`} />
                        </button>
                        {openSections.verfugbarkeit && (
                            <div className="py-2 px-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="inStock"
                                        checked={filters.availability}
                                        onCheckedChange={(checked) => handleFilterChange('availability', checked)}
                                    />
                                    <Label htmlFor="inStock">Nur verfügbare Artikel</Label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>

    );
}
