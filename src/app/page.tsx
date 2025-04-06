// pages/index.js
import React from 'react';
import { 
  Twitter, 
  MessageCircle, 
  Share2, 
  BarChart2, 
  Users, 
  Star, 
  Zap,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Share Your Voice With The World
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-blue-100 sm:text-xl md:mt-5 md:max-w-3xl">
              Connect, engage, and build your audience with our powerful tweet platform designed for creators and thought leaders.
            </p>
          </div>
        </div>
      </div>

      {/* Example Tweet Card */}
      <div className="max-w-xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-bold">JD</span>
            </div>
            <div className="ml-4">
              <h3 className="font-bold">Jane Doe</h3>
              <p className="text-gray-500 text-sm">@janedoe</p>
            </div>
            <div className="ml-auto">
              <Twitter className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="mt-4">Just launched my new website using TweetConnect! The engagement tools are amazing. Already seeing a 40% increase in interactions. #TweetConnect #SocialMedia</p>
          <div className="mt-4 flex text-gray-500 text-sm">
            <span>2:30 PM · Apr 5, 2025</span>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4">
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>24</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <Share2 className="h-5 w-5 mr-1" />
              <span>78</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-red-500">
              <Star className="h-5 w-5 mr-1" />
              <span>342</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>8.2K</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose TweetConnect?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to create impactful tweets and grow your audience.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">
                Get instant insights on your tweet performance. Track engagement metrics and understand your audience better.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Audience Targeting</h3>
              <p className="text-gray-600">
                Reach the right people at the right time. Our AI helps optimize your content for maximum engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Replies</h3>
              <p className="text-gray-600">
                Never miss an important conversation. Automated suggestions help you engage with your community effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How TweetConnect Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              A simple 3-step process to amplify your social presence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up in seconds and connect your existing social accounts to get started.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2">
                <ChevronRight className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Craft Your Content</h3>
                <p className="text-gray-600">
                  Use our intuitive editor and AI-powered suggestions to create engaging tweets.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2">
                <ChevronRight className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">Analyze & Improve</h3>
                <p className="text-gray-600">
                  Track performance metrics and refine your strategy based on actionable insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Join thousands of satisfied creators who&apos;ve transformed their social media presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="font-bold text-purple-700">MK</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Mark Kevin</h4>
                  <p className="text-gray-500 text-sm">Digital Marketer</p>
                </div>
              </div>
              <p className="text-gray-600">
                TweetConnect has revolutionized how I engage with my audience. The analytics tools are incredible, and I&apos;ve seen my engagement rates double in just two months!
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="font-bold text-green-700">SJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600">
                As a content creator, I need tools that save me time while maximizing reach. TweetConnect delivers exactly that. The scheduling features and AI suggestions are game-changers.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center">
                  <span className="font-bold text-orange-700">RL</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Lee</h4>
                  <p className="text-gray-500 text-sm">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-600">
                Our startup gained over 10,000 followers in three months using TweetConnect strategies. The platform made it easy to establish our brand voice and connect with our target audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform Your Social Media Presence?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of creators and businesses who are growing their audience and increasing engagement with TweetConnect.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {/* <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:shadow-lg transition duration-300">
              Sign Up Free
            </button> */}
            <Link href='/signup' className='bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:shadow-lg transition duration-300'>SignUp</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Twitter className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">TweetConnect</span>
              </div>
              <p className="mt-4">
                Empowering voices and building communities through engaging social experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p>© 2025 TweetConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}