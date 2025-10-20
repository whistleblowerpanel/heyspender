"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ContactPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
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
                Contact Us
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Get in Touch</span>
                <br />
                <span className="text-gray-800">We're Here to Help</span>
              </h1>

              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  Have a question about HeySpender? Need help with your wishlist? Want to share feedback? 
                  We'd love to hear from you!
                </p>
                <p>
                  Our support team typically responds within 24-48 hours. For urgent matters, 
                  please mark your email as "Urgent" in the subject line.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 border-2 border-black shadow-flat-left"
              >
                <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-brand-green border-2 border-black flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-black" />
                    <span className="text-black font-medium">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-brand-purple ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-brand-purple ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-brand-purple ${
                        errors.subject ? 'border-red-500' : ''
                      }`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none ${
                        errors.message ? 'border-red-500' : ''
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    variant="custom"
                    className="w-full bg-brand-purple text-white hover:bg-brand-purple-dark disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-white p-8 border-2 border-black shadow-flat-left">
                  <h3 className="text-xl font-bold text-black mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-green border-2 border-black">
                        <Mail className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1">Email</h4>
                        <p className="text-gray-700">support@heyspender.com</p>
                        <p className="text-sm text-gray-600">We typically respond within 24-48 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-orange border-2 border-black">
                        <MessageSquare className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1">Live Chat</h4>
                        <p className="text-gray-700">Available on our website</p>
                        <p className="text-sm text-gray-600">Monday - Friday, 9 AM - 6 PM WAT</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-brand-salmon border-2 border-black">
                        <Clock className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1">Business Hours</h4>
                        <p className="text-gray-700">Monday - Friday: 9 AM - 6 PM WAT</p>
                        <p className="text-gray-700">Saturday: 10 AM - 4 PM WAT</p>
                        <p className="text-gray-700">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-purple p-8 border-2 border-black shadow-flat-left text-white">
                  <h3 className="text-xl font-bold mb-4">Need Help Right Now?</h3>
                  <p className="mb-6">
                    Check out our FAQ section for quick answers to common questions, 
                    or explore our help center for detailed guides.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => router.push('/faq')}
                      size="sm"
                      variant="custom"
                      className="bg-brand-green text-black cursor-pointer"
                    >
                      <span>Visit FAQ</span>
                    </Button>
                    <Button
                      onClick={() => router.push('/explore')}
                      size="sm"
                      variant="custom"
                      className="bg-brand-orange text-black cursor-pointer"
                    >
                      <span>Explore Platform</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-purple-dark text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your Wishlist?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Don't wait - create your first wishlist today and start receiving support from your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/auth/register')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Create Your Wishlist</span>
                </Button>
                <Button
                  onClick={() => router.push('/explore')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
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

export default ContactPage;
