"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, Zap, Globe, Award, ArrowRight, Sparkles, Gift, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const AboutUsPage = () => {
  const router = useRouter();

  const stats = [
    { number: "10K+", label: "Happy Users" },
    { number: "50K+", label: "Wishlists Created" },
    { number: "₦2M+", label: "Contributions Raised" },
    { number: "15+", label: "Countries Served" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      tag: "Core Value",
      gradient: "from-brand-purple to-brand-purple-dark",
      description: "We understand that sharing your dreams can feel vulnerable. That's why we've built HeySpender with empathy at its core, making it easy and comfortable for everyone."
    },
    {
      icon: Users,
      title: "Community Driven",
      tag: "Our Priority",
      gradient: "from-brand-green to-brand-purple",
      description: "Our platform thrives on the power of community. We believe that when people come together to support each other's dreams, magic happens."
    },
    {
      icon: Target,
      title: "Purpose Built",
      tag: "Our Drive",
      gradient: "from-brand-orange to-brand-accent-red",
      description: "Every feature is designed with a clear purpose: to make wishlist creation, sharing, and contribution seamless for both creators and supporters."
    },
    {
      icon: Zap,
      title: "Innovation Focused",
      tag: "Our Future",
      gradient: "from-brand-pink-light to-brand-salmon",
      description: "We're constantly evolving our platform with cutting-edge features, from QR code sharing to real-time progress tracking, always staying ahead of the curve."
    }
  ];


  const timeline = [
    {
      year: "2023",
      title: "The Spark",
      description: "HeySpender was born from a simple wedding planning challenge. We realized there had to be a better way to coordinate group gifts and contributions."
    },
    {
      year: "2024 Q1",
      title: "First Launch",
      description: "We launched our MVP with basic wishlist creation and sharing features. The response from our early users was overwhelmingly positive."
    },
    {
      year: "2024 Q2",
      title: "Payment Integration",
      description: "Added seamless payment processing with Paystack, Flutterwave, and Monnify, making contributions effortless for supporters."
    },
    {
      year: "2024 Q3",
      title: "Global Expansion",
      description: "Expanded to 15+ countries and introduced advanced features like QR codes, real-time tracking, and automated thank-you messages."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="relative overflow-hidden bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                About Us
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Making Dreams Come True,</span>
                <span className="sm:hidden"> </span>
                <br className="hidden sm:block" />
                <span className="text-gray-800">One Goal at a Time.</span>
              </h1>

              <div className="flex justify-center">
                 <Button 
                   onClick={() => router.push('/auth/register')} 
                   size="lg" 
                   variant="custom"
                   className="bg-brand-green hover:bg-brand-green/90 text-black px-8 py-3 font-medium text-lg cursor-pointer"
                 >
                  Start Your Wishlist
                </Button>
              </div>

              {/* Image Placeholder */}
              <div className="mt-12 mb-8">
                <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">HeySpender Community</p>
                    <p className="text-sm">Illustration placeholder</p>
                  </div>
                </div>
              </div>

              {/* About Us Text */}
              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  Since its launch in 2023, HeySpender has been committed to helping people help each other. We believe that sharing your dreams should feel natural and receiving support should feel effortless.
                </p>
                <p>
                  HeySpender is the next evolution in wishlist creation and group gifting, combining intuitive design with powerful features, ensuring that every contribution makes a meaningful difference in someone's life.
                </p>
                <p>
                  Learn about our commitment to your data privacy <a href="/privacy" className="underline text-brand-purple hover:text-brand-purple-dark">here</a>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-lg text-black/80 max-w-2xl mx-auto">
                Since our launch, we've helped thousands of people turn their dreams into reality
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-brand-purple mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-black/80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-black/80 max-w-3xl mx-auto leading-relaxed">
                To create a world where sharing your dreams feels natural, receiving support feels effortless, and every contribution makes a meaningful difference in someone's life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-green">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-black/80 max-w-2xl mx-auto">
                Our values guide everything we do, from product development to community building
              </p>
            </motion.div>

            {/* Mobile: Exact Design Stacked Vertically */}
            <div className="md:hidden space-y-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-brand-cream border-2 border-black overflow-hidden cursor-pointer transition-all duration-500 ease-in-out relative h-[400px] w-full"
                >
                  {/* Image Placeholder */}
                  <div className="w-full h-32 bg-gray-200 border-b-2 border-black flex items-center justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Image Placeholder
                    </div>
                  </div>
                  
                  <div className="px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
                      {value.tag}
                    </p>
                    <h3 className="text-[22px] font-bold text-black mb-3">
                      {value.title}
                    </h3>
                    <p className="text-black/70 text-[15px] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Interactive Card Layout */}
            <div className="hidden md:block w-full overflow-hidden border-r-2 border-black">
              <div className="flex relative">
                {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="group bg-brand-cream hover:bg-white border-2 border-black overflow-hidden cursor-pointer transition-all duration-500 ease-in-out flex-shrink-0 relative h-[500px] w-[40%] min-w-[40%]"
                  style={{
                    marginLeft: index > 0 ? '-20%' : '0px',
                    zIndex: index + 1
                  }}
                  onMouseEnter={(e) => {
                    // Handle 1st card hover to slide 2nd card
                    if (index === 0) { // 1st card (index 0)
                      const cards = e.currentTarget.parentElement?.children;
                      if (cards) {
                        const secondCard = cards[1];
                        if (secondCard) {
                          // If 2nd card is active (at 20%), slide it beneath 3rd card
                          if (secondCard.style.marginLeft === '20%') {
                            secondCard.style.marginLeft = '0%'; // Slide 2nd card beneath 3rd card
                          } else {
                            secondCard.style.marginLeft = '-2px'; // Slide 2nd card so its outline overlaps on 1st card
                          }
                        }
                      }
                    }
                    // Handle 2nd card hover to slide 3rd card
                    if (index === 1) { // 2nd card (index 1)
                      const cards = e.currentTarget.parentElement?.children;
                      if (cards) {
                        const firstCard = cards[0];
                        const secondCard = cards[1];
                        const thirdCard = cards[2];
                        const fourthCard = cards[3];
                        
                        // Check if 1st card is active (2nd card is at 0%)
                        if (firstCard && secondCard && secondCard.style.marginLeft === '0%') {
                          // If 1st card is active, slide 2nd card left over 1st card halfway
                          if (secondCard) {
                            secondCard.style.marginLeft = '-20%'; // Slide 2nd card left over 1st card halfway
                          }
                        } else if (secondCard && secondCard.style.marginLeft === '20%') {
                          // If 2nd card is active (at 20%), slide it left over the 1st card
                          if (secondCard) {
                            secondCard.style.marginLeft = '-2px'; // Slide 2nd card left over 1st card
                          }
                        } else {
                          // Check if 4th card is already slid out
                          if (fourthCard && fourthCard.style.marginLeft === '-2px') {
                            // If 4th card is already out, push it back and slide 3rd card to overlap
                            if (fourthCard) {
                              fourthCard.style.marginLeft = '-20%'; // Push 4th card back
                            }
                            if (thirdCard) {
                              thirdCard.style.marginLeft = '-2px'; // Slide 3rd card to overlap
                            }
                          } else {
                            // Default case: slide 3rd card to overlap
                            if (thirdCard) {
                              thirdCard.style.marginLeft = '-2px'; // Slide 3rd card to overlap
                            }
                          }
                        }
                      }
                    }
                    // Handle 3rd card hover to slide 4th card
                    if (index === 2) { // 3rd card (index 2)
                      const cards = e.currentTarget.parentElement?.children;
                      if (cards) {
                        const firstCard = cards[0];
                        const secondCard = cards[1];
                        const thirdCard = cards[2];
                        const fourthCard = cards[3];
                        
                        // Check if 1st card is active (2nd card is at 0%)
                        if (firstCard && secondCard && secondCard.style.marginLeft === '0%') {
                          // If 1st card is active, push both 2nd and 3rd cards forward to overlap on 1st card
                          if (secondCard) {
                            secondCard.style.marginLeft = '20%'; // Push 2nd card FORWARD to overlap on 1st card
                          }
                          if (thirdCard) {
                            thirdCard.style.marginLeft = '20%'; // Push 3rd card FORWARD to overlap on 1st card
                          }
                        } else {
                          // Default case: slide 4th card to overlap
                          if (fourthCard) {
                            fourthCard.style.marginLeft = '-2px'; // Slide 4th card to overlap
                          }
                        }
                      }
                    }
                    // Handle 4th card hover to return to original position
                    if (index === 3) { // 4th card (index 3)
                      const cards = e.currentTarget.parentElement?.children;
                      if (cards) {
                        const firstCard = cards[0];
                        const secondCard = cards[1];
                        const thirdCard = cards[2];
                        const fourthCard = cards[3];
                        
                        // Check if 1st card is active (2nd card is at 0%)
                        if (firstCard && secondCard && secondCard.style.marginLeft === '0%') {
                          // If 1st card is active, push both 2nd and 3rd cards forward to overlap on 1st card
                          if (secondCard) {
                            secondCard.style.marginLeft = '20%'; // Push 2nd card FORWARD to overlap on 1st card
                          }
                          if (thirdCard) {
                            thirdCard.style.marginLeft = '20%'; // Push 3rd card FORWARD to overlap on 1st card
                          }
                          // 4th card should never hide more than its half
                          if (fourthCard) {
                            fourthCard.style.marginLeft = '0%'; // Keep 4th card visible (never hide more than half)
                          }
                        } else if (thirdCard && thirdCard.style.marginLeft === '-2px') {
                          // If 3rd card is already out, keep it out and slide 4th card out too
                          if (fourthCard) {
                            fourthCard.style.marginLeft = '-2px'; // Slide 4th card out
                          }
                        } else {
                          // If 3rd card is not out, return 4th card to original position
                          if (fourthCard) {
                            fourthCard.style.marginLeft = '-20%'; // Back to original
                          }
                        }
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Reset all cards to original positions
                    const cards = e.currentTarget.parentElement?.children;
                    if (cards) {
                      for (let i = 0; i < cards.length; i++) {
                        const card = cards[i];
                        if (card) {
                          if (i === 0) {
                            card.style.marginLeft = '0px';
                          } else {
                            card.style.marginLeft = '-20%';
                          }
                        }
                      }
                    }
                  }}
                >
                  {/* Image Placeholder */}
                  <div className="w-full h-48 lg:h-56 bg-gray-200 border-b-2 border-black flex items-center justify-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Image Placeholder
                    </div>
                  </div>
                  
                  <div className="px-8 py-6 lg:px-10 lg:py-8">
                    <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
                      {value.tag}
                    </p>
                    <h3 className="text-[26px] font-bold text-black mb-3 group-hover:text-brand-purple transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-black/70 text-[17px] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Timeline Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-black/80 max-w-2xl mx-auto">
                From a simple idea to a platform that's changing lives
              </p>
            </motion.div>

             {/* Mobile Timeline - Redesigned */}
             <div className="md:hidden">
               <div className="relative">
                 {/* Mobile Timeline Line */}
                 <div className="absolute left-6 top-0 bottom-0 w-1 bg-brand-purple"></div>
                 
                 <div className="space-y-8">
                   {timeline.map((item, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6, delay: index * 0.1 }}
                       className="relative flex items-start"
                     >
                       {/* Timeline Dot */}
                       <div className="absolute left-4 w-4 h-4 bg-brand-purple border-2 border-white z-10"></div>
                       
                       {/* Content Card */}
                       <div className="ml-12 bg-white p-6 border-2 border-black shadow-flat-left w-full">
                         <div className="flex items-center gap-3 mb-3">
                           <div className="bg-brand-purple text-white px-3 py-1 text-sm font-bold">
                             {item.year}
                           </div>
                           <h3 className="text-lg font-bold text-black">{item.title}</h3>
                         </div>
                         <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
             </div>

             {/* Desktop Timeline - Enhanced */}
             <div className="hidden md:block relative">
               {/* Timeline line */}
               <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-brand-purple"></div>
               
               <div className="space-y-16">
                 {timeline.map((item, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: index * 0.1 }}
                     className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                   >
                     <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                       <div className="bg-white p-8 border-2 border-black shadow-flat-left group hover:shadow-flat-left-hard transition-all duration-300">
                         <div className="flex items-center gap-4 mb-4">
                           <div className="bg-brand-purple text-white px-4 py-2 text-lg font-bold">
                             {item.year}
                           </div>
                           <h3 className="text-2xl font-bold text-black group-hover:text-brand-purple transition-colors duration-300">{item.title}</h3>
                         </div>
                         <p className="text-gray-700 leading-relaxed">{item.description}</p>
                       </div>
                     </div>
                     
                     {/* Timeline dot */}
                     <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-brand-purple border-4 border-white shadow-lg"></div>
                     
                     <div className="w-1/2"></div>
                   </motion.div>
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-purple">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Join thousands of people who are already making their dreams come true with HeySpender.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <Button 
                   onClick={() => router.push('/auth/register')} 
                   size="lg" 
                   variant="custom"
                   className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                 >
                  <span>Create Your Wishlist</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => router.push('/explore')} 
                  size="lg" 
                  variant="custom"
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Explore Wishlists</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;
