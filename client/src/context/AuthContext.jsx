import { createContext, useContext, useState } from "react"
import api from "../api/axios.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // LOGIN
  const login = async (data) => {
    setLoading(true)
    const res = await api.post("/user/login", data)
    setUser(res.data.data.user)
    setLoading(false)
  }

  // LOGOUT
  const logout = async () => {
    await api.post("/auth/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
