'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'users', label: 'User Management', path: '/users' },
  { id: 'chat', label: 'Chat GPT', path: '/chat' },
];

const ChatGPT = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('chat');
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (content) => {
    if (content.includes('```')) {
      const parts = content.split(/(```[a-zA-Z]*\n[\s\S]*?\n```)/g);
      return parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```([a-zA-Z]*)\n([\s\S]*?)\n```/);
          if (match) {
            const [, language, code] = match;
            return (
              <div key={index} className="my-4 rounded-md overflow-hidden">
                <div className="bg-gray-800 text-gray-200 px-4 py-1 text-sm flex justify-between items-center">
                  <span>{language || 'code'}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="text-gray-400 hover:text-white text-sm py-1 px-2 rounded"
                  >
                    Copy
                  </button>
                </div>
                <Highlight className={language || 'plaintext'}>
                  {code}
                </Highlight>
              </div>
            );
          }
        }
        return <p key={index} className="whitespace-pre-wrap mb-2">{part}</p>;
      });
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Chat GPT</h2>
          </div>
        </header>

        {/* Chat Interface */}
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {typeof message.content === 'string' 
                        ? formatMessage(message.content)
                        : message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatGPT;