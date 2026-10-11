import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function DonorDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchDonorData()
    }
  }, [user?.id])

  const fetchDonorData = async () => {
    setLoading(true)
    try {
      // 1. Fetch real donor profile
      try {
        const profileRes = await api.get(`/donors/profile/user/${user.id}`)
        setProfile(profileRes.data)
      } catch (err) {
        console.warn('Donor profile not found for current user', err)
      }

      // 2. Fetch matched blood requests
      try {
        const requestsRes = await api.get(`/matching/requests-for-donor/${user.id}`)
        setPendingRequests(requestsRes.data || [])
      } catch (err) {
        console.error('Failed to fetch pending requests', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h1>Donor Dashboard</h1>

        <div className="dashboard-grid">
          <div>
            <h3>Blood Group</h3>
            <p>{profile?.bloodGroup || 'Not Configured'}</p>
          </div>

          <div>
            <h3>Availability</h3>
            <p>{profile ? (profile.isAvailable ? 'Available' : 'Unavailable') : 'Profile Pending'}</p>
          </div>

          <div>
            <h3>Requests Matching You</h3>
            <p>{pendingRequests.length} Requests</p>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>Blood Requests Near You</h2>

          {loading && <p>Loading matching requests...</p>}

          {!loading && pendingRequests.length === 0 && (
            <p>No matching requests right now.</p>
          )}

          {!loading && pendingRequests.map(req => (
            <div key={req.requestId} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
              <p><strong>{req.patientName}</strong> needs <strong>{req.bloodGroup}</strong> — {req.unitsNeeded} units — <strong>{req.urgencyLevel}</strong></p>
              <p>Hospital: {req.hospitalName}</p>
              <p>Distance: {req.distanceKm} km away</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default DonorDashboard