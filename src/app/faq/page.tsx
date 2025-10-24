"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, Gift, CreditCard, Users, Shield, Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { updateAllSEOTags } from '@/lib/seoUtils';

const FAQPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  // Set comprehensive SEO meta tags for FAQ page
  useEffect(() => {
    const seoData = {
      title: 'Frequently Asked Questions — HeySpender',
      description: 'Find answers to common questions about HeySpender, wishlists, payments, and more. Get help with creating wishlist, cash goals and share, making contributions, and using our platform.',
      image: 'https://heyspender.com/HeySpender%20Media/General/HeySpender%20Banner.webp',
      url: 'https://heyspender.com/faq',
      keywords: 'FAQ, help, support, questions, wishlist help, payment help, HeySpender guide',
      structuredData: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "name": "HeySpender FAQ",
        "description": "Frequently asked questions about HeySpender wishlist platform",
        "url": "https://heyspender.com/faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is HeySpender?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "HeySpender is a wishlist platform that allows you to create and share wishlists for special occasions. Friends and family can view your wishlist and contribute money towards items you want, making gift-giving easier and more meaningful."
            }
          },
          {
            "@type": "Question",
            "name": "How do I create a wishlist?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Creating a wishlist is easy! Sign up for an account, click on 'Create Wishlist' in your dashboard, give it a title and occasion (like Birthday, Wedding, etc.), add items you want, and share the link with your HeySpenders."
            }
          }
        ]
      },
      ogData: {
        type: 'website',
        site_name: 'HeySpender'
      },
      twitterData: {
        card: 'summary_large_image',
        site: '@heyspender',
        creator: '@heyspender'
      }
    };
    
    updateAllSEOTags(seoData);
  }, []);

  const categories = [
    {
      icon: Gift,
      title: "Getting Started",
      color: "bg-brand-beige",
      questions: [
        {
          question: "What is HeySpender?",
          answer: "HeySpender is a wishlist platform that allows you to create and share wishlists for special occasions. Friends and family can view your wishlist and contribute money towards items you want, making gift-giving easier and more meaningful."
        },
        {
          question: "How do I create a wishlist?",
          answer: "Creating a wishlist is easy! Sign up for an account, click on 'Create Wishlist' in your dashboard, give it a title and occasion (like Birthday, Wedding, etc.), add items you want, and share the link with your HeySpenders. You can add as many items as you like with descriptions, images, and prices."
        },
        {
          question: "Is HeySpender free to use?",
          answer: "Yes! Creating an account and setting up wishlists is completely free. We charge a small service fee on contributions received to help maintain and improve the platform. All fees are transparently displayed before any transaction."
        },
        {
          question: "Can I create multiple wishlists?",
          answer: "Absolutely! You can create as many wishlists as you need for different occasions - birthdays, weddings, anniversaries, baby showers, or just because. Each wishlist can have its own theme, items, and settings."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Contributions",
      color: "bg-brand-green",
      questions: [
        {
          question: "How do people contribute to my wishlist?",
          answer: "When someone visits your wishlist, they can click on any item and choose to contribute any amount towards it. They'll be directed to our secure payment page where they can pay using their credit/debit card or bank transfer through Paystack, our trusted payment partner."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept all major credit and debit cards (Visa, Mastercard, Verve), bank transfers, and mobile money payments through our payment partner Paystack. All transactions are secure and encrypted."
        },
        {
          question: "How do I withdraw money from my wishlist?",
          answer: "Once you've received contributions, you can withdraw funds directly to your bank account through the Wallet section of your dashboard. Simply add your bank account details in settings, and you can request a withdrawal anytime. Withdrawals typically process within 1-3 business days."
        },
        {
          question: "Are there any fees for withdrawals?",
          answer: "Platform fees are deducted from contributions when they're made. Withdrawal to your bank account may incur standard bank transfer fees depending on your bank. All fees are clearly displayed before you confirm any transaction."
        },
        {
          question: "What happens if someone contributes more than the item price?",
          answer: "Great question! If contributions exceed the item's price, the extra funds go into your wallet and can be used towards other items on your wishlist or withdrawn to your bank account. You have full control over how to use the funds."
        },
        {
          question: "Can I refund a contribution?",
          answer: "Contributions are generally non-refundable once processed. However, if there's a legitimate issue or error, please contact our support team and we'll review the situation on a case-by-case basis."
        }
      ]
    },
    {
      icon: Users,
      title: "Sharing & Privacy",
      color: "bg-brand-pink-light",
      questions: [
        {
          question: "How do I share my wishlist?",
          answer: "Each wishlist has a unique shareable link that you can find in your dashboard. You can copy this link and share it via social media, email, WhatsApp, or any messaging platform. You can also use the built-in share buttons to make sharing even easier."
        },
        {
          question: "Who can see my wishlist?",
          answer: "You control your wishlist privacy! You can set it to Public (anyone with the link can view), Private (only people you specifically invite), or unlisted (visible to anyone with the link but not in public searches). Change these settings anytime in your wishlist settings."
        },
        {
          question: "Can I see who contributed to my wishlist?",
          answer: "Yes! In your dashboard, you can view all contributions including the Spender's name (if they chose to share it), amount, date, and which item they contributed towards. Some Spenders may choose to remain anonymous."
        },
        {
          question: "Can Spenders leave messages?",
          answer: "Yes! When making a contribution, Spenders can include a personal message or note which you'll see in your dashboard. It's a great way for them to send well wishes along with their gift."
        }
      ]
    },
    {
      icon: Wallet,
      title: "Account & Wallet",
      color: "bg-brand-salmon",
      questions: [
        {
          question: "How do I update my account information?",
          answer: "Go to Settings in your dashboard where you can update your profile information, email address, phone number, bank details, and password. Make sure to save your changes after updating."
        },
        {
          question: "What is the Wallet feature?",
          answer: "Your Wallet shows all contributions you've received across all your wishlists. You can view your total balance, transaction history, and initiate withdrawals to your bank account. It's your central hub for managing all the funds you receive."
        },
        {
          question: "How long does it take to receive money in my bank account?",
          answer: "Once you request a withdrawal, it typically takes 1-3 business days for the funds to appear in your bank account. Processing times may vary depending on your bank and the time of day you make the request."
        },
        {
          question: "Can I change my bank account details?",
          answer: "Yes, you can update your bank account information anytime in the Settings section of your dashboard. For security reasons, we may require verification when you change banking details."
        },
        {
          question: "What happens if I forget my password?",
          answer: "Click on 'Forgot Password' on the login page and enter your email address. We'll send you a link to reset your password. Make sure to check your spam folder if you don't see the email in your inbox."
        }
      ]
    },
    {
      icon: Shield,
      title: "Security & Trust",
      color: "bg-brand-orange",
      questions: [
        {
          question: "Is my payment information secure?",
          answer: "Absolutely! We never store your complete payment card details on our servers. All payments are processed through Paystack, a PCI-DSS compliant payment processor. All data is encrypted using industry-standard SSL/TLS technology."
        },
        {
          question: "How do I know HeySpender is legitimate?",
          answer: "HeySpender is a registered business that partners with trusted payment providers like Paystack. You can verify our credentials, read user testimonials, and see that all payments are processed through secure, verified channels. We're transparent about our fees and operations."
        },
        {
          question: "What if someone uses my wishlist fraudulently?",
          answer: "We take fraud very seriously. If you notice any suspicious activity on your account, contact our support team immediately. We have security measures in place to detect and prevent fraudulent activities, and we'll work with you to resolve any issues."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account anytime through your Settings. Please note that you should withdraw any remaining funds from your wallet before deleting your account. Once deleted, your wishlists will no longer be accessible."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "Other Questions",
      color: "bg-brand-purple-dark/10",
      questions: [
        {
          question: "Can I edit my wishlist after publishing?",
          answer: "Yes! You can edit your wishlist anytime - add or remove items, update descriptions, change images, or modify settings. Your changes will be reflected immediately to anyone viewing your wishlist."
        },
        {
          question: "What happens after the occasion date passes?",
          answer: "Your wishlist remains active even after the occasion date. You can keep it open for continued contributions, close it to new contributions while keeping it visible, or archive it. You always have access to contribution history and can withdraw remaining funds."
        },
        {
          question: "Can I use HeySpender for business or charity?",
          answer: "HeySpender is primarily designed for personal wishlists and occasions. For business or charity fundraising needs, please contact us at business@heyspender.com to discuss custom solutions."
        },
        {
          question: "Is there a mobile app?",
          answer: "Currently, HeySpender is a web-based platform that works great on mobile browsers. We're optimized for mobile use, so you can access all features from your phone or tablet. A dedicated mobile app may be coming in the future!"
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team via email at support@heyspender.com or through the Contact page. We typically respond within 24-48 hours. For urgent issues, please mark your email as 'Urgent' in the subject line."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              <div className="inline-block p-4 bg-brand-salmon mb-6 border-2 border-black">
                <HelpCircle className="w-12 h-12 text-black" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-white/80 mb-8">
                Find answers to common questions about HeySpender
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-black text-black focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  No questions found matching "{searchQuery}". Try a different search term or{' '}
                  <button 
                    onClick={() => router.push('/contact')} 
                    className="text-brand-purple-dark hover:underline font-bold cursor-pointer"
                  >
                    contact us
                  </button>{' '}
                  for help.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {filteredCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 ${category.color} border-2 border-black`}>
                        <category.icon className="w-6 h-6 text-black" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-black">
                        {category.title}
                      </h2>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      {category.questions.map((item, questionIndex) => {
                        const index = `${categoryIndex}-${questionIndex}`;
                        const isOpen = openIndex === index;

                        return (
                          <motion.div
                            key={questionIndex}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="border-2 border-black bg-white"
                          >
                            <button
                              onClick={() => toggleQuestion(categoryIndex, questionIndex)}
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
                  </motion.div>
                ))}
              </div>
            )}
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
                Can't find the answer you're looking for? We're here to help!
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
                  onClick={() => router.push('/explore')}
                  size="lg" 
                  variant="custom" 
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Explore Wishlists</span>
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

export default FAQPage;
