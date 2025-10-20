"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Gift, Image as ImageIcon, Grid2X2, List } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ExplorePage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set responsive default view - grid for desktop, list for mobile
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 'grid' : 'list'; // lg breakpoint
    }
    return 'list'; // fallback
  });

  useEffect(() => {
    const fetchPublicWishlists = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*, user:users!inner(username, full_name, is_active)')
          .eq('visibility', 'public')
          .eq('user.is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching wishlists:', error);
          setError(error.message || 'Failed to load wishlists');
        } else {
          setWishlists(data || []);
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      setLoading(false);
    };

    fetchPublicWishlists();
  }, []);

  // Handle window resize to maintain responsive default view
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      const currentView = viewMode;
      
      // If user hasn't manually changed the view, update based on screen size
      if (isDesktop && currentView === 'list') {
        setViewMode('grid');
      } else if (!isDesktop && currentView === 'grid') {
        setViewMode('list');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  return (
    <>
      <Navbar />
      
      <header className="relative h-[500px] bg-brand-green flex items-center justify-center text-center p-4 pt-28 overflow-hidden">
        {/* Beautiful geometric pattern with floating elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-15" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='gift-pattern' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='3' fill='%23000000' opacity='0.3'/%3E%3Ccircle cx='80' cy='20' r='2' fill='%23000000' opacity='0.2'/%3E%3Ccircle cx='20' cy='80' r='2' fill='%23000000' opacity='0.2'/%3E%3Ccircle cx='80' cy='80' r='3' fill='%23000000' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='1.5' fill='%23000000' opacity='0.4'/%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='%23000000' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M25 25 L75 25 L75 75 L25 75 Z' fill='none' stroke='%23000000' stroke-width='0.3' opacity='0.15'/%3E%3Cpath d='M40 40 L60 40 L60 60 L40 60 Z' fill='none' stroke='%23000000' stroke-width='0.2' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23gift-pattern)'/%3E%3C/svg%3E")`}} />
        
        {/* Additional floating geometric shapes for depth */}
        <div className="absolute top-10 left-10 w-16 h-16 border border-black/10 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-8 h-8 bg-black/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-black/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-6 h-6 bg-black/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-black/5"></div>
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-black drop-shadow-lg">HeySpender! Are you feeling generous today?</h1>
          <p className="text-lg text-black/80 drop-shadow-md">Fulfill someone's wishlist!</p>
        </div>
      </header>

      <div className="px-4">
        <main className="max-w-7xl mx-auto py-12">
          {/* View Toggle Section */}
          {!loading && !error && wishlists.length > 0 && (
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-purple-dark">Public Wishlists</h2>
              
              {/* View Toggle Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'custom' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-brand-purple-dark text-white' : 'border-gray-300'} h-9 w-9 p-0`}
                >
                  <Grid2X2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'custom' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-brand-purple-dark text-white' : 'border-gray-300'} h-9 w-9 p-0`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[40vh]">
              <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
            </div>
          ) : error ? (
            <div className="text-center py-16 px-8 border-2 border-dashed border-red-300 bg-red-50">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-red-800">Connection Error</h3>
              <p className="mt-2 text-sm text-red-600 max-w-md mx-auto">{error}</p>
              <Button 
                variant="custom" 
                className="mt-4 bg-red-600 text-white hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : wishlists.length === 0 ? (
            <div className="text-center py-16 px-8 border-2 border-dashed border-gray-300">
              <Gift className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold">No public wishlists yet</h3>
              <p className="mt-2 text-sm text-gray-500">Check back later or be the first to make your wishlist public!</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlists.map(wishlist => (
                    <Link href={`/${wishlist.user.username}/${wishlist.slug}`} key={wishlist.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden border-2 border-black flex flex-col h-full"
                      >
                        {/* Portrait card layout - vertical for grid view */}
                        <div className="flex flex-col h-full">
                          {/* Image */}
                          <div className="relative h-48 bg-gray-100">
                            {wishlist.cover_image_url ?
                              <img alt={wishlist.title} src={wishlist.cover_image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-12 h-12" /></div>
                            }
                            
                            {/* Date tag on top right - hidden on mobile */}
                            {wishlist.wishlist_date && (
                              <div className="hidden md:block absolute top-3 right-3 bg-white text-black px-2 py-1 text-xs font-medium border border-black">
                                {format(new Date(wishlist.wishlist_date), "MMM. d, yyyy")}
                              </div>
                            )}
                          </div>

                          {/* Card content */}
                          <div className="p-4 flex flex-col">
                            <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
                              {wishlist.title}
                            </h3>
                            
                            <div className="text-sm text-gray-600 mb-3 flex-shrink-0">
                              By <Link href={`/${wishlist.user.username}`} className="font-bold hover:text-brand-purple-dark transition-colors" onClick={(e) => e.stopPropagation()}>@{wishlist.user.username}</Link>
                              {/* Date beside username - only on mobile */}
                              {wishlist.wishlist_date && <span className="md:hidden"> — {format(new Date(wishlist.wishlist_date), "MMM. d, yyyy")}</span>}
                            </div>
                            
                            <Button variant="custom" className="bg-brand-green text-black w-full mt-auto">View Wishlist</Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlists.map(wishlist => (
                    <Link href={`/${wishlist.user.username}/${wishlist.slug}`} key={wishlist.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden"
                      >
                        <div className="flex items-center">
                          {/* Image - same size as mobile grid view */}
                          <div className="relative w-[116px] h-[116px] bg-gray-100 flex-shrink-0">
                            {wishlist.cover_image_url ?
                              <img alt={wishlist.title} src={wishlist.cover_image_url} className="absolute inset-0 w-full h-full object-cover" /> :
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                            }
                          </div>

                          {/* Content */}
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                              {wishlist.title}
                            </h3>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              By <Link href={`/${wishlist.user.username}`} className="font-bold hover:text-brand-purple-dark transition-colors" onClick={(e) => e.stopPropagation()}>@{wishlist.user.username}</Link>
                              {/* Date beside username - always shown in list view */}
                              {wishlist.wishlist_date && <span> — {format(new Date(wishlist.wishlist_date), "MMM. d, yyyy")}</span>}
                            </div>
                            
                            <Button variant="custom" className="bg-brand-green text-black w-full text-xs py-2 h-auto">View Wishlist</Button>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      <Footer />
    </>
  );
};

export default ExplorePage;