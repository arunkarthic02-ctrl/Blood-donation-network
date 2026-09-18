import { useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function EmergencyRequest() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [units, setUnits] = useState('')
  const [hospital, setHospital] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('URGENT')
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('/requests/create', {
        patientId: user.id,
        bloodGroup,
        unitsNeeded: units,
        urgencyLevel: urgency,
        hospitalName: hospital,
        latitude: 10.7905,
        longitude: 78.7047
      })

      alert('Blood request submitted successfully! Request ID: ' + response.data.id)
      navigate('/patient-dashboard')
    } catch (error) {
      alert('Failed to submit request')
      console.error(error)
    }
  }

  return (
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
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          required
        />

        <label>Location</label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>Urgency</label>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
        >
          <option value="URGENT">Urgent</option>
          <option value="CRITICAL">Critical</option>
          <option value="NORMAL">Normal</option>
        </select>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  )
}

export default EmergencyRequest