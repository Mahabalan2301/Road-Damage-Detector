'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, Loader2, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 text-white hover:opacity-80 transition-opacity">
            <div className="text-5xl">🛣️</div>
            <span className="text-2xl font-bold">RoadGuard AI</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Detect.<br />
            Report.<br />
            Repair.
          </h1>
          
          <p className="text-xl text-white/90 max-w-md">
            AI-powered road damage detection system helping communities maintain safer roads.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-white/20 rounded-lg p-2">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-lg">Instant AI Analysis</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-white/20 rounded-lg p-2">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="bg-white/20 rounded-lg p-2">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-lg">Real-time Tracking</span>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 text-white/60 text-sm">
          © 2024 RoadGuard AI. Powered by YOLOv8
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-gray-900">
              <span className="text-4xl">🛣️</span>
              <span className="text-2xl font-bold">RoadGuard AI</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-900 mb-2">🎯 Demo Credentials</p>
              <div className="space-y-1 text-xs text-indigo-700">
                <p><span className="font-semibold">Admin:</span> admin / admin123</p>
                <p><span className="font-semibold">User:</span> Create new account</p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">New to RoadGuard?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              href="/register"
              className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              Create an account
            </Link>

            {/* Back Home */}
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
