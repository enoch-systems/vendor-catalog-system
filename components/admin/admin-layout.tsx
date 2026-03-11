'use client'

import React, { useState } from 'react'
import { AdminHeader } from './admin-header'
import { AdminSideMenu } from './admin-side-menu'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export const AdminLayout = ({ children, currentPath = '' }: AdminLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader
        currentPath={currentPath}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <AdminSideMenu
        currentPath={currentPath}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="pt-16 p-6">
        {children}
      </main>
    </div>
  )
}
