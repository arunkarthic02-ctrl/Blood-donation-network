import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav>
      <h2>BloodConnect</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/notifications">Notifications</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar