"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Scale, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TermsOfServicePage = () => {
  const router = useRouter();
  
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      color: "bg-brand-green",
      content: [
        "By accessing or using HeySpender, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any part of these terms, you may not use our services.",
        "We reserve the right to modify these terms at any time. Your continued use of the platform after changes are posted constitutes acceptance of the modified terms.",
        "You must be at least 13 years old to use HeySpender. If you are under 18, you must have parental or guardian consent.",
        "You must provide accurate information during registration and maintain current bank account details for payouts."
      ]
    },
    {
      icon: FileText,
      title: "User Accounts",
      color: "bg-brand-orange",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must provide accurate, current, and complete information during registration and keep your account information updated, including bank account details for payouts.",
        "You may not use another person's account without permission or create multiple accounts for fraudulent purposes.",
        "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent, abusive, or illegal activities.",
        "You are responsible for all content you post, wishlists you create, and actions taken through your account, including managing contribution claims and thank-you messages."
      ]
    },
    {
      icon: Scale,
      title: "Platform Usage",
      color: "bg-brand-salmon",
      content: [
        "HeySpender provides a platform for creating and sharing wishlists, setting cash goals, and receiving contributions from supporters through various payment methods.",
        "You may use the platform only for lawful purposes and in accordance with these Terms of Service.",
        "You agree not to use the platform to transmit any unlawful, harassing, defamatory, obscene, or otherwise objectionable content.",
        "You may not attempt to interfere with, compromise, or disrupt the platform's infrastructure or security, including attempting to manipulate contribution systems.",
        "We reserve the right to remove any content or suspend any user that violates these terms or our community standards. This includes inappropriate wishlist content or fraudulent cash goals."
      ]
    },
    {
      icon: AlertTriangle,
      title: "Payments and Fees",
      color: "bg-brand-accent-red",
      content: [
        "All payments and contributions are processed through our payment partners (Paystack) and are subject to their terms and fees (2.9% + ₦150 per transaction).",
        "HeySpender charges platform fees which are clearly disclosed before any transaction. No fees are charged for creating wishlists or setting up cash goals.",
        "You are responsible for ensuring the accuracy of all payment information you provide, including bank account details for payouts.",
        "All contributions are final and non-refundable unless required by law or our refund policy. Payouts to your bank account typically process within 1-3 business days.",
        "We are not responsible for any disputes between users regarding contributions or payments, though we may assist in resolution at our discretion.",
        "Users must comply with all applicable tax laws and reporting requirements for contributions received. We may provide transaction records for tax purposes."
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
                <Scale className="w-12 h-12 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms of Service</h1>
              <p className="text-xl text-white/80">
                Please read these terms carefully before using HeySpender.
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
                  Welcome to HeySpender! These Terms of Service ("Terms") govern your access to and use of our 
                  platform, services, and website. By using HeySpender, you agree to comply with these Terms.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  These Terms constitute a legally binding agreement between you and HeySpender. Please read them 
                  carefully and contact us if you have any questions.
                </p>
              </div>
            </motion.div>

            {/* Terms Sections */}
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
                <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content, features, and functionality on HeySpender, including but not limited to text, 
                  graphics, logos, icons, images, and software, are the exclusive property of HeySpender or 
                  its licensors and are protected by intellectual property laws.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>You retain ownership of content you upload to your wishlists</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>By uploading content, you grant HeySpender a license to display and distribute it as necessary to provide our services</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>You may not copy, modify, or distribute HeySpender's proprietary content without permission</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-beige/30 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Prohibited Conduct</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When using HeySpender, you agree not to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Violate any applicable laws or regulations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Engage in fraudulent activities or scams</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Harass, threaten, or harm other users</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Upload malicious code, viruses, or harmful software</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Impersonate others or misrepresent your affiliation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Collect or harvest user data without consent</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Attempt to gain unauthorized access to our systems</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-salmon/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Disclaimers and Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  HeySpender is provided "as is" and "as available" without warranties of any kind, either 
                  express or implied. We do not guarantee that the platform will be uninterrupted, error-free, 
                  or completely secure.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, HeySpender shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages arising from your use of the platform, 
                  including but not limited to loss of profits, data, or goodwill.
                </p>
              </div>

              <div className="bg-brand-green/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to suspend or terminate your account and access to HeySpender at our 
                  sole discretion, without notice, for conduct that we believe:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Violates these Terms of Service</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Is harmful to other users or the platform</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Exposes us to legal liability</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Is fraudulent or illegal</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You may also terminate your account at any time through your account settings.
                </p>
              </div>

              <div className="bg-brand-purple-dark/10 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Nigeria, 
                  without regard to its conflict of law provisions. Any disputes arising from these Terms 
                  or your use of HeySpender shall be subject to the exclusive jurisdiction of the courts 
                  in Nigeria.
                </p>
              </div>

              <div className="bg-brand-purple/20 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Platform Features</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  HeySpender offers various features to enhance your wishlist experience:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Wishlist creation with items, descriptions, and images</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Cash goals for fundraising and financial targets</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>QR code sharing for easy wishlist access</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Real-time progress tracking and analytics</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Automated email notifications and reminders</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-purple-dark font-bold">•</span>
                    <span>Bank account integration for direct payouts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-beige/50 border-2 border-black p-8">
                <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms of Service from time to time. We will notify you of any material 
                  changes by posting the new Terms on this page and updating the "Last Updated" date. Your 
                  continued use of HeySpender after changes are posted constitutes your acceptance of the 
                  modified Terms.
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
                If you have any questions or concerns about these Terms of Service, we're here to help!
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

export default TermsOfServicePage;
