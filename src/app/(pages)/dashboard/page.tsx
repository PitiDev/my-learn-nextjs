'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  // Protect dashboard route
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'users', label: 'User Management', path: '/users' },
    { id: 'chat', label: 'Chat GPT', path: '/chat' },

    // Add more menu items here
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.id);
                      router.push(item.path);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeMenu === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="mb-2 text-sm text-gray-600">{userEmail}</div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Total Users</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">1,234</div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Active Projects</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">12</div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500">Revenue</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">$12,345</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-1 md:col-span-3 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="ml-3 text-gray-600">Activity item {item}</span>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;