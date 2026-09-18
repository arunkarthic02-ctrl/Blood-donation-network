import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('/users/login', {
        email,
        password
      })

      login(response.data)

      if (response.data.role === 'DONOR') {
        navigate('/donor-dashboard')
      } else if (response.data.role === 'PATIENT') {
        navigate('/patient-dashboard')
      } else if (response.data.role === 'ADMIN') {
        navigate('/admin')
      }
    } catch (error) {
      alert('Invalid email or password')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>BloodConnect</h1>
        <p>Blood Donation & Emergency Matching</p>

        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login