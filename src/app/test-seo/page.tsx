import type { Metadata } from 'next';

// Test page to verify meta tags are working
export const metadata: Metadata = {
  title: 'SEO Test Page — HeySpender',
  description: 'This is a test page to verify that SEO meta tags are working correctly on HeySpender. Testing Open Graph, Twitter Cards, and other social media sharing features.',
  keywords: 'SEO test, meta tags test, social media sharing test, HeySpender',
  openGraph: {
    title: 'SEO Test Page — HeySpender',
    description: 'This is a test page to verify that SEO meta tags are working correctly on HeySpender. Testing Open Graph, Twitter Cards, and other social media sharing features.',
    url: 'https://heyspender.com/test-seo',
    siteName: 'HeySpender',
    images: [
      {
        url: 'https://heyspender.com/HeySpenderMedia/General/HeySpender%20Banner.webp',
        width: 1200,
        height: 630,
        alt: 'HeySpender SEO Test - Meta Tags Working',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Test Page — HeySpender',
    description: 'This is a test page to verify that SEO meta tags are working correctly on HeySpender. Testing Open Graph, Twitter Cards, and other social media sharing features.',
    images: ['https://heyspender.com/HeySpenderMedia/General/HeySpender%20Banner.webp'],
    site: '@heyspender',
    creator: '@heyspender',
  },
  alternates: {
    canonical: 'https://heyspender.com/test-seo',
  },
};

export default function SEOTestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          🧪 SEO Meta Tags Test Page
        </h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            ✅ Test Results
          </h2>
          <p className="text-green-700 mb-4">
            This page is designed to test if SEO meta tags are working correctly.
            If you can see the proper title, description, and image when sharing this page on WhatsApp, Facebook, or Twitter, then the SEO implementation is working!
          </p>
          
          <div className="bg-white border border-green-300 rounded p-4">
            <h3 className="font-semibold text-green-800 mb-2">Expected Results:</h3>
            <ul className="text-green-700 space-y-1">
              <li>• <strong>Title:</strong> "SEO Test Page — HeySpender"</li>
              <li>• <strong>Description:</strong> "This is a test page to verify that SEO meta tags are working correctly..."</li>
              <li>• <strong>Image:</strong> HeySpender Banner image</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            🔗 Test URLs
          </h2>
          <p className="text-blue-700 mb-4">
            Test these URLs on different social media platforms:
          </p>
          
          <div className="space-y-3">
            <div className="bg-white border border-blue-300 rounded p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Homepage:</h3>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                https://heyspender.com
              </code>
            </div>
            
            <div className="bg-white border border-blue-300 rounded p-4">
              <h3 className="font-semibold text-blue-800 mb-2">This Test Page:</h3>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                https://heyspender.com/test-seo
              </code>
            </div>
            
            <div className="bg-white border border-blue-300 rounded p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Item Details Page:</h3>
              <code className="text-sm bg-gray-100 p-2 rounded block">
                https://heyspender.com/awwalgoke/my-38th-birthday/5bfeeaa6-4516-4bb5-9dbd-7273cb34eec0/
              </code>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">
            🛠️ Cache Clearing Tools
          </h2>
          <p className="text-yellow-700 mb-4">
            If you're still seeing old meta tags, clear the social media caches:
          </p>
          
          <div className="space-y-3">
            <div className="bg-white border border-yellow-300 rounded p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Facebook/WhatsApp:</h3>
              <a 
                href="https://developers.facebook.com/tools/debug/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://developers.facebook.com/tools/debug/
              </a>
            </div>
            
            <div className="bg-white border border-yellow-300 rounded p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Twitter:</h3>
              <a 
                href="https://cards-dev.twitter.com/validator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://cards-dev.twitter.com/validator
              </a>
            </div>
            
            <div className="bg-white border border-yellow-300 rounded p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">LinkedIn:</h3>
              <a 
                href="https://www.linkedin.com/post-inspector/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://www.linkedin.com/post-inspector/
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📋 Testing Checklist
          </h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Test homepage on WhatsApp</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Test this page on WhatsApp</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Test item details page on WhatsApp</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Clear Facebook/WhatsApp cache</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Clear Twitter cache</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Verify images are showing</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Verify titles are correct (not generic)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">Verify descriptions are detailed</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
