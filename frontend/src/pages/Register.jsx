import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('DONOR')

  // Donor-specific fields
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [gender, setGender] = useState('Male')
  const [latitude, setLatitude] = useState('10.7905')
  const [longitude, setLongitude] = useState('78.7047')
  const [geoStatus, setGeoStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const handleRegister = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 1. Create User account
      const signupRes = await api.post('/users/signup', {
        name,
        email,
        password,
        phone: phone || '9999999999',
        role
      })

      const createdUser = signupRes.data

      // 2. If DONOR, create DonorProfile automatically
      if (role === 'DONOR' && createdUser?.id) {
        await api.post('/donors/profile', {
          userId: createdUser.id,
          bloodGroup,
          gender,
          latitude: parseFloat(latitude) || 10.7905,
          longitude: parseFloat(longitude) || 78.7047
        })
      }

      alert('Registration successful! Please login to continue.')
      navigate('/')
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed'
      alert(msg)
      console.error('Registration error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1>BloodConnect</h1>
        <p>Create your account</p>

        <h2>Register</h2>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Register As</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="DONOR">Blood Donor</option>
          <option value="PATIENT">Patient</option>
        </select>

        {role === 'DONOR' && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Donor Details</h3>

            <label>Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              required
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Location Coordinates</label>
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
              📍 Detect My Current Location
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
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ marginTop: '20px' }}>
          {submitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register