"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, Plus, X as XIcon, Check, Cake, Heart, Baby, GraduationCap, Home, HeartHandshake, Gift, PartyPopper } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const sampleWishlists = [
  { title: "My Birthday Wishlist", occasion: "Birthday" },
  { title: "Wedding Registry", occasion: "Wedding" },
  { title: "Baby Shower Dreams", occasion: "Baby" },
  { title: "Graduation Goals", occasion: "Graduation" },
  { title: "Holiday Wishes", occasion: "Just Because" }
];

const GetStartedPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Typing animation for welcome card
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const steps = [
    { title: 'Welcome', description: "Let's set up your first wishlist" },
    { title: 'Title', description: 'What should we call your wishlist?' },
    { title: 'Occasion', description: 'Is this for a special occasion?' },
    { title: 'Date', description: 'When would you love to receive these gifts?' },
    { title: 'Story', description: 'Tell your Spenders why this wishlist matters.' },
    { title: 'Cover', description: 'Choose a beautiful cover photo' },
    { title: 'Privacy', description: 'Who can see your wishlist?' },
    { title: 'Wishlist Items & Goals', description: 'Add your first wishlist items or cash goals' }
  ];

  const occasions = [
    { name: 'Birthday', icon: Cake, value: 'birthday' },
    { name: 'Wedding', icon: Heart, value: 'wedding' },
    { name: 'Baby', icon: Baby, value: 'other' },
    { name: 'Graduation', icon: GraduationCap, value: 'graduation' },
    { name: 'Housewarming', icon: Home, value: 'other' },
    { name: 'Charity', icon: HeartHandshake, value: 'other' },
    { name: 'Just Because', icon: Sparkles, value: 'other' },
    { name: 'Other', icon: Gift, value: 'other' },
    { name: 'No occasion', icon: PartyPopper, value: null }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Typing animation effect
  useEffect(() => {
    if (currentStep !== 0) return;

    const currentWishlist = sampleWishlists[titleIndex];
    const currentTitle = currentWishlist.title;
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseAfterComplete = 2000;
    const pauseAfterDelete = 500;

    const timer = setTimeout(() => {
      if (!isDeleting && typedTitle.length < currentTitle.length) {
        setTypedTitle(currentTitle.substring(0, typedTitle.length + 1));
      } else if (!isDeleting && typedTitle.length === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseAfterComplete);
      } else if (isDeleting && typedTitle.length > 0) {
        setTypedTitle(currentTitle.substring(0, typedTitle.length - 1));
      } else if (isDeleting && typedTitle.length === 0) {
        setIsDeleting(false);
        setTitleIndex((prevIndex) => (prevIndex + 1) % sampleWishlists.length);
        setTimeout(() => {}, pauseAfterDelete);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedTitle, isDeleting, titleIndex, currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Simulate wishlist creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/dashboard/wishlist/');
    } catch (error) {
      console.error('Error creating wishlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-sm bg-white border-2 border-black">
              <div className="h-32 bg-gradient-to-br from-brand-purple-light to-brand-purple-dark relative">
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white opacity-70" />
                </div>
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 border border-black">
                    Live
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 border border-black">
                    Unlisted
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 min-h-[28px]">
                    {typedTitle}
                    <span className="animate-pulse">|</span>
                  </h3>
                  <span className="inline-block px-3 py-1 bg-brand-purple-light text-brand-purple-dark text-sm font-medium border border-brand-purple-dark">
                    {sampleWishlists[titleIndex].occasion}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Due December 25, 2024
                </div>

                <div className="space-y-3 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items Progress</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-brand-green h-3 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500">3 of 5 items fulfilled</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-sm mb-4">
                  <div className="bg-green-50 p-3 border border-black">
                    <div className="font-bold text-lg text-gray-900">5</div>
                    <div className="text-gray-600 text-xs">Items</div>
                  </div>
                  <div className="bg-orange-50 p-3 border border-black">
                    <div className="font-bold text-lg text-gray-900">₦50,000</div>
                    <div className="text-gray-600 text-xs">Cash Goals</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Wishlist Title - e.g. My Birthday Wishlist, Wedding Registry"
                className="w-full bg-white border border-gray-300 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-brand-purple-dark"
                maxLength={60}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {occasions.map(occasion => (
                <motion.div
                  key={occasion.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative p-4 border-2 border-black rounded-lg cursor-pointer transition-all bg-white hover:shadow-[-2px_2px_0px_0px_rgba(22,27,71,1)]"
                >
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="mb-3">
                      <occasion.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">{occasion.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <div>
                    <span className="font-medium text-gray-900">No specific date</span>
                    <p className="text-sm text-gray-500">Flexible timing</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <div>
                    <span className="font-medium text-gray-900">Specific date</span>
                    <p className="text-sm text-gray-500">Set an exact date</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Your Story (Optional)
              </label>
              <textarea
                placeholder="Share what makes this wishlist special..."
                className="w-full bg-white border border-gray-300 text-gray-900 min-h-[100px] rounded-lg focus:outline-none focus:border-brand-purple-dark p-4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Wishlists with stories encourage and boost spenders to fulfill their wishes. 
                Share your journey and help spenders connect with your goals.
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-gray-600 text-sm">
              Choose a beautiful cover photo that represents your wishlist and makes it stand out to your supporters.
            </p>
            
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Cover Photo
              </label>
              <div className="mt-1">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Upload cover photo</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Visibility Settings
              </label>
              <select className="w-full bg-white border border-gray-300 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-brand-purple-dark">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <button 
                type="button"
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Add Wishlist Item</p>
                    <p className="text-sm text-gray-500">Physical items you'd love to receive</p>
                  </div>
                </div>
              </button>
              
              <button 
                type="button"
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Plus className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Add Cash Goal</p>
                    <p className="text-sm text-gray-500">Monetary contributions for your goals</p>
                  </div>
                </div>
              </button>
            </div>
            
            <p className="text-left text-gray-500 text-sm mt-4">
              Skip this step if you prefer to add items later
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="lg:w-1/3 lg:bg-gray-50 lg:border-r border-gray-200">
            <div className="lg:hidden px-4 py-4">
              <div className="max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src="/HeySpenderMedia/General/HeySpender Logoo Reverse.webp" 
                      alt="HeySpender" 
                      className="h-10"
                    />
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    type="button"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:block px-8 py-12 h-full">
              <div className="flex justify-end mb-8">
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                  title="Close and return to dashboard"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-16">
                <div className="w-14 h-14 bg-brand-purple-dark rounded-lg flex items-center justify-center p-3">
                  <img 
                    src="/HeySpenderMedia/General/HeySpender Icon.webp" 
                    alt="HeySpender" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">
                  {currentStep + 1} of {steps.length}
                </p>
              </div>

              <div>
                <h1 className="text-[35px] font-bold text-gray-900 mb-4 leading-tight">
                  {currentStep === 0 && "Welcome to HeySpender!"}
                  {currentStep === 1 && "What's your wishlist called?"}
                  {currentStep === 2 && "What's the occasion?"}
                  {currentStep === 3 && "When's the big day?"}
                  {currentStep === 4 && "Share your story"}
                  {currentStep === 5 && "Add a cover photo"}
                  {currentStep === 6 && "Who can see this?"}
                  {currentStep === 7 && "Add your first items"}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {currentStep === 0 && "Let's create your first wishlist in just a few steps. You can always edit everything later."}
                  {currentStep === 1 && "This title will house all your wishlist items and cash goals"}
                  {currentStep === 2 && "Help your supporters understand the context"}
                  {currentStep === 3 && "Set a target date for your wishlist"}
                  {currentStep === 4 && "Why does this wishlist matter to you?"}
                  {currentStep === 5 && "Make your wishlist stand out with a beautiful image"}
                  {currentStep === 6 && "Control who has access to your wishlist"}
                  {currentStep === 7 && "Start with a few items or cash goals. You can always add more later!"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:w-2/3 flex flex-col">
            <div className="lg:hidden px-4 py-6">
              <div className="max-w-sm mx-auto">
                <div className="mb-4 mt-4">
                  <p className="text-sm font-medium text-gray-500">
                    {currentStep + 1} of {steps.length}
                  </p>
                </div>
                
                <h1 className="text-[35px] font-bold text-gray-900 mb-3 leading-tight">
                  {currentStep === 0 && "Welcome to HeySpender!"}
                  {currentStep === 1 && "What's your wishlist called?"}
                  {currentStep === 2 && "What's the occasion?"}
                  {currentStep === 3 && "When's the big day?"}
                  {currentStep === 4 && "Share your story"}
                  {currentStep === 5 && "Add a cover photo"}
                  {currentStep === 6 && "Who can see this?"}
                  {currentStep === 7 && "Add your first items"}
                </h1>
                <p className="text-gray-600">
                  {currentStep === 0 && "Let's create your first wishlist in just a few steps. You can always edit everything later."}
                  {currentStep === 1 && "This title will house all your wishlist items and cash goals"}
                  {currentStep === 2 && "Help your supporters understand the context"}
                  {currentStep === 3 && "Set a target date for your wishlist"}
                  {currentStep === 4 && "Why does this wishlist matter to you?"}
                  {currentStep === 5 && "Make your wishlist stand out with a beautiful image"}
                  {currentStep === 6 && "Control who has access to your wishlist"}
                  {currentStep === 7 && "Start with a few items or cash goals. You can always add more later!"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-4 lg:px-56 pt-8 pb-6 lg:pt-[260px] lg:pb-12">
                <AnimatePresence mode="wait">
                  <div key={currentStep} className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
                    {renderStepContent()}
                  </div>
                </AnimatePresence>
              </div>
            </div>

            <div className="px-4 lg:px-8 py-4 lg:py-6 border-t border-gray-200 bg-brand-purple-dark">
              <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green border-2 border-black flex items-center justify-center hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`w-[12px] h-[12px] sm:w-[15px] sm:h-[15px] border-2 border-black cursor-pointer transition-all hover:scale-110 ${
                        index === currentStep
                          ? 'bg-brand-orange'
                          : index < currentStep
                          ? 'bg-brand-green'
                          : 'bg-white hover:bg-gray-200'
                      }`}
                      style={{ boxShadow: '-1.5px 1.5px 0px 0px rgba(22,27,71,1)' }}
                      title={steps[index].title}
                    />
                  ))}
                </div>

                {currentStep === steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="bg-brand-green border-2 border-black px-4 py-2 sm:px-8 sm:py-3 hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-black font-bold text-base sm:text-lg">
                      {isSubmitting ? 'Creating...' : 'Create'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green border-2 border-black flex items-center justify-center hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all"
                  >
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GetStartedPage;
