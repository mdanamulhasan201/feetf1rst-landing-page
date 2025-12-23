'use client'
import React from 'react'
import { FiMenu } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Image from 'next/image'

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 md:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center">
          {user && (
            <div className="relative h-12 w-12 rounded-full p-1 border">
              {user.image ? (
                <Image
                  src={user.image.startsWith('http://') || user.image.startsWith('https://') || user.image.startsWith('/') 
                    ? user.image 
                    : `https://${user.image}`}
                  alt={user?.name || 'User avatar'}
                  width={100}
                  height={100}
                  className="rounded-full  h-full w-full "
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  {(user?.name || 'U').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
