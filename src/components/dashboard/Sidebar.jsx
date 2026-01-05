'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IoClose } from 'react-icons/io5'
import { HiPencilAlt, HiCollection, HiCog, HiArrowRightOnRectangle, HiDocumentText, HiUserGroup, HiCube } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import { Image, Store, Upload, UserPlus } from 'lucide-react'
import { MdProductionQuantityLimits } from "react-icons/md";
// import toast from 'react-hot-toast'

export default function Sidebar({ onClose }) {
    const pathname = usePathname();
    const { logout } = useAuth()
    const router = useRouter()
    const menuItems = [
        // { icon: HiHome, label: 'Dashboard', href: '/dashboard' },
        { icon: HiPencilAlt, label: 'Create Product', href: '/dashboard/create-products' },
        { icon: HiCollection, label: 'All Products', href: '/dashboard/all-product' },
        { icon: UserPlus, label: 'Manage Partner', href: '/dashboard/manage-partner' },
        { icon: MdProductionQuantityLimits, label: 'Upload Product', href: '/dashboard/upload-product' },
        { icon: MdProductionQuantityLimits , label: 'Manage Order', href: '/dashboard/manage-order' },
        { icon: HiDocumentText , label: 'Bestellubersicht', href: '/dashboard/bestellubersicht' },
        { icon: HiCog, label: 'Settings', href: '/dashboard/settings' },
        { icon: HiUserGroup, label: 'Role Management', href: '/dashboard/role-management' },
        { icon: HiCube, label: 'Software Management', href: '/dashboard/software-management' },
        { icon: HiDocumentText, label: 'Suggestions', href: '/dashboard/suggestions' },
        { icon: Store, label: 'Store Management', href: '/dashboard/store-management' },
    ];

    const handleLogout = () => {
        logout()
        router.push('/login')

    }

    return (
        <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
            <div className="py-5 px-3 flex justify-between items-center border-b border-gray-400">
                <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>

            <nav className="mt-4 flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link href={item.href}>
                                    <span
                                        className={`flex items-center px-4 py-2 transition-colors duration-200
                                        ${isActive
                                                ? 'bg-blue-50 text-green-600 border-r-4 border-green-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-green-600' : ''}`} />
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout button */}
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer w-full px-4 py-2 text-gray-700 hover:bg-green-600 hover:text-white rounded-md transition-colors duration-300 group"
                >
                    {/* <HiArrowRightOnRectangle className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" /> */}
                    Logout
                </button>
            </div>
        </div>
    )
}
