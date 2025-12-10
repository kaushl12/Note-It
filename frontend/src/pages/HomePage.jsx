import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import RateLimtedUi from '../components/RateLimtedUi'
import axios from "axios"

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false)

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true)

useEffect(()=>{
    const fetchNotes=async ()=>{
        try {
            const res = await axios.get("http://localhost:5001/api/notes/all", {
  withCredentials: true
});
            console.log(res.data);
            
        } catch (error) {
            console.log("Error while fetching notes",error);
            if(error?.response?.status===401){
              console.log("Unauthorized - token missing or expired");
            }
             if (error?.response?.status === 429) {
        setIsRateLimited(true);
      }
        }
    }
    fetchNotes()
},[])

  return (
    <div className='min-h-screen'>
      <Navbar/>
      {isRateLimited && <RateLimtedUi/>}
    </div>
  )
}

export default HomePage
