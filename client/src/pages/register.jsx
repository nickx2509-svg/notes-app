// pages/Register.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

const Register = () => {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!form.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")

    if (!validate()) return

    try {
      await register(form)
      setSuccess("🎉 Account created successfully!")
      setForm({ username: "", email: "", password: "" })
      navigate("/notes")
    } catch (err) {
      setErrors({
        general: err?.response?.data?.message || "Something went wrong"
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">

        <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        {errors.general && (
          <p className="px-4 py-2 mb-4 text-sm text-red-600 rounded bg-red-50">
            {errors.general}
          </p>
        )}

        {success && (
          <p className="px-4 py-2 mb-4 text-sm text-green-700 rounded bg-green-50">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Password (min 8 chars)"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition bg-black rounded-lg hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span className="font-semibold text-black cursor-pointer">
            <a href="/login">Login</a>
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
