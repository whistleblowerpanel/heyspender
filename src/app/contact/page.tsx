"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, MapPin, Phone, Clock, ArrowRight, Users, HeadphonesIcon } from 'lucide-react';
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

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      color: "bg-brand-green",
      content: [
        "Send us an email at support@heyspender.com for any questions or concerns.",
        "We typically respond within 24-48 hours during business days.",
        "For urgent matters, please mark your email as 'Urgent' in the subject line.",
        "Include your account details and a clear description of the issue for faster resolution.",
        "We handle all types of inquiries: technical support, account issues, billing questions, and general feedback."
      ]
    },
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      color: "bg-brand-orange",
      content: [
        "Get instant help through our live chat feature available on our website.",
        "Live chat is available Monday through Friday, 9 AM to 6 PM WAT.",
        "Perfect for quick questions and immediate assistance with your account.",
        "Our support team can help with wishlist creation, payment issues, and platform navigation.",
        "Chat history is saved so you can reference previous conversations if needed."
      ]
    },
    {
      icon: Users,
      title: "Community Support",
      color: "bg-brand-salmon",
      content: [
        "Join our community forums to get help from other HeySpender users.",
        "Share tips, tricks, and best practices for creating amazing wishlists.",
        "Get inspiration from successful wishlist creators and their strategies.",
        "Community moderators are available to help with common questions and issues.",
        "Connect with like-minded individuals who share your interests and goals."
      ]
    },
    {
      icon: HeadphonesIcon,
      title: "Business Hours & Response Times",
      color: "bg-brand-accent-red",
      content: [
        "Our support team is available Monday through Friday: 9 AM - 6 PM WAT.",
        "Saturday support: 10 AM - 4 PM WAT (limited availability).",
        "Sunday: Closed (emergency support available for critical issues only).",
        "Email responses typically within 24-48 hours during business days.",
        "Live chat responses are usually immediate during business hours."
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-brand-purple-dark text-white pt-32 pb-16 md:pt-40 md:pb-24 border-b-4 border-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-block p-4 bg-brand-orange mb-6 border-2 border-black">
                <MessageSquare className="w-12 h-12 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-white/80">
                We're here to help you make the most of HeySpender.
              </p>
              <p className="text-sm text-white/60 mt-4">
                Get in touch with our support team for any questions or assistance.
              </p>
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-beige border-2 border-black">
                    <MessageSquare className="w-5 h-5 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">Send Us a Message</h2>
                </div>
                
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
                      Your Name *
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
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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
                      placeholder="How can we help?"
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
                      placeholder="Tell us more about your question or concern..."
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
                    className="w-full bg-brand-purple text-white hover:bg-brand-purple-dark disabled:opacity-50 cursor-pointer rounded-lg"
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

              {/* Contact Information Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Contact Info Card */}
                <div className="bg-brand-beige/50 p-6 border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-4">Contact Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-beige border-2 border-black">
                        <Mail className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Email Us</p>
                        <p className="text-brand-purple-dark font-medium">support@heyspender.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-beige border-2 border-black">
                        <Clock className="w-4 h-4 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Response Time</p>
                        <p className="text-gray-700">Within 24-48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Quick Answers Card */}
                <div className="bg-brand-purple/20 p-6 border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-4">Need Quick Answers?</h3>
                  <p className="text-gray-700">
                    Check our <button onClick={() => router.push('/faq')} className="text-brand-purple-dark font-medium hover:underline cursor-pointer">FAQ page</button> for instant answers to common questions.
                  </p>
                </div>

                {/* Business Inquiries Card */}
                <div className="bg-brand-green/20 p-6 border-2 border-black">
                  <h3 className="text-xl font-bold text-black mb-4">Business Inquiries</h3>
                  <p className="text-brand-purple-dark font-medium">business@heyspender.com</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-16 bg-brand-purple-dark text-white border-t-2 border-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                If you have any questions or concerns about HeySpender, we're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/faq')}
                  size="lg" 
                  variant="custom" 
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Visit FAQ</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => router.push('/explore')}
                  size="lg" 
                  variant="custom" 
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
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
