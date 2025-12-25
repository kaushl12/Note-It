import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axiosInstance'
import { LoaderIcon } from 'lucide-react'

const NotedetailPage = () => {
  const [notes, setNotes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate=useNavigate()
  const {id}=useParams();

  useEffect(()=>{
    const fetchNotes=async()=>{
      try {
          const res=await api.get(`/notes/get/${id}`)
          setNotes(res.data.data)
      } catch (error) {
        console.log("fetch fail",error)
          toast.error("Failed to fetch the note")
      }finally{

        setLoading(false)
      }
      
    }
    fetchNotes()
  },[id])
  console.log("NOtes",notes)
  if(loading){
    return(
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
          <LoaderIcon className='animate-spin size-14'/>
      </div>
    )
  }
  return (
    <>
        <div>

        </div>
      </>
  )
}

export default NotedetailPage
