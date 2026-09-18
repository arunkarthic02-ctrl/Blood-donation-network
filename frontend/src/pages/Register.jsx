import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('DONOR')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      await api.post('/users/signup', {
        name,
        email,
        password,
        role
      })

      alert('Registration successful')
      navigate('/')
    } catch (error) {
      alert('Registration failed')
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

        <button type="submit">Create Account</button>

        <p>
          Already have an account?
          <Link to="/"> Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register