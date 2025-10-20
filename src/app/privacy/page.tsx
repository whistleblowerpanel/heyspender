"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PrivacyPolicyPage = () => {
  const router = useRouter();
  
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      color: "bg-brand-orange",
      content: [
        "When you create an account with HeySpender, we collect personal information such as your name, email address, phone number, and bank account details for payouts.",
        "We collect information about your wishlists, cash goals, items you add, contributions you receive, and interactions with other users including supporter messages.",
        "Usage data such as your IP address, browser type, device information, and how you interact with our platform may be collected through cookies and similar technologies.",
        "We collect analytics data to improve our platform, including wishlist views, contribution patterns, and user engagement metrics."
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      color: "bg-brand-green",
      content: [
        "To provide and maintain our services, including processing payments through Paystack, managing your wishlists, and facilitating bank transfers for payouts.",
        "To communicate with you about your account, transactions, contribution notifications, and updates to our services via email and in-app notifications.",
        "To improve our platform, develop new features like QR code sharing, real-time progress tracking, and enhance user experience based on analytics.",
        "To prevent fraud, ensure security, and comply with legal obligations including tax reporting requirements for contributions received.",
        "To send you marketing communications (with your consent), automated reminders for unclaimed items, and thank-you messages, which you can opt out of at any time."
      ]
    },
    {
      icon: Shield,
      title: "How We Protect Your Information",
      color: "bg-brand-salmon",
      content: [
        "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction using Supabase's secure infrastructure.",
        "Payment information is processed securely through our payment partners (Paystack) and we do not store complete payment card details on our servers. Bank account details are encrypted and stored securely.",
        "We use encryption technology (SSL/TLS) to protect data transmitted between your device and our servers, and all data is encrypted at rest.",
        "Access to personal information is restricted to authorized personnel who need it to perform their job functions, with audit logs maintained for all data access."
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      color: "bg-brand-accent-red",
      content: [
        "We do not sell your personal information to third parties.",
        "We may share information with service providers who help us operate our platform (e.g., Paystack for payments, Supabase for hosting, email service providers for notifications).",
        "Public wishlists, cash goals, and profile information you choose to share will be visible to other users. You can control visibility settings for each wishlist.",
        "We may disclose information if required by law, to protect our rights, or to prevent fraud or security issues. We may also share anonymized analytics data for research purposes."
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
              <div className="inline-block p-4 bg-brand-green mb-6 border-2 border-black">
                <Shield className="w-12 h-12 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl text-white/80">
                Your privacy is important to us. This policy explains how we handle your data.
              </p>
              <p className="text-sm text-white/60 mt-4">
                Last Updated: January 15, 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  At HeySpender, we respect your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                  you use our platform.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  By using HeySpender, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-2 border-black p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`p-3 ${section.color} border-2 border-black flex-shrink-0`}>
                      <section.icon className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-black mt-2">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3">
                        <span className="text-brand-purple-dark font-bold flex-shrink-0 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Additional Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 space-y-8"
            >
              <div className="bg-brand-pink-light/30 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to access, update, or delete your personal information at any time. 
                  You can manage your account settings through your dashboard or contact us directly for assistance.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Access and download your personal data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Correct inaccurate or incomplete information</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Request deletion of your account and data</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Opt out of marketing communications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-beige/30 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  Cookies help us remember your preferences, understand how you use our services, and improve 
                  our platform. You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div className="bg-brand-salmon/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  HeySpender is not intended for children under the age of 13. We do not knowingly collect 
                  personal information from children under 13. If you believe we have collected information 
                  from a child under 13, please contact us immediately.
                </p>
              </div>

              <div className="bg-brand-purple/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Account information is retained while your account is active</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Transaction records are kept for tax and legal compliance purposes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Analytics data is anonymized and may be retained for research purposes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Email logs and notification records are kept for service improvement</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-green/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or 
                  for legal, operational, or regulatory reasons. We will notify you of any material changes by 
                  posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </div>

            </motion.div>
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
                If you have any questions about this Privacy Policy or how we handle your information, we're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/contact')}
                  size="lg" 
                  variant="custom" 
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Contact Support</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => router.push('/faq')}
                  size="lg" 
                  variant="custom" 
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Visit FAQ</span>
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

export default PrivacyPolicyPage;
