"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Gift, Users, Shield, ArrowRight, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PricingFeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const colors = [
    { bg: 'bg-brand-green', lightBg: 'bg-[#E9FBEA]' }, // First card - Green
    { bg: 'bg-brand-pink-light', lightBg: 'bg-[#FFF0FF]' }, // Second card - Pink
    { bg: 'bg-brand-salmon', lightBg: 'bg-[#FBEAE3]' }, // Third card - Salmon
    { bg: 'bg-brand-beige', lightBg: 'bg-[#FDF5E9]' } // Fourth card - Beige
  ];
  
  const { bg, lightBg } = colors[index % colors.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="[perspective:1000px] group"
    >
      <div className="relative w-full h-[300px] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-transform duration-700">
        {/* Front of card */}
        <div className={`absolute w-full h-full [backface-visibility:hidden] p-6 flex flex-col justify-between border-2 border-black ${bg}`}>
          <h3 className="text-2xl font-bold text-black leading-tight">
            {feature.title.split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{line}</span>
            ))}
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
        <div className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] text-black p-6 flex flex-col items-center justify-center text-center border-2 border-black ${lightBg}`}>
          <h3 className="text-xl font-bold mb-2">
            {feature.title.split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h3>
          <div className="text-3xl font-bold mb-4">{feature.price}</div>
          <p className="mb-4 text-sm">{feature.description}</p>
          <feature.icon className="w-12 h-12" />
        </div>
      </div>
    </motion.div>
  );
};

const PricingPage = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [selectedDonors, setSelectedDonors] = useState(5);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Calculate fees based on HeySpender's pricing model (Nigerian Naira)
  const calculateFees = (amount: number, donors: number) => {
    const transactionFee = (amount * 0.029) + (donors * 150); // 2.9% + ₦150 per transaction
    const netAmount = amount - transactionFee;
    return {
      total: amount,
      fee: transactionFee,
      net: netAmount,
      feePercentage: ((transactionFee / amount) * 100).toFixed(1)
    };
  };

  const fees = calculateFees(selectedAmount, selectedDonors);

  const pricingFeatures = [
    {
      icon: Gift,
      title: "No Fee To\nCreate A Wishlist",
      description: "Start creating and managing your wishlists completely free",
      price: "₦0.00",
      color: "bg-brand-green"
    },
    {
      icon: Users,
      title: "Spender Contributions\nAre Optional",
      description: "Supporters can choose to tip HeySpender, but it's never required",
      price: "₦0.00",
      color: "bg-brand-orange"
    },
    {
      icon: Banknote,
      title: "One\nTransaction Fee",
      description: "Automatically deducted from each contribution, so you never have to worry about paying a bill",
      price: "2.9% + ₦150",
      color: "bg-brand-salmon"
    }
  ];

  const faqData = [
    {
      question: "What's a transaction fee?",
      answer: "Safe and secure wishlist funding is our top priority. That's why we partner with industry-leading payment processors like Paystack to accept and deliver contributions. The transaction fee is automatically deducted from each contribution. It covers the costs of credit, debit, and bank transfer charges, safely delivering contributions, and helps us offer more ways to contribute—through credit, bank transfer, debit, mobile money, or digital wallets. This is the only fee deducted for someone creating a wishlist on HeySpender and helps power all your wishlist needs."
    },
    {
      question: "Are supporter contributions to HeySpender required?",
      answer: "It's important to us that everyone is able to get the help they need—which is why we don't charge a fee to create a wishlist. Instead, we accept optional contributions from supporters that are always appreciated, but never required. Supporter contributions help make it possible for us to offer powerful and trusted wishlist tools, customer support, and a global team of Trust & Safety experts."
    },
    {
      question: "Is there a fee for supporters who make recurring contributions?",
      answer: "Supporters who choose to make a recurring contribution to a wishlist on HeySpender pay a 5% fee per contribution to help support this feature. This fee helps us maintain the infrastructure needed for recurring contributions."
    },
    {
      question: "What are HeySpender Pro's costs and fees?",
      answer: "HeySpender Pro offers custom pricing based on your organization's unique needs. Standard processing fees apply—typically 2.2%–2.5% + ₦150 per transaction, with a 1% additional fee for American Express. Exclusively for businesses and nonprofits, HeySpender Pro offers powerful tools for direct giving, team fundraising, live events, and more to help you raise more and reach supporters everywhere."
    },
    {
      question: "How do I withdraw money from my wishlist?",
      answer: "Once you've received contributions, you can withdraw funds directly to your bank account through the Wallet section of your dashboard. Simply add your bank account details in settings, and you can request a withdrawal anytime. Withdrawals typically process within 1-3 business days. Platform fees are deducted from contributions when they're made, so you only pay once."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
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
                Pricing
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Simple pricing,</span>
                <br />
                <span className="text-gray-800">powerful wishlists.</span>
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
                      <Banknote className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">HeySpender Pricing</p>
                    <p className="text-sm">Illustration placeholder</p>
                  </div>
                </div>
              </div>

              {/* About Pricing Text */}
              <div className="text-center max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-gray-700">
                <p>
                  One small transaction fee per contribution covers all your wishlist needs. Everything else goes directly to your cause, because that's what matters most.
                </p>
                <p>
                  We believe in transparent, fair pricing that puts your goals first. No hidden fees, no surprises—just simple, straightforward pricing that works for everyone.
                </p>
                <p>
                  Learn more about our payment processing and security <button onClick={() => router.push('/faq')} className="underline text-brand-purple hover:text-brand-purple-dark cursor-pointer">here</button>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Features */}
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
                Simple & Transparent Pricing
              </h2>
              <p className="text-lg text-black/80 max-w-2xl mx-auto">
                No hidden fees, no surprises. Just straightforward pricing that works for everyone.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pricingFeatures.map((feature, index) => (
                <PricingFeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Calculator */}
        <section className="py-16 bg-brand-purple-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let's Do The Math Together</h2>
            </motion.div>

            <div className="bg-white p-8 border-2 border-black shadow-lg">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-black mb-3">
                      If you raised
                    </label>
                    <div className="space-y-4">
                      {[50000, 150000, 500000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setSelectedAmount(amount)}
                          className={`w-full p-4 border border-gray-300 rounded-lg text-left transition-all ${
                            selectedAmount === amount 
                              ? 'bg-brand-orange text-black border-brand-orange' 
                              : 'bg-white text-black hover:bg-gray-50'
                          }`}
                        >
                          ₦{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-black mb-3">
                      from
                    </label>
                    <div className="space-y-4">
                      {[5, 15, 30].map((donors) => (
                        <button
                          key={donors}
                          onClick={() => setSelectedDonors(donors)}
                          className={`w-full p-4 border border-gray-300 rounded-lg text-left transition-all ${
                            selectedDonors === donors 
                              ? 'bg-brand-orange text-black border-brand-orange' 
                              : 'bg-white text-black hover:bg-gray-50'
                          }`}
                        >
                          {donors} donors
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-brand-beige p-6 rounded-lg">
                    <div className="text-sm text-black/70 mb-2">Fee to start a wishlist:</div>
                    <div className="text-2xl font-bold text-black">₦0.00</div>
                  </div>

                  <div className="bg-brand-pink-light p-6 rounded-lg">
                    <div className="text-sm text-black/70 mb-2">You'd receive</div>
                    <div className="text-3xl font-bold text-black">₦{fees.net.toLocaleString()}</div>
                    <div className="text-sm text-black/70 mt-2">
                      in your bank account.
                    </div>
                  </div>

                  <div className="bg-brand-salmon p-6 rounded-lg">
                    <div className="text-sm text-black/70 mb-2">Transaction fee:</div>
                    <div className="text-2xl font-bold text-black">₦{fees.fee.toLocaleString()}</div>
                    <div className="text-sm text-black/70 mt-2">
                      ({fees.feePercentage}% of total)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqData.map((item, index) => {
                const isOpen = openFAQ === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-2 border-black bg-white"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-black pr-4">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-black" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 pt-2 text-gray-700 leading-relaxed border-t-2 border-gray-200">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 bg-brand-pink-light overflow-hidden">
          {/* Background Wave Image */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            <img 
              src="/HeySpenderMedia/General/FooterWave.webp" 
              alt="Footer Wave" 
              className="absolute bottom-0 left-0 w-full h-24 sm:h-auto object-cover"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Everything you need to create wishlists
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ready to start a wishlist? If you're looking for tips on successful wishlist creation or want to speak to a HeySpender team member, check out our Help Center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/auth/register')}
                size="lg" 
                variant="custom" 
                className="bg-brand-accent-red text-white w-full sm:w-auto cursor-pointer"
              >
                <span>Start a Wishlist</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => router.push('/faq')}
                size="lg" 
                variant="custom" 
                className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
              >
                <span>Visit Help Center</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;
