"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Twitter, Instagram, Facebook, Youtube, Monitor, Sun, Moon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeTheme, setActiveTheme] = useState('system');

  return (
    <footer className="mt-auto bg-brand-purple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center cursor-pointer">
              <img src="/HeySpenderMedia/General/HeySpender Logoo.webp" alt="HeySpender" className="h-18 sm:h-20" />
            </Link>
            <p className="mt-4 text-sm text-white/80 max-w-sm sm:max-w-md">
              Build thoughtful wishlists, accept contributions securely, and celebrate with the people you love.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>by ExpressCreo</span>
            </div>
          </div>

          {/* Product */}
          <div className="ml-8 lg:ml-12">
            <p className="font-semibold text-white mb-3">Product</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/explore" className="hover:text-white">Explore</Link></li>
              <li><Link href="/dashboard/wishlist" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="ml-8">
            <p className="font-semibold text-white mb-3">Company</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Theme */}
          <div className="ml-8">
            <p className="font-semibold text-white mb-2 text-sm">THEME</p>
            <div className="flex items-center gap-2">
              <button 
                className={`flex items-center justify-center w-4 h-4 transition-all duration-200 ${activeTheme === 'system' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                onClick={() => setActiveTheme('system')}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                className={`flex items-center justify-center w-4 h-4 transition-all duration-200 ${activeTheme === 'light' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                onClick={() => setActiveTheme('light')}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                className={`flex items-center justify-center w-4 h-4 transition-all duration-200 ${activeTheme === 'dark' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                onClick={() => setActiveTheme('dark')}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white/80">
            <a href="#" aria-label="X" className="hover:text-white"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="w-4 h-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube className="w-4 h-4" /></a>
          </div>
          <p className="text-sm text-white/70">© {currentYear} HeySpender. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;