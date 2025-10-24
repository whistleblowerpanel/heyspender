"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Gift, Plus, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';
import { updatePageSocialMedia } from '@/lib/pageSEOConfig';
import { updateAllSEOTags, generateProfileSEOData } from '@/lib/seoUtils';
import { getUserFriendlyError } from '@/lib/utils';

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const { user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('id, full_name, username, created_at, role, avatar_url')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        toast({
          variant: 'destructive',
          title: 'Profile not found',
          description: 'The user profile you are looking for does not exist.',
        });
        router.push('/');
        return;
      }
      setProfile(profileData);

      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (wishlistError) {
        console.error('Error fetching wishlists:', wishlistError);
        toast({
          variant: 'destructive',
          title: 'Error fetching wishlists',
          description: getUserFriendlyError(wishlistError, 'loading wishlists'),
        });
      } else {
        setWishlists(wishlistData || []);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: getUserFriendlyError(error, 'loading profile'),
      });
    } finally {
      setLoading(false);
    }
  }, [username, router, toast]);

  useEffect(() => {
    const mainRoutes = ["register", "login", "verify", "admin", "dashboard", "wishlists", "auth"];
    if (username && !mainRoutes.includes(username)) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [username, fetchProfileData]);

  // Comprehensive SEO meta tags
  useEffect(() => {
    if (profile && wishlists) {
      const baseUrl = 'https://heyspender.com';
      const seoData = generateProfileSEOData(profile, wishlists, baseUrl);
      
      // Update all SEO tags including structured data
      updateAllSEOTags(seoData);
      
      // Also update legacy social media tags for compatibility
      const profileUrl = `/${username}`;
      const customSEO = {
        title: seoData.title,
        description: seoData.description,
        image: seoData.image,
        keywords: seoData.keywords
      };
      updatePageSocialMedia(profileUrl, customSEO);
    }
  }, [profile, wishlists, username]);

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
            <Button onClick={() => router.push('/')} variant="custom" className="bg-brand-purple text-white">
              Go Home
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isOwner = authUser && authUser.id === profile.id;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <header className="relative h-[500px] bg-brand-purple-dark flex items-end justify-center text-center p-4 pt-28">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center text-center space-y-4 mb-8 text-white"
          >
            <div className="w-28 h-28 flex items-center justify-center border-4 border-black bg-brand-green">
              <User className="w-16 h-16 text-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold drop-shadow-lg">{profile.full_name}</h1>
            <p className="text-white/80 drop-shadow-md">@{profile.username}</p>
          </motion.div>
        </header>
        
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-purple-dark">Wishlists</h2>
            {isOwner && (
              <Button 
                onClick={() => router.push('/dashboard/wishlist/')} 
                variant="custom" 
                className="bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manage Wishlists
              </Button>
            )}
          </div>

          {wishlists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 border-2 border-dashed border-gray-300"
            >
              <Gift className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {isOwner ? "You have no wishlists yet" : `${profile.full_name} has no public wishlists`}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {isOwner ? "Go to your dashboard to create one!" : "Check back later!"}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist: any) => (
                <Link href={`/${profile.username}/${wishlist.slug}`} key={wishlist.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-black p-4 flex flex-col space-y-4 h-full bg-white hover:shadow-[-4px_4px_0px_#161B47] transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="relative aspect-square bg-gray-100 mb-2 h-[250px]">
                      {wishlist.cover_image_url ? (
                        <img 
                          alt={wishlist.title} 
                          src={wishlist.cover_image_url} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold truncate">{wishlist.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{wishlist.occasion}</p>
                      {wishlist.wishlist_date && (
                        <p className="text-sm text-gray-500">
                          {format(new Date(wishlist.wishlist_date), 'PPP')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
