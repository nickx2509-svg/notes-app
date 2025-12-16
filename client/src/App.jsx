import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login.jsx"
import Register from "./pages/register.jsx"
import Notes from "./pages/note.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
