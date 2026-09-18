import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function PatientDashboard() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [matches, setMatches] = useState({})

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    try {
      const response = await api.get('/requests/create')
      // Filter requests belonging to this patient (temporary client-side filter)
      const myRequests = response.data.filter(r => r.patient.id === user.id)
      setRequests(myRequests)

      // Fetch matches for each request
      myRequests.forEach(req => fetchMatches(req.id))
    } catch (error) {
      console.error('Failed to fetch requests', error)
    }
  }

  const fetchMatches = async (requestId) => {
    try {
      const response = await api.get(`/matching/find/${requestId}`)
      setMatches(prev => ({ ...prev, [requestId]: response.data }))
    } catch (error) {
      console.error('Failed to fetch matches', error)
    }
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <h1>Patient Dashboard</h1>

        <div className="dashboard-grid">
          <div>
            <h3>Blood Requests</h3>
            <p>{requests.length} Requests</p>
          </div>

          <div>
            <h3>Active Requests</h3>
            <p>{requests.filter(r => r.status === 'PENDING').length} Active</p>
          </div>

          <div>
            <h3>Total Matched Donors</h3>
            <p>{Object.values(matches).reduce((sum, arr) => sum + arr.length, 0)} Donors</p>
          </div>
        </div>

        <Link to="/emergency-request">
          <button className="dashboard-button">Request Blood</button>
        </Link>

        <div style={{ marginTop: '30px' }}>
          <h2>My Requests & Matched Donors</h2>

          {requests.length === 0 && <p>No requests yet.</p>}

          {requests.map(req => (
            <div key={req.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
              <p><strong>{req.bloodGroup}</strong> — {req.unitsNeeded} units needed — <strong>{req.urgencyLevel}</strong> — Status: {req.status}</p>
              <p>Hospital: {req.hospitalName}</p>

              <h4>Matched Donors:</h4>
              {matches[req.id] && matches[req.id].length > 0 ? (
                <ul>
                  {matches[req.id].map((m, idx) => (
                    <li key={idx}>
                      {m.donorName} ({m.donorBloodGroup}) — {m.distanceKm} km away — Phone: {m.donorPhone} — Score: {m.matchScore}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No matches found yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PatientDashboard