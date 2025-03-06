import React from 'react'
import { handleLogout } from '../utils/api'

const User = () => {
  return (
    <div>
      <h1>Welcome to User page!</h1>
      <button onClick={handleLogout} className="logout-button">
          Logout
      </button>
    </div>
  )
}

export default User
