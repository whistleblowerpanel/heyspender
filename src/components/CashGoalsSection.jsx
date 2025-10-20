"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const CashGoalCard = ({ goal, index, isLarge = false }) => {
  const progress = goal.target_amount > 0 ? (goal.amount_raised / goal.target_amount) * 100 : 0;
  
  // Format currency based on the amount
  const formatCurrency = (amount, currency = '₦') => {
    if (amount >= 1000000) {
      return `${currency}${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency}${(amount / 1000).toFixed(1)}K`;
    }
    return `${currency}${amount.toLocaleString()}`;
  };

  // Format spender count
  const formatSpenders = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K Spenders`;
    }
    return `${count} ${count === 0 || count === 1 ? 'Spender' : 'Spenders'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-brand-cream overflow-hidden lg:border lg:border-black ${
        isLarge ? 'h-full' : ''
      }`}
    >
      {/* Desktop layout - image on top, content below */}
      <div className={`hidden lg:flex lg:flex-col ${isLarge ? 'h-full' : ''}`}>
        {/* Image - occasion banner or gradient placeholder */}
        <div className={`relative ${isLarge ? 'flex-1 min-h-[200px]' : 'h-48'} bg-gradient-to-br from-brand-purple-dark to-brand-orange`}>
          {goal.wishlist?.cover_image_url ? (
            <img 
              src={goal.wishlist.cover_image_url} 
              alt={goal.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Placeholder image content */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className={`${isLarge ? 'w-20 h-20' : 'w-16 h-16'} mx-auto mb-2 bg-white/20 flex items-center justify-center`}>
                  <span className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold`}>💰</span>
                </div>
                <p className="text-sm opacity-90">Cash Goal</p>
              </div>
            </div>
          )}
          
          {/* Spenders overlay */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 text-[10px] font-medium">
            {formatSpenders(goal.contribution_count || 0)}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 mb-3 min-h-[3.5rem] flex-shrink-0" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {goal.title}
          </h3>
          
          {/* Progress bar */}
          <div className="mb-3 flex-shrink-0">
            <Progress value={progress} className="h-3" />
          </div>
          
          {/* Amount raised and goal on same line */}
          <div className="text-sm font-semibold text-gray-900 flex-shrink-0">
            {formatCurrency(goal.amount_raised || 0)} raised — <span className="text-gray-500 font-normal">Goal: {formatCurrency(goal.target_amount)}</span>
          </div>
        </div>
      </div>

      {/* Mobile layout - horizontal with image on left, content on right */}
      <div className="lg:hidden flex items-center">
        {/* Image - occasion banner or gradient placeholder */}
        <div className="relative w-[116px] h-[116px] bg-gradient-to-br from-brand-purple-dark to-brand-orange flex-shrink-0">
          {goal.wishlist?.cover_image_url ? (
            <img 
              src={goal.wishlist.cover_image_url} 
              alt={goal.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Placeholder image content */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-8 h-8 mx-auto mb-1 bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">💰</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Spenders overlay */}
          <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-0.5 text-[10px] font-medium">
            {formatSpenders(goal.contribution_count || 0)}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-base text-gray-900 mb-2 min-h-[2.5rem]" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {goal.title}
          </h3>
          
          {/* Progress bar */}
          <div className="mb-2">
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Amount raised and goal on same line */}
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(goal.amount_raised || 0)} raised — <span className="text-gray-500 font-normal">Goal: {formatCurrency(goal.target_amount)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CashGoalsSection = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPublicGoals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('goals')
          .select(`
            *,
            wishlist:wishlists!inner(
              id,
              title,
              slug,
              visibility,
              cover_image_url,
              user:users!inner(
                id,
                username,
                full_name,
                is_active
              )
            ),
            contributions(count)
          `)
          .eq('wishlist.visibility', 'public')
          .eq('wishlist.user.is_active', true)
          .gt('target_amount', 0)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching goals:', error);
          return;
        }

        // Transform data to include contribution count
        const transformedGoals = data?.map(goal => ({
          ...goal,
          contribution_count: goal.contributions?.[0]?.count || 0
        })) || [];

        setGoals(transformedGoals);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicGoals();
  }, []);

  const visibleGoals = goals.slice(currentIndex, currentIndex + 5);
  const canGoNext = currentIndex + 5 < goals.length;
  const canGoPrev = currentIndex > 0;
  
  // Split visible goals: first one is large, rest are in 2x2 grid
  const largeGoal = visibleGoals[0];
  const gridGoals = visibleGoals.slice(1, 5);

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-b-2 border-brand-purple-dark"></div>
          </div>
        </div>
      </section>
    );
  }

  if (goals.length === 0) {
    return null;
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-brand-purple">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Header */}
          <div className="mb-8 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-0">
              Discover cash goals inspired by what you care about
            </h2>
            
            {/* Navigation arrows - desktop only (inline with title) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`font-semibold border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 p-3 bg-brand-green text-black ${
                  !canGoPrev ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`font-semibold border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 p-3 bg-brand-green text-black ${
                  !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Goals grid - Vertical stack on mobile, large card + 2x2 grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Desktop layout */}
          <div className="hidden lg:contents">
            {/* Large card on the left */}
            {largeGoal && largeGoal.wishlist?.user?.username && (
              <div className="h-full">
                <Link
                  href={`/${largeGoal.wishlist.user.username}/${largeGoal.wishlist.slug || 'goals'}`}
                  className="block h-full"
                >
                  <CashGoalCard goal={largeGoal} index={0} isLarge={true} />
                </Link>
              </div>
            )}
            
            {/* 2x2 grid on the right */}
            <div className="grid grid-cols-2 gap-4">
              {gridGoals.filter(goal => goal.wishlist?.user?.username).map((goal, index) => (
                <Link
                  key={goal.id}
                  href={`/${goal.wishlist.user.username}/${goal.wishlist.slug || 'goals'}`}
                  className="block"
                >
                  <CashGoalCard goal={goal} index={index + 1} isLarge={false} />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile layout - vertical stack */}
          <div className="lg:hidden space-y-4">
            {visibleGoals.filter(goal => goal.wishlist?.user?.username).map((goal, index) => (
              <Link
                key={goal.id}
                href={`/${goal.wishlist.user.username}/${goal.wishlist.slug || 'goals'}`}
                className="block"
              >
                <CashGoalCard goal={goal} index={index} isLarge={false} />
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile navigation - below cards */}
        <div className="sm:hidden flex items-center gap-2 mt-6">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`font-semibold border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 p-3 bg-brand-green text-black ${
              !canGoPrev ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`font-semibold border-2 border-black shadow-none hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 p-3 bg-brand-green text-black ${
              !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* View more button */}
        {goals.length > 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-brand-purple-dark text-white font-medium hover:bg-brand-purple-dark/90 transition-colors duration-200"
            >
              View All Cash Goals
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CashGoalsSection;
