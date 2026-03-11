'use client'

import React, { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  X,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'

interface AdminHeaderProps {
  currentPath?: string
  profileDropdownOpen?: boolean
  setProfileDropdownOpen?: (open: boolean) => void
  menuOpen?: boolean
  setMenuOpen?: (open: boolean) => void
}

export const AdminHeader = ({ 
  currentPath = '', 
  profileDropdownOpen: externalProfileOpen,
  setProfileDropdownOpen: externalSetProfileOpen,
  menuOpen: externalMenuOpen,
  setMenuOpen: externalSetMenuOpen
}: AdminHeaderProps) => {
  const [internalProfileOpen, setInternalProfileOpen] = useState(false)
  const [internalMenuOpen, setInternalMenuOpen] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const profileDropdownOpen = externalProfileOpen !== undefined ? externalProfileOpen : internalProfileOpen
  const setProfileDropdownOpen = externalSetProfileOpen || setInternalProfileOpen
  const menuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen
  const setMenuOpen = externalSetMenuOpen || setInternalMenuOpen

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (profileDropdownOpen && !target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileDropdownOpen, setProfileDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:block"
          >
            {menuOpen ? (
              <X size={20} className="text-gray-300" />
            ) : (
              <Menu size={20} className="text-gray-300" />
            )}
          </button>
          
          <Link href="/admin/products" className="flex items-center space-x-2">
            <img src="/wig.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="text-white font-semibold text-lg">Wigga</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative">
            <Bell size={20} className="text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <img 
                src="/avatar_default.png" 
                alt="Admin Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
              />
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {profileDropdownOpen && (
              <>
                {/* Blur Overlay */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/avatar_default.png" 
                        alt="Admin Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                      />
                      <div>
                        <p className="text-white font-medium">
                          Admin
                        </p>
                        <p className="text-gray-400 text-sm">admin@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Log out is disabled (no auth configured).
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
