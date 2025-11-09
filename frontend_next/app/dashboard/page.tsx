'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Plus, MapPin, Calendar, AlertCircle } from 'lucide-react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Ticket {
  id: number
  title: string
  description: string
  location: string
  status: string
  priority: string
  damage_percentage: number
  total_detections: number
  created_at: string
  annotated_image_path?: string
}

export default function UserDashboard() {
  const { user, token, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch tickets
      const ticketsResponse = await axios.post(`${API_URL}/api/tickets/my`, {
        token
      })

      // Fetch stats
      const statsResponse = await axios.post(`${API_URL}/api/dashboard/stats`, {
        token
      })

      if (ticketsResponse.data.success) {
        setTickets(ticketsResponse.data.tickets)
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats)
      }
    } catch (err: any) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'badge badge-pending',
      in_progress: 'badge badge-in-progress',
      resolved: 'badge badge-resolved',
      rejected: 'badge badge-rejected'
    }
    return styles[status as keyof typeof styles] || 'badge'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🛣️</span>
              <span className="text-xl font-bold">Road Damage MS</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.full_name}</span>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your road damage reports</p>
          </div>
          <button
            onClick={() => router.push('/create-ticket')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ticket</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="text-sm text-gray-600 mb-1">Total Tickets</div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_tickets}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-600 mb-1">In Progress</div>
              <div className="text-3xl font-bold text-blue-600">{stats.in_progress}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-600 mb-1">Resolved</div>
              <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">My Tickets</h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
              <p className="text-gray-600 mb-6">Create your first road damage report</p>
              <button
                onClick={() => router.push('/create-ticket')}
                className="btn btn-primary"
              >
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{ticket.title}</h3>
                      <p className="text-gray-600 text-sm">{ticket.description}</p>
                    </div>
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()} Priority
                    </div>
                  </div>

                  {ticket.damage_percentage !== undefined && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Damage: </span>
                          <span className="font-semibold">{ticket.damage_percentage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Detections: </span>
                          <span className="font-semibold">{ticket.total_detections}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {ticket.annotated_image_path && (
                    <div className="mt-3">
                      <img
                        src={`${API_URL}/outputs/${ticket.annotated_image_path}`}
                        alt="Damage analysis"
                        className="w-full max-w-md rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

