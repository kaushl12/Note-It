import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NotedetailPage from './pages/NotedetailPage'
import Register from './pages/Register'
import Login from './pages/Login'


const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/note/:id" element={<NotedetailPage/>}/>
        
      </Routes>
    </div>
  )
}

export default App
