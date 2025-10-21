"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, User, LogOut, LayoutGrid, Sparkles, Loader2, Wallet, Users, Gift, CreditCard, ArrowUpDown, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserFriendlyError } from '@/lib/utils';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin');
  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple sign out attempts
    
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign Out Error',
          description: JSON.stringify(error)
        });
        console.error('Sign out error:', error);
      }
      
      // Smart redirect: if on dashboard or admin page, redirect to homepage; otherwise stay on current page
      const currentPath = window.location.pathname;
      const isDashboardPage = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin');
      
      // Small delay to ensure auth state is updated before navigation
      setTimeout(() => {
        if (isDashboardPage) {
          router.push('/'); // Redirect to homepage if on dashboard or admin
        }
        // Otherwise stay on current page (no redirect)
      }, 100);
    } catch (error) {
      // This should rarely happen now with the improved error handling
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: JSON.stringify(error)
      });
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };
  
  return <>
      <header className="fixed top-4 left-4 right-4 z-[9999] w-auto">
        <nav className={`max-w-7xl mx-auto text-white border-2 border-black flex justify-between items-center h-[4.5rem] px-4 transition-all duration-300 backdrop-blur-sm ${
          isScrolled 
            ? 'bg-brand-purple-dark/90' 
            : 'bg-brand-purple-dark/95'
        }`}>
          <Link href="/" className="flex items-center group">
            <img src="/HeySpenderMedia/General/HeySpender Logoo.webp" alt="HeySpender Logo" className="h-10" />
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Button onClick={() => router.push('/explore')} variant="custom" className="bg-[#E94B29] text-white cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Wishlists
            </Button>
            {user ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="custom" className="relative h-10 w-10 p-0 bg-brand-green cursor-pointer">
                       <User className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 z-[100000]" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email || user.phone}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Admin pages dropdown */}
                    {isAdmin && isAdminPage ? (
                      <>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/users')}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Users</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/wishlists')}>
                          <Gift className="mr-2 h-4 w-4" />
                          <span>Wishlists</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/payouts')}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Payouts</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/transactions')}>
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          <span>Transactions</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/notifications')}>
                          <Bell className="mr-2 h-4 w-4" />
                          <span>Notifications</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/dashboard/settings')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      /* Regular user pages dropdown */
                      <>
                        <DropdownMenuItem onClick={() => router.push(isAdmin ? '/admin/dashboard/users' : '/dashboard/wishlist/')}>
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/wallet')}>
                          <Wallet className="mr-2 h-4 w-4" />
                          <span>Wallet</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${user.user_metadata.username}`)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                      {isSigningOut ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Signing out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button onClick={() => router.push('/auth/login')} variant="custom" className="bg-brand-green text-black cursor-pointer">
                  <span>Login</span>
                </Button>
                <Button onClick={() => router.push('/auth/register')} variant="custom" className="bg-brand-orange text-black cursor-pointer">
                  <span>Create Wishlist</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          <Button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            variant="custom" 
            className="md:hidden h-10 w-10 p-0 bg-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-black" strokeWidth={2.5} /> : <Menu className="w-6 h-6 text-black" strokeWidth={2.5} />}
          </Button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9997] md:hidden bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Sliding Menu Panel */}
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed top-0 right-0 bottom-0 z-[9998] w-[85vw] max-w-sm md:hidden bg-brand-purple-dark border-l-2 border-black shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-32 space-y-6">
                  {/* Featured Action - Explore */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
                  >
                    <button
                      onClick={() => { router.push('/explore'); setMobileMenuOpen(false); }}
                      className="group relative w-full bg-brand-orange p-5 transition-all duration-300 active:scale-[0.98] border-2 border-black"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-white/10">
                            <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-bold text-white">Explore Wishlists</p>
                            <p className="text-xs text-white/80 font-medium">Discover amazing wishes</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                      </div>
                    </button>
                  </motion.div>

                  {/* Navigation Items */}
                  {user ? (
                    <div className="space-y-2">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-xs font-bold text-white/40 uppercase tracking-wider px-1 mb-3"
                      >
                        Your Account
                      </motion.p>
                      
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => {
                          router.push(user.user_metadata?.role === 'admin' ? '/admin/dashboard' : '/dashboard/wishlist/');
                          setMobileMenuOpen(false);
                        }}
                        className="group w-full flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98] border border-white/10 hover:border-white/20"
                      >
                        <div className="w-11 h-11 flex items-center justify-center bg-brand-green group-hover:scale-110 transition-transform ">
                          <LayoutGrid className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-base font-bold text-white">Dashboard</p>
                          <p className="text-xs text-white/60 font-medium">Manage your wishlists</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        onClick={() => {
                          router.push('/dashboard/wallet');
                          setMobileMenuOpen(false);
                        }}
                        className="group w-full flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98] border border-white/10 hover:border-white/20"
                      >
                        <div className="w-11 h-11 flex items-center justify-center bg-brand-green group-hover:scale-110 transition-transform ">
                          <Wallet className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-base font-bold text-white">Wallet</p>
                          <p className="text-xs text-white/60 font-medium">View your balance</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => {
                          router.push(`/${user.user_metadata.username}`);
                          setMobileMenuOpen(false);
                        }}
                        className="group w-full flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-[0.98] border border-white/10 hover:border-white/20"
                      >
                        <div className="w-11 h-11 flex items-center justify-center bg-brand-green group-hover:scale-110 transition-transform ">
                          <User className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-base font-bold text-white">{user.user_metadata?.full_name || user.email || 'Profile'}</p>
                          <p className="text-xs text-white/60 font-medium">View public profile</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                      </motion.button>

                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-xs font-bold text-white/40 uppercase tracking-wider px-1 mb-3"
                      >
                        Get Started
                      </motion.p>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                        onClick={() => {
                          router.push('/auth/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-4 px-6 bg-brand-green hover:bg-brand-green/90 transition-all duration-300 active:scale-[0.98] border-2 border-black group"
                      >
                        <span className="text-lg font-bold text-black group-hover:scale-105 inline-block transition-transform">Login</span>
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35, type: 'spring', stiffness: 150 }}
                        onClick={() => {
                          router.push('/auth/register');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-brand-orange hover:bg-brand-orange/90 transition-all duration-300 active:scale-[0.98] border-2 border-black group"
                      >
                        <span className="text-lg font-bold text-black">Create Wishlist</span>
                        <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Log Out Button at Bottom - Only shown when user is logged in */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="px-6 py-6 border-t-2 border-white/10"
                  >
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isSigningOut}
                      className="group w-full flex items-center space-x-4 p-4 bg-brand-salmon/10 hover:bg-brand-salmon/20 transition-all duration-300 active:scale-[0.98] border border-brand-salmon/30 hover:border-brand-salmon/50"
                    >
                      <div className="w-11 h-11 flex items-center justify-center bg-brand-salmon group-hover:scale-110 transition-transform">
                        {isSigningOut ? (
                          <Loader2 className="w-6 h-6 text-black animate-spin" strokeWidth={2.5} />
                        ) : (
                          <LogOut className="w-6 h-6 text-black" strokeWidth={2.5} />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-base font-bold text-white">
                          {isSigningOut ? 'Signing out...' : 'Log Out'}
                        </p>
                        <p className="text-xs text-white/60 font-medium">Sign out of account</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>;
};

export default Navbar;