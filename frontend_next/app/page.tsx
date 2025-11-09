'use client'

import Link from 'next/link'
import { CheckCircle, Camera, BarChart3, Shield, Smartphone, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🛣️</span>
              <span className="text-xl font-bold">Road Damage MS</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <Link href="/login" className="btn btn-outline">Login</Link>
              <Link href="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                AI-Powered Road Damage Detection & Management
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Report road damage instantly. Track repairs efficiently. Make roads safer for everyone.
              </p>
              <div className="flex space-x-4">
                <Link href="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <a href="#how-it-works" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                  Learn More
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold">10,000+</div>
                  <div className="text-blue-200">Damages Detected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-blue-200">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5,000+</div>
                  <div className="text-blue-200">Active Users</div>
                </div>
              </div>
            </div>
            
            {/* Hero Card */}
            <div className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Camera className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-lg">AI Detection in Action</span>
              </div>
              
              <div className="bg-gray-100 h-48 rounded-lg mb-6 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🔍</div>
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Damage</div>
                  <div className="font-bold text-lg">12.5%</div>
                </div>
                <div>
                  <div className="text-gray-500">Areas</div>
                  <div className="font-bold text-lg">3</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="font-bold text-lg text-green-600">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage road damage effectively</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="AI-Powered Detection"
              description="Advanced YOLOv8 segmentation model detects potholes, cracks, and road damage with 95%+ accuracy"
            />
            <FeatureCard 
              icon={<Camera className="w-8 h-8" />}
              title="Instant Reporting"
              description="Snap a photo and report damage in seconds. Include location, description, and photos automatically"
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8" />}
              title="Real-time Tracking"
              description="Track ticket status from submission to resolution. Get updates when repairs are scheduled"
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8" />}
              title="Priority Management"
              description="Automatic priority assignment based on damage severity. Critical issues get immediate attention"
            />
            <FeatureCard 
              icon={<Smartphone className="w-8 h-8" />}
              title="Mobile Friendly"
              description="Works seamlessly on any device. Report damage on-the-go with your smartphone camera"
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Private"
              description="Your data is protected with industry-standard encryption and secure authentication"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 4-step process to report and track road damage</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard number="1" title="Sign Up" description="Create your free account in seconds. No credit card required" />
            <StepCard number="2" title="Take a Photo" description="Snap a photo of the road damage using your device camera" />
            <StepCard number="3" title="AI Analysis" description="Our AI instantly analyzes the damage and calculates severity" />
            <StepCard number="4" title="Track Progress" description="Monitor your ticket status and receive updates on repairs" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Make Roads Safer?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of users already using our platform</p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Sign Up Now
            </Link>
            <Link href="/login" className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🛣️</span>
                <span className="text-xl font-bold">Road Damage MS</span>
              </div>
              <p className="text-gray-400">AI-powered road damage detection and management platform</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white">Features</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-white">How It Works</a>
                <Link href="/login" className="block text-gray-400 hover:text-white">Login</Link>
                <Link href="/register" className="block text-gray-400 hover:text-white">Sign Up</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@roaddamage.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Road Damage Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

