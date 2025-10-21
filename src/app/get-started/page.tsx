"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Plus, X as XIcon, Check, Cake, Heart, Baby, GraduationCap, Home, HeartHandshake, Gift, PartyPopper, Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useConfetti } from '@/contexts/ConfettiContext';
import { useToast } from '@/components/ui/use-toast';
import FormField from '@/components/forms/FormField';
import ModernDateInput from '@/components/forms/ModernDateInput';
import FileUpload from '@/components/forms/FileUpload';
import AddItemFormModal from '@/components/forms/AddItemFormModal';
import { wishlistSchema, titleSchema, descriptionSchema, visibilitySchema, dateOptionalSchema, imageUrlSchema } from '@/lib/formValidation';
import { wishlistService } from '@/lib/wishlistService';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

// EXACT step configuration - NO MODIFICATIONS
const stepRoutes = [
  'welcome',    // Step 0: Welcome with animated preview
  'title',      // Step 1: Wishlist title input
  'occasion',   // Step 2: Occasion selection
  'date',       // Step 3: Date selection (flexible/specific)
  'story',      // Step 4: Story textarea
  'cover',      // Step 5: Cover image upload
  'privacy',    // Step 6: Visibility settings
  'items'       // Step 7: Add items and cash goals
];

// EXACT step configuration - NO MODIFICATIONS
const steps = [
  { 
    title: 'Welcome', 
    description: "Let's set up your first wishlist" 
  },
  { 
    title: 'Title', 
    description: 'What should we call your wishlist?' 
  },
  { 
    title: 'Occasion', 
    description: 'Is this for a special occasion?' 
  },
  { 
    title: 'Date', 
    description: 'When would you love to receive these gifts?' 
  },
  { 
    title: 'Story', 
    description: 'Tell your Spenders why this wishlist matters. Tell your supporters why this wishlist is special to you.' 
  },
  { 
    title: 'Cover', 
    description: 'Choose a beautiful cover photo' 
  },
  { 
    title: 'Privacy', 
    description: 'Who can see your wishlist?' 
  },
  { 
    title: 'Wishlist Items & Goals', 
    description: 'Add your first wishlist items or cash goals' 
  }
];

const sampleWishlists = [
  { title: "My Birthday Wishlist", occasion: "Birthday" },
  { title: "Wedding Registry", occasion: "Wedding" },
  { title: "Baby Shower Dreams", occasion: "Baby" },
  { title: "Graduation Goals", occasion: "Graduation" },
  { title: "Holiday Wishes", occasion: "Just Because" }
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

const GetStartedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { triggerConfetti } = useConfetti();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [addGoalModalOpen, setAddGoalModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [cashGoals, setCashGoals] = useState([]);

  // Typing animation for welcome card
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // EXACT form configuration - NO MODIFICATIONS
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      title: '',
      occasion: '',
      story: '',
      visibility: 'public',
      event_date: null,
      cover_image_url: ''
    }
  });

  // No authentication redirect - allow unauthenticated users to use wizard

  // Initialize step from URL parameter
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepIndex = stepRoutes.indexOf(stepParam);
      if (stepIndex !== -1 && stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
      }
    }
  }, [searchParams]);

  // EXACT typing animation - NO MODIFICATIONS
  useEffect(() => {
    if (currentStep !== 0) return; // Only run on welcome slide

    const currentWishlist = sampleWishlists[titleIndex];
    const currentTitle = currentWishlist.title;
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseAfterComplete = 2000;
    const pauseAfterDelete = 500;

    const timer = setTimeout(() => {
      if (!isDeleting && typedTitle.length < currentTitle.length) {
        // Typing
        setTypedTitle(currentTitle.substring(0, typedTitle.length + 1));
      } else if (!isDeleting && typedTitle.length === currentTitle.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseAfterComplete);
      } else if (isDeleting && typedTitle.length > 0) {
        // Deleting
        setTypedTitle(currentTitle.substring(0, typedTitle.length - 1));
      } else if (isDeleting && typedTitle.length === 0) {
        // Move to next title
        setIsDeleting(false);
        setTitleIndex((prevIndex) => (prevIndex + 1) % sampleWishlists.length);
        setTimeout(() => {}, pauseAfterDelete);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedTitle, isDeleting, titleIndex, currentStep]);

  // EXACT navigation state logic - NO MODIFICATIONS
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      router.push(`/get-started?step=${stepRoutes[nextStepIndex]}`, { scroll: false });
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      router.push(`/get-started?step=${stepRoutes[prevStepIndex]}`, { scroll: false });
      window.scrollTo(0, 0);
    }
  };

  // EXACT occasion mapping - NO MODIFICATIONS
  const getOccasionValue = (displayName) => {
    const occasion = occasions.find(occ => occ.name === displayName);
    return occasion ? occasion.value : null;
  };

  // EXACT submission handler - Modified for new user flow
  const handleComplete = handleSubmit(async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const wizardData = {
        ...data,
        items,
        cashGoals
      };
      
      // Store wizard data in localStorage for after registration
      localStorage.setItem('wizardData', JSON.stringify(wizardData));
      
      toast({
        title: 'Wizard completed!',
        description: 'Now let\'s create your account to save your wishlist.'
      });

      // Navigate to registration page
      router.push('/auth/register');
    } catch (error) {
      console.error('Error processing wizard data:', error);
      toast({
        variant: 'destructive',
        title: 'Unable to process data',
        description: error.message || 'An error occurred while processing your data.'
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleClose = () => {
    router.push('/dashboard');
  };

  // EXACT number formatting - NO MODIFICATIONS
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumberFromFormatted = (formattedValue) => {
    if (!formattedValue) return 0;
    return Number(formattedValue.replace(/,/g, ''));
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
            {/* Dummy Wishlist Card Preview */}
            <div className="w-full max-w-sm bg-white border-2 border-black">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-br from-brand-purple-light to-brand-purple-dark relative">
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white opacity-70" />
                </div>
                
                {/* Status and Visibility badges */}
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
                {/* Title and Occasion */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 min-h-[28px]">
                    {typedTitle}
                    <span className="animate-pulse">|</span>
                  </h3>
                  <span className="inline-block px-3 py-1 bg-brand-purple-light text-brand-purple-dark text-sm font-medium border border-brand-purple-dark">
                    {sampleWishlists[titleIndex].occasion}
                  </span>
                </div>

                {/* Date */}
                <div className="text-sm text-gray-600 mb-4">
                  Due December 25, 2024
                </div>

                {/* Progress */}
                <div className="space-y-3 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items Progress</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <Progress value={60} className="h-3 [&>div]:animate-[stripe_4s_linear_infinite]" />
                    <div className="text-xs text-gray-500">3 of 5 items fulfilled</div>
                  </div>
                </div>

                {/* Stats */}
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
              <FormField
                control={control}
                name="title"
                behaviorOverrides={{
                  helpText: '',
                  showCharCount: false,
                  inputProps: {
                    placeholder: 'Wishlist Title - e.g. My Birthday Wishlist, Wedding Registry',
                    maxLength: 60,
                    className: 'bg-white border border-gray-300 text-gray-900 p-4 focus:outline-none focus:border-brand-purple-dark'
                  }
                }}
              />
              {watch('title')?.length > 0 && (
                <div className="text-right text-gray-500 text-xs mt-1">
                  {watch('title').length}/60
                </div>
              )}
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
                  className={`relative p-4 border-2 border-black cursor-pointer transition-all ${
                    watch('occasion') === occasion.name
                      ? 'bg-brand-green shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)]'
                      : 'bg-white hover:shadow-[-2px_2px_0px_0px_rgba(22,27,71,1)]'
                  }`}
                  onClick={() => setValue('occasion', occasion.name)}
                >
                  {/* Check mark for selected */}
                  {watch('occasion') === occasion.name && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-black flex items-center justify-center">
                      <Check className="w-3 h-3 text-brand-green" />
                    </div>
                  )}
                  
                  {/* Icon and Text Container */}
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    {/* Icon */}
                    <div className="mb-3">
                      <occasion.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    {/* Occasion Name */}
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
              <div 
                className={`p-4 border-2 cursor-pointer transition-all ${
                  !watch('event_date') 
                    ? 'border-brand-purple-dark bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setValue('event_date', null)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                    !watch('event_date')
                      ? 'border-brand-purple-dark bg-brand-purple-dark'
                      : 'border-gray-300'
                  }`}>
                    {!watch('event_date') && (
                      <div className="w-2 h-2 bg-white"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">No specific date</span>
                    <p className="text-sm text-gray-500">Flexible timing</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 cursor-pointer transition-all ${
                  watch('event_date') 
                    ? 'border-brand-purple-dark bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setValue('event_date', new Date())}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                    watch('event_date')
                      ? 'border-brand-purple-dark bg-brand-purple-dark'
                      : 'border-gray-300'
                  }`}>
                    {watch('event_date') && (
                      <div className="w-2 h-2 bg-white"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Specific date</span>
                    <p className="text-sm text-gray-500">Set an exact date</p>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {watch('event_date') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <ModernDateInput
                    value={watch('event_date')}
                    onChange={(date) => setValue('event_date', date)}
                    minDate={new Date()}
                    placeholder="Pick a date"
                    className="bg-white border border-gray-300 text-gray-900 p-4 focus:outline-none focus:border-brand-purple-dark"
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
              <Label className="text-sm font-medium text-gray-900">
                Your Story (Optional)
              </Label>
              <FormField
                control={control}
                name="story"
                behaviorOverrides={{
                  inputProps: {
                    placeholder: 'Share what makes this wishlist special...',
                    className: 'bg-white border border-gray-300 text-gray-900 min-h-[100px] focus:outline-none focus:border-brand-purple-dark'
                  }
                }}
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
            {/* Instructional text */}
            <p className="text-gray-600 text-sm">
              Choose a beautiful cover photo that represents your wishlist and makes it stand out to your supporters.
            </p>
            
            {/* Upload field */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Cover Photo
              </label>
              <div className="mt-1">
                <FileUpload
                  variant="purple"
                  value={watch('cover_image_url')}
                  onFileSelect={async (file) => {
                    if (!user?.id) {
                      console.error('User not authenticated');
                      return;
                    }
                    
                    setUploading(true);
                    try {
                      const { imageService } = await import('@/lib/wishlistService');
                      const url = await imageService.uploadCoverImage(file, user.id);
                      setValue('cover_image_url', url);
                    } catch (error) {
                      console.error('Upload failed:', error);
                      setValue('cover_image_url', URL.createObjectURL(file));
                    } finally {
                      setUploading(false);
                    }
                  }}
                  onRemove={() => setValue('cover_image_url', '')}
                  acceptedTypes="PNG, JPG, WEBP"
                  maxSize="10MB"
                  uploading={uploading}
                  disabled={uploading}
                />
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
              <Label className="text-sm font-medium text-gray-900">
                Visibility Settings
              </Label>
              <FormField
                control={control}
                name="visibility"
              />
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
            {/* Show added items count */}
            {(items.length > 0 || cashGoals.length > 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 p-4 space-y-2 mb-6"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-4 h-4" />
                  <p className="font-medium">{items.length} wishlist item{items.length !== 1 ? 's' : ''} added</p>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-4 h-4" />
                  <p className="font-medium">{cashGoals.length} cash goal{cashGoals.length !== 1 ? 's' : ''} added</p>
                </div>
              </motion.div>
            )}
            
            <div className="space-y-3">
              <button 
                type="button"
                onClick={() => setAddItemModalOpen(true)}
                className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
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
                onClick={() => setAddGoalModalOpen(true)}
                className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <Plus className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Add Cash Goal</p>
                    <p className="text-sm text-gray-500">Monetary contributions for your goals</p>
                  </div>
                </div>
              </button>
            </div>
            
            {items.length === 0 && cashGoals.length === 0 && (
              <p className="text-left text-gray-500 text-sm mt-4">
                Skip this step if you prefer to add items later
              </p>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Show loading state while checking authentication (only if needed)
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-purple-dark animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-4">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              {/* Brand logo */}
              <div className="flex items-center">
                <img 
                  src="/HeySpenderMedia/General/HeySpender Logoo Reverse.webp" 
                  alt="HeySpender" 
                  className="h-10"
                />
              </div>
              {/* Close button */}
              <button onClick={handleClose} className="text-gray-600 hover:text-gray-900">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Step Title */}
        <div className="lg:hidden px-4 py-6">
          <div className="max-w-sm mx-auto">
            {/* Progress indicator */}
            <div className="mb-4 mt-4">
              <p className="text-sm font-medium text-gray-500">
                {currentStep + 1} of {steps.length}
              </p>
            </div>
            
            <h1 className="text-[35px] font-bold text-gray-900 mb-3 leading-tight">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="lg:w-1/3 lg:bg-gray-50 lg:border-r border-gray-200">
          <div className="hidden lg:block px-8 py-12 h-full">
            {/* Close button */}
            <div className="flex justify-end mb-8">
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Brand icon */}
            <div className="mb-16">
              <div className="w-14 h-14 bg-brand-purple-dark flex items-center justify-center p-3">
                <img 
                  src="/HeySpenderMedia/General/HeySpender Icon.webp" 
                  alt="HeySpender" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Step counter */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">
                {currentStep + 1} of {steps.length}
              </p>
            </div>

            {/* Step title and description */}
            <div>
              <h1 className="text-[35px] font-bold text-gray-900 mb-4 leading-tight">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:w-2/3 flex flex-col">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 lg:px-56 pt-8 pb-6 lg:pt-[260px] lg:pb-12">
              <div className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
                <AnimatePresence mode="wait">
                  <div key={currentStep}>
                    {renderStepContent()}
                  </div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="px-4 lg:px-8 py-4 lg:py-6 border-t border-gray-200 bg-brand-purple-dark">
            <div className="flex items-center justify-center gap-8 sm:gap-12 lg:gap-16">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-green border-2 border-black flex items-center justify-center hover:shadow-[-4px_4px_0px_0px_rgba(22,27,71,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
              </button>

              {/* Step Dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCurrentStep(index);
                      router.push(`/get-started?step=${stepRoutes[index]}`, { scroll: false });
                    }}
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

              {/* Right Button - Arrow or Create */}
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

      {/* Add Item Modal */}
      <AddItemFormModal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        onSave={(itemData) => {
          setItems(prev => [...prev, itemData]);
        }}
        type="item"
      />

      {/* Add Goal Modal */}
      <AddItemFormModal
        isOpen={addGoalModalOpen}
        onClose={() => setAddGoalModalOpen(false)}
        onSave={(goalData) => {
          setCashGoals(prev => [...prev, goalData]);
        }}
        type="goal"
      />
    </div>
  );
};

export default GetStartedPage;
