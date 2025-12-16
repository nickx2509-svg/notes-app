import { createContext, useContext, useState } from "react"
import api from "../api/axios.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // LOGIN
  const login = async (data) => {
    try {
      setLoading(true)
      const res = await api.post("/user/login", data)
      setUser(res.data.data.user)
    } finally {
      setLoading(false)
    }
  }

  // REGISTER ✅
  const register = async (data) => {
    try {
      setLoading(true)
      const res = await api.post("/user/register", data)
      setUser(res.data.data.user)
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  const logout = async () => {
    await api.post("/auth/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
