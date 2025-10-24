"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Share2, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const InteractiveCardsPage = () => {
  const router = useRouter();

  const features = [
    {
      icon: Sparkles,
      title: "Animated Cards",
      description: "Beautiful animations that bring your wishlist to life",
      color: "bg-brand-purple-dark"
    },
    {
      icon: Gift,
      title: "Interactive Elements",
      description: "Clickable items with hover effects and smooth transitions",
      color: "bg-brand-accent-red"
    },
    {
      icon: Share2,
      title: "Social Sharing",
      description: "Easy sharing with custom previews and social media integration",
      color: "bg-brand-green"
    },
    {
      icon: Heart,
      title: "Engagement Tracking",
      description: "See who viewed and interacted with your cards",
      color: "bg-brand-pink-light"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-brand-purple-dark to-brand-accent-red">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <Sparkles className="w-24 h-24 text-white mx-auto" strokeWidth={1.5} />
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                Interactive Cards
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Make your wishlist sharing more engaging and fun with our interactive card features. 
                Create beautiful, interactive experiences that your Spender friends will love.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-brand-purple-dark hover:bg-white/90"
                  onClick={() => router.push('/get-started')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-brand-purple-dark"
                  onClick={() => router.push('/explore')}
                >
                  View Examples
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Interactive Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our interactive cards make wishlist sharing more engaging and memorable
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Ready to Create Interactive Cards?
              </h2>
              <p className="text-xl text-gray-600">
                Start building beautiful, interactive wishlists that your friends will love to explore
              </p>
              <Button 
                size="lg" 
                className="bg-brand-purple-dark hover:bg-brand-purple-dark/90"
                onClick={() => router.push('/get-started')}
              >
                Create Your First Card
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default InteractiveCardsPage;
