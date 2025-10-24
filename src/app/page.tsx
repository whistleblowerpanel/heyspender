"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Share2, Heart, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import CashGoalsSection from '@/components/CashGoalsSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
const FeatureCard = ({
  feature,
  index,
  isFlipped,
  onCardClick
}) => {
  const colors = [{
    bg: 'bg-brand-beige',
    lightBg: 'bg-[#FDF5E9]'
  }, {
    bg: 'bg-brand-pink-light',
    lightBg: 'bg-[#FFF0FF]'
  }, {
    bg: 'bg-brand-salmon',
    lightBg: 'bg-[#FBEAE3]'
  }, {
    bg: 'bg-brand-green',
    lightBg: 'bg-[#E9FBEA]'
  }];
  const {
    bg,
    lightBg
  } = colors[index % colors.length];

  const handleCardClick = () => {
    onCardClick(index);
  };

  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5,
    delay: index * 0.1
  }} className="[perspective:1000px] group">
      <div 
        onClick={handleCardClick}
        className={`relative w-full h-64 border border-black transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} ${bg} cursor-pointer`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full [backface-visibility:hidden] p-6 flex flex-col justify-between border border-black">
          <h3 className="text-2xl font-bold text-black leading-tight">
            {feature.title.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
          </h3>
          <div className="self-end">
            <feature.icon className="w-20 h-20 text-black" />
          </div>
          {/* Tap-To-Flip overlay */}
          <div className="absolute bottom-4 left-4 text-black px-3 py-1 text-xs font-bold">
            Tap-To-Flip
          </div>
        </div>
        {/* Back of card */}
        <div className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] text-black p-6 flex flex-col items-center justify-center text-center border border-black ${lightBg}`}>
          <h3 className="text-xl font-bold mb-2">
            {feature.title.split(' ').join(' ')}
          </h3>
          <p className="mb-4">{feature.description}</p>
          <feature.icon className="w-12 h-12" />
        </div>
      </div>
    </motion.div>;
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Brand colors for testimonial cards
  const brandColors = [
    'bg-brand-beige',
    'bg-brand-pink-light', 
    'bg-brand-salmon',
    'bg-brand-purple',
    'bg-brand-accent-red'
  ];

  const testimonials = [
    {
      text: "I used to feel awkward creating wishlists — it felt like asking for too much. HeySpender changed that completely. Now I can share what I genuinely need, and my friends can contribute any amount they're comfortable with. For my wedding, I got exactly what we needed without the stress.",
      author: "Ada, 28 — Bride"
    },
    {
      text: "Setting up a cash goal for my new business was so easy with HeySpender. I shared it with family and friends, and the support poured in. The real-time tracking kept me motivated, and I hit my target in just 3 weeks. This platform is a game changer!",
      author: "Kunle, 31 — Entrepreneur"
    },
    {
      text: "Buying gifts for friends always stressed me out — I never knew what they actually wanted. With HeySpender, I just check their wishlist and contribute to something they'll love. It takes away the guesswork and makes gift-giving actually enjoyable.",
      author: "Tunde, 26 — Gift Giver"
    },
    {
      text: "For my daughter's first birthday, I created a wishlist on HeySpender and shared it with friends and family. People could contribute to bigger items together or pick smaller ones. We got everything we needed, and everyone felt great about their gifts. Perfect!",
      author: "Blessing, 33 — Mom"
    },
    {
      text: "I needed to raise funds for my master's degree abroad. HeySpender's cash goal feature made it easy to share my dream with my network. The transparency and ease of contributing encouraged more people to support me. I reached 80% of my goal in two months!",
      author: "Chioma, 24 — Student"
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    // Position all cards relative to center (50%) with symmetric offsets
    const positions = [
      { left: '50%', translateX: 'calc(-50% - 1200px)', scale: 0.75, opacity: 0, rotateY: 10, zIndex: 1, blur: 0, brightness: 0.6 },
      { left: '50%', translateX: 'calc(-50% - 600px)', scale: 0.85, opacity: 0.6, rotateY: 5, zIndex: 2, blur: 0, brightness: 0.65 },
      { left: '50%', translateX: '-50%', scale: 1.05, opacity: 1, rotateY: 0, zIndex: 3, blur: 0, brightness: 1 },
      { left: '50%', translateX: 'calc(-50% + 600px)', scale: 0.85, opacity: 0.6, rotateY: -5, zIndex: 2, blur: 0, brightness: 0.65 },
      { left: '50%', translateX: 'calc(-50% + 1200px)', scale: 0.75, opacity: 0, rotateY: -10, zIndex: 1, blur: 0, brightness: 0.6 },
    ];

    let posIndex = diff + 2;
    if (posIndex < 0) posIndex = posIndex + testimonials.length;
    if (posIndex >= testimonials.length) posIndex = posIndex - testimonials.length;

    return positions[posIndex % 5] || positions[0];
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brand-green overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-[16px]">
        <h2 className="text-4xl sm:text-5xl font-bold text-black max-w-[720px] mx-auto">
          Real stories from our community
        </h2>
        <p className="lg:text-[20px] text-[16px] text-black/70 leading-[130%] max-w-[600px] mx-auto">
          From weddings to business ventures, see how our community is making dreams come true.
        </p>
      </div>

      {/* Desktop Carousel */}
      <div className="relative hidden lg:block h-[420px] w-full overflow-visible">
        {testimonials.map((testimonial, index) => {
          const style = getCardStyle(index);
          const isCenter = index === currentIndex;

          return (
            <div
              key={index}
              className="absolute top-1/2 transition-all duration-700 ease-out"
              style={{
                transform: style.translateX 
                  ? `translateX(${style.translateX}) translateY(-50%) scale(${style.scale}) rotateY(${style.rotateY}deg)`
                  : `translateY(-50%) scale(${style.scale}) rotateY(${style.rotateY}deg)`,
                left: style.left,
                zIndex: style.zIndex,
                opacity: style.opacity,
                filter: `blur(${style.blur}px) brightness(${style.brightness})`,
              }}
            >
              <div
                className={`relative flex flex-col justify-between p-[24px] overflow-hidden ${isCenter ? brandColors[index % brandColors.length] : 'bg-brand-green'} border-2 border-black shadow-flat-left-hard`}
                style={{
                  width: '580px',
                  height: '331px',
                }}
              >
                <p className={`leading-[130%] transition-all duration-300 ${isCenter ? (brandColors[index % brandColors.length] === 'bg-brand-purple' || brandColors[index % brandColors.length] === 'bg-brand-accent-red' ? 'text-[22px] text-white' : 'text-[22px] text-black') : 'text-[20px] text-black/70'}`}>
                  {testimonial.text}
                </p>
                <div className="pt-[40px]">
                  <p className={`text-left font-light leading-[130%] transition-all duration-300 ${isCenter ? (brandColors[index % brandColors.length] === 'bg-brand-purple' || brandColors[index % brandColors.length] === 'bg-brand-accent-red' ? 'text-[20px] text-white/90' : 'text-[20px] text-black/80') : 'text-[16px] text-black/60'}`}>
                    {testimonial.author}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-[100px] min-[1050px]:left-[120px] min-[1200px]:left-[190px] top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-[60px] h-[60px] bg-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 group"
        >
          <ChevronLeft className="w-7 h-7 text-black" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[100px] min-[1050px]:right-[120px] min-[1200px]:right-[190px] top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-[60px] h-[60px] bg-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 group"
        >
          <ChevronRight className="w-7 h-7 text-black" />
        </button>
        </div>

      {/* Mobile Carousel */}
      <div 
        className="lg:hidden max-w-[500px] mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
          <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`p-[24px] border-2 border-black ${brandColors[currentIndex % brandColors.length]} overflow-hidden mx-4 shadow-flat-left-hard`}
          style={{ minHeight: '330px' }}
        >
          <p className={`text-[18px] leading-[130%] ${brandColors[currentIndex % brandColors.length] === 'bg-brand-purple' || brandColors[currentIndex % brandColors.length] === 'bg-brand-accent-red' ? 'text-white' : 'text-black'}`}>
            {testimonials[currentIndex].text}
          </p>
          <div className="pt-[40px]">
            <p className={`text-[16px] text-left leading-[130%] font-light ${brandColors[currentIndex % brandColors.length] === 'bg-brand-purple' || brandColors[currentIndex % brandColors.length] === 'bg-brand-accent-red' ? 'text-white/90' : 'text-black/80'}`}>
              {testimonials[currentIndex].author}
            </p>
          </div>
          </motion.div>

        {/* Mobile Navigation */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-[50px] h-[50px] bg-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 group"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 border-2 border-black transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-brand-orange shadow-[-2px_2px_0px_#161B47]' 
                    : 'bg-white shadow-[-2px_2px_0px_#161B47]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-[50px] h-[50px] bg-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47] active:brightness-90 transition-all duration-150 group"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
          </div>
        </div>
      </section>
  );
};

const HomePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  
  
  const handleGetStarted = () => {
    // Always go to the same wizard - it will handle logged-in vs non-logged-in users
    router.push('/get-started');
  };

  const handleCardClick = (index) => {
    setFlippedCardIndex(flippedCardIndex === index ? null : index);
  };
  const features = [{
    icon: Gift,
    title: "Create Wishlists",
    description: "Build beautiful wishlists for any occasion - birthdays, weddings, or just because!"
  }, {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your wishlist via link, QR code, or social media with just one click"
  }, {
    icon: Heart,
    title: "Accept Contributions",
    description: "Receive contributions via Paystack, Flutterwave, or Monnify seamlessly"
  }, {
    icon: Sparkles,
    title: "Track Progress",
    description: "Monitor contributions in real-time and send thank you messages automatically"
  }];
  return <>
      <Navbar />
      <div className="relative overflow-hidden bg-white">
        
        <section className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-72 h-72 bg-brand-purple-dark/30 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-0 w-72 h-72 bg-brand-accent-red/30 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          <div className="max-w-7xl mx-auto relative">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center space-y-8">
              <div className="inline-block">
                <Gift className="w-32 h-32 text-brand-purple-dark mx-auto" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="text-brand-purple-dark">Create Wishlists</span>
                <br />
                <span className="text-gray-800">That Actually Work</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Share your dreams, accept contributions, and make your wishes come true. The easiest way to create wishlists for your Spenders.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
                <Button onClick={handleGetStarted} size="lg" variant="custom" className="bg-brand-orange text-black w-full sm:w-auto">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button onClick={() => router.push('/dashboard/wishlist/')} size="lg" variant="custom" className="bg-brand-green text-black w-full sm:w-auto">
                  <span>View Demo</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-black/80 max-w-2xl mx-auto">
                Powerful features to make wishlist creation and management a breeze
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index} 
                  feature={feature} 
                  index={index} 
                  isFlipped={flippedCardIndex === index}
                  onCardClick={handleCardClick}
                />
              ))}
          </div>
        </div>
      </section>

        <CashGoalsSection />

        <TestimonialsSection />

        <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-brand-pink-light overflow-hidden">
          {/* Background Wave Image */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            <img 
              src="/HeySpenderMedia/General/FooterWave.webp" 
              alt="Footer Wave" 
              className="absolute bottom-0 left-0 w-full h-24 sm:h-auto object-cover"
            />
          </div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Create your first wishlist in less than 2 minutes. No credit card required.
            </p>
            <Button onClick={handleGetStarted} size="lg" variant="custom" className="bg-brand-accent-red text-white">
              <span>Create Your Wishlist Now</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
      </section>
    </div>
      <Footer />
    </>;
};
export default HomePage;// Deployment trigger Mon Oct 20 21:21:13 WAT 2025
