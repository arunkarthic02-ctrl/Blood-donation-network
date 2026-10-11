import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function EmergencyRequest() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [units, setUnits] = useState('')
  const [hospital, setHospital] = useState('')
  const [urgency, setUrgency] = useState('URGENT')
  const [latitude, setLatitude] = useState('10.7905')
  const [longitude, setLongitude] = useState('78.7047')
  const [geoStatus, setGeoStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by your browser.')
      return
    }
    setGeoStatus('Detecting location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4)
        const lon = pos.coords.longitude.toFixed(4)
        setLatitude(lat)
        setLongitude(lon)
        setGeoStatus(`Location detected: ${lat}, ${lon}`)
      },
      (err) => {
        setGeoStatus('Could not get GPS location. Using manual coordinates.')
        console.warn('Geolocation error:', err.message)
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await api.post('/requests/create', {
        patientId: user.id,
        bloodGroup,
        unitsNeeded: parseInt(units, 10),
        urgencyLevel: urgency,
        hospitalName: hospital,
        latitude: parseFloat(latitude) || 10.7905,
        longitude: parseFloat(longitude) || 78.7047
      })

      alert('Blood request submitted successfully! Request ID: ' + response.data.id)
      navigate('/patient-dashboard')
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit request'
      alert(msg)
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>BloodConnect</h1>
          <h2>Emergency Blood Request</h2>

          <label>Blood Group</label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <label>Units Required</label>
          <input
            type="number"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />

          <label>Hospital Name</label>
          <input
            type="text"
            placeholder="e.g. Apollo Hospital"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            required
          />

          <label>Urgency Level</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            <option value="URGENT">Urgent</option>
            <option value="CRITICAL">Critical</option>
            <option value="NORMAL">Normal</option>
          </select>

          <label>Hospital Location Coordinates</label>
          <button
            type="button"
            onClick={handleDetectLocation}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '8px',
              border: 'none',
              borderRadius: '4px',
              marginBottom: '8px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            📍 Detect Hospital GPS Location
          </button>
          {geoStatus && <p style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0' }}>{geoStatus}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem' }}>Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem' }}>Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{ marginTop: '20px' }}>
            {submitting ? 'Submitting Request...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </>
  )
}

export default EmergencyRequest