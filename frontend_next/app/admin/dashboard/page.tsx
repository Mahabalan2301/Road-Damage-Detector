'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Users, AlertCircle, MapPin, Calendar, Edit } from 'lucide-react'
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
  username: string
  full_name: string
  email: string
  phone?: string
  admin_notes?: string
  annotated_image_path?: string
}

export default function AdminDashboard() {
  const { user, token, logout, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTicket, setEditingTicket] = useState<number | null>(null)
  const [updateForm, setUpdateForm] = useState({ status: '', admin_notes: '' })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!isAdmin) {
      router.push('/dashboard')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, isAdmin, token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all tickets
      const ticketsResponse = await axios.post(`${API_URL}/api/tickets/all`, {
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

  const handleUpdateTicket = async (ticketId: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/tickets/${ticketId}/update`, {
        token,
        status: updateForm.status,
        admin_notes: updateForm.admin_notes
      })

      if (response.data.success) {
        await fetchDashboardData()
        setEditingTicket(null)
        setUpdateForm({ status: '', admin_notes: '' })
      }
    } catch (err: any) {
      setError('Failed to update ticket')
    }
  }

  const startEditing = (ticket: Ticket) => {
    setEditingTicket(ticket.id)
    setUpdateForm({
      status: ticket.status,
      admin_notes: ticket.admin_notes || ''
    })
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
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-red-600 bg-red-50'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <span className="text-xl font-bold">Road Damage MS - Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Admin
              </span>
              <span className="text-gray-700">{user?.full_name}</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all road damage reports</p>
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
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Total Users</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_users}</div>
            </div>
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
          <h2 className="text-xl font-bold mb-4">All Tickets</h2>
          
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
              <p className="text-gray-600">Tickets will appear here when users report damage</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{ticket.title}</h3>
                        <span className={getStatusBadge(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600">{ticket.description}</p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="text-sm">
                      <strong>Reported by:</strong> {ticket.full_name} (@{ticket.username})
                    </div>
                    <div className="text-sm text-gray-600">
                      Email: {ticket.email} {ticket.phone && `| Phone: ${ticket.phone}`}
                    </div>
                  </div>

                  {/* Location & Date */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ticket.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Damage Stats */}
                  {ticket.damage_percentage !== undefined && (
                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Damage: </span>
                          <span className="font-semibold text-red-600">{ticket.damage_percentage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Detections: </span>
                          <span className="font-semibold">{ticket.total_detections}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {ticket.annotated_image_path && (
                    <div className="mb-4">
                      <img
                        src={`${API_URL}/outputs/${ticket.annotated_image_path}`}
                        alt="Damage analysis"
                        className="w-full max-w-md rounded-lg"
                      />
                    </div>
                  )}

                  {/* Admin Actions */}
                  {editingTicket === ticket.id ? (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Status</label>
                        <select
                          value={updateForm.status}
                          onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                          className="input"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Admin Notes</label>
                        <textarea
                          value={updateForm.admin_notes}
                          onChange={(e) => setUpdateForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                          rows={3}
                          className="input"
                          placeholder="Add notes about this ticket..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateTicket(ticket.id)}
                          className="btn btn-primary"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingTicket(null)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {ticket.admin_notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                          <div className="text-sm font-semibold text-yellow-900 mb-1">Admin Notes:</div>
                          <div className="text-sm text-yellow-800">{ticket.admin_notes}</div>
                        </div>
                      )}
                      <button
                        onClick={() => startEditing(ticket)}
                        className="btn btn-outline flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Update Status</span>
                      </button>
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

