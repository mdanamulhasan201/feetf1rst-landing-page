'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormModal from '../../../components/FormModal';


export default function EinlagenFinder() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [submittedData, setSubmittedData] = useState(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        // Get and parse the submitted data from URL if it exists
        const data = searchParams.get('data')
        if (data) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(data))
                setSubmittedData(decodedData)
                // console.log('Received Form Data:', decodedData)
            } catch (error) {
                // console.error('Error parsing data:', error)
            }
        }

        fetchCategories()
    }, [searchParams])

    const fetchCategories = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/data/einlagenFinder.json')
            const data = await response.json()

            const categoriesWithSlugs = data.map(category => ({
                ...category,
                slug: category.slug || category.title
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            }))
            setCategories(categoriesWithSlugs)
        } catch (error) {
            // console.error('Error fetching categories:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCategoryClick = (e, category) => {
        if (category.slug === 'alltagseinlage' || category.slug === 'sporteinlage' || category.slug === 'businesseinlagen') {
            e.preventDefault()
            setSelectedCategory(category)
            setIsModalOpen(true)
            // console.log('Selected category:', category) 
        }
    }

    // Display submitted data section if it exists
    const renderSubmittedData = () => {
        if (!submittedData) return null;

        return (
            <div className="w-full mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Submitted Form Data:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(submittedData, null, 2)}
                </pre>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                Loading...
            </div>
        )
    }
    return (

        <>
            {renderSubmittedData()}
            <div className="flex flex-col md:flex-row h-screen w-full relative gap-2">
                {categories.map((item, index) => (
                    <div
                        key={item?.id}
                        className="flex-1 relative group overflow-hidden cursor-pointer"
                        onClick={(e) => handleCategoryClick(e, item)}
                    >
                        <div
                            style={{ backgroundImage: `url(${item.image})` }}
                            className={`h-full w-full bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105
                            ${index === 1 ? "" : ""}`}
                        >
                            <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
                                <h2 className="text-white text-2xl lg:text-4xl font-semibold  text-center uppercase">
                                    {item.title}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}


                <Link href="/dauerschleife" className="absolute cursor-pointer bottom-5 right-5 lg:bottom-10 lg:right-10 bg-white/95 text-black p-2 rounded-full shadow-2xl flex items-center space-x-3 transition-transform hover:scale-105 duration-300">
                    <Image src="/main-categorys/leg.png" alt="scan" width={48} height={48} className="w-10 h-10 lg:w-12 lg:h-12 rounded-full" />
                    <span className="font-semibold text-xs lg:text-sm pr-4 leading-tight">
                        Ausschließlich
                        <br />
                        Scandurchführung
                    </span>
                </Link>

            </div>


            {isModalOpen && (
                <FormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedCategory(null)
                    }}
                    category={selectedCategory}
                    categoryData={null}
                />
            )}
        </>

    )
}
