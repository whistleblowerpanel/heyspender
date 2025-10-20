"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Twitter, Instagram, Facebook, Youtube, Monitor, Sun, Moon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeTheme, setActiveTheme] = useState('system');

  return (
    <footer className="mt-auto bg-brand-purple">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center">
              <img src="/HeySpenderMedia/General/HeySpender Logoo.webp" alt="HeySpender" className="h-18 sm:h-20" />
            </div>
            <p className="mt-4 text-sm text-white/80 max-w-sm sm:max-w-md">
              Build thoughtful wishlists, accept contributions securely, and celebrate with the people you love.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>by ExpressCreo</span>
            </div>
          </div>

          {/* Links: Product */}
          <div>
            <p className="font-semibold text-white mb-3">Product</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <p className="font-semibold text-white mb-3">Company</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Theme Selection */}
          <div>
            <p className="font-semibold text-white mb-3">Theme</p>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTheme('system')}
                className={`w-10 h-10 border-2 border-black shadow-[-2px_2px_0px_#161B47] flex items-center justify-center transition-all duration-200 ${
                  activeTheme === 'system' ? 'bg-brand-green' : 'bg-white'
                }`}
              >
                <Monitor className={`w-5 h-5 ${activeTheme === 'system' ? 'text-black' : 'text-brand-green'}`} />
              </button>
              <button
                onClick={() => setActiveTheme('light')}
                className={`w-10 h-10 border-2 border-black shadow-[-2px_2px_0px_#161B47] flex items-center justify-center transition-all duration-200 ${
                  activeTheme === 'light' ? 'bg-brand-green' : 'bg-white'
                }`}
              >
                <Sun className={`w-5 h-5 ${activeTheme === 'light' ? 'text-black' : 'text-brand-green'}`} />
              </button>
              <button
                onClick={() => setActiveTheme('dark')}
                className={`w-10 h-10 border-2 border-black shadow-[-2px_2px_0px_#161B47] flex items-center justify-center transition-all duration-200 ${
                  activeTheme === 'dark' ? 'bg-brand-green' : 'bg-white'
                }`}
              >
                <Moon className={`w-5 h-5 ${activeTheme === 'dark' ? 'text-black' : 'text-brand-green'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-white/60">
              © {currentYear} HeySpender. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;