"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Settings as SettingsIcon, 
  LogOut, 
  X,
  Menu,
  ChevronDown,
  ArrowLeft,
  ShoppingBag,
  Edit
} from 'lucide-react';
import { recentActivityOrders } from '../constants';
import Link from 'next/link';
import Image from 'next/image';
// AdminLayout imported previously but unused; removed
import { AdminSideMenu } from '@/components/admin/admin-side-menu';
import { uploadToCloudinary } from '@/lib/cloudinary';

const AdminSettings = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [name, setName] = useState('Admin');
  const [profilePhoto, setProfilePhoto] = useState('/avatar_default.png');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Handle photo file selection and upload to Cloudinary
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB.');
        return;
      }

      setIsUploadingPhoto(true);
      try {
        // Upload to Cloudinary
        const { url } = await uploadToCloudinary(file);
        setProfilePhoto(url);
        console.log('Photo uploaded successfully:', url);
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Save all changes
  const handleSaveAllChanges = async () => {
    const settingsData = {
      name,
      profilePhoto,
      phoneNumber, // Include phone number in saved data
    };

    try {
      // Here you would typically make an API call to save the data
      // For now, we'll simulate saving with localStorage and show success
      localStorage.setItem('adminSettings', JSON.stringify(settingsData));
      
      // Show success message
      alert('All changes saved successfully!');
      
      console.log('Settings saved:', settingsData);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  // Set current path and load saved settings on mount
  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setProfilePhoto(settings.profilePhoto || '/avatar_default.png');
        setPhoneNumber(settings.phoneNumber || '');
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Menu size={20} className="text-gray-300" />
          </button>

          <Link href="/admin/products" className="flex items-center space-x-2">
            <Image src="/wig.png" alt="Logo" width={32} height={32} className="h-8 w-auto object-contain" />
            <span className="text-white font-semibold text-lg">Wigga</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors relative" onClick={() => setNotificationModalOpen(true)}>
              <Bell size={20} className="text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative profile-dropdown">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <img src="/avatar_default.png" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown size={16} className="text-gray-300" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-gray-600 font-medium truncate">Admin</p>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <SettingsIcon size={16} className="mr-3" />
                    <span>Account Settings</span>
                  </Link>
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    Log out is disabled (no auth configured).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        ></div>
        <div className="absolute left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link href="/admin/products" className="flex items-center space-x-2">
              <Image src="/wig.png" alt="Logo" width={32} height={32} className="h-8 w-auto object-contain" />
              <span className="text-white font-semibold text-lg">Wigga</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-300" />
            </button>
          </div>

          <nav className="p-4">
            <Link
              href="/"
              className="flex items-center p-3 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors group"
              onClick={() => setMenuOpen(false)}
            >
              <ArrowLeft size={20} className="min-w-[20px]" />
              <span className="ml-3 font-medium">Back to Store</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center p-3 mb-2 rounded-lg transition-colors group ${
                pathname === '/admin/products'
                  ? 'bg-slate-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingBag size={20} className="min-w-[20px]" />
              <span className="ml-3 font-medium">Products</span>
            </Link>

            <Link
              href="/admin/settings"
              className={`flex items-center p-3 mb-2 rounded-lg transition-colors group ${
                pathname === '/admin/settings'
                  ? 'bg-slate-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <SettingsIcon size={20} className="min-w-[20px]" />
              <span className="ml-3 font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      <AdminSideMenu 
        currentPath={pathname || ''}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="pt-16 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
            
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt="Admin Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={triggerFileInput}
                    disabled={isUploadingPhoto}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isUploadingPhoto 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isUploadingPhoto ? 'Uploading...' : 'Select New Photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={isUploadingPhoto}
                    className="hidden"
                  />
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

                {/* Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <div className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                      admin@example.com
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                    <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>
      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSaveAllChanges}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          Save All Changes
        </button>
      </div>
      {/* Notification Modal */}
      {notificationModalOpen && (
        <>
          {/* Blur Overlay */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setNotificationModalOpen(false)}
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="notification-modal bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                  <button
                    onClick={() => setNotificationModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                {/* Modal Body - Scrollable */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {recentActivityOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img src={order.productImage} alt="Product" className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="text-white font-medium">{order.productName}</p>
                            <p className="text-gray-400 text-sm">From: {order.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 text-sm">
                            {order.firstName}<br />
                            {order.lastName}
                          </p>
                          <p className="text-green-400 text-xs">{order.status}</p>
                          <p className="text-gray-500 text-xs">{order.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </>
      )}
    </main>
  </div>
  );
};

export default AdminSettings;
