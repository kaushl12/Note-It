import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import NotedetailPage from './pages/NotedetailPage'
import toast from 'react-hot-toast'

const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
        <Route path="/note/:id" element={<NotedetailPage/>}/>
        
      </Routes>
    </div>
  )
}

export default App
