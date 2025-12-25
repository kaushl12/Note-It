import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimtedUi from "../components/RateLimtedUi";
import axios from "axios";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notes/all", {
          withCredentials: true,
        });

         const safeNotes = Array.isArray(res.data.data?.notes)? res.data.data.notes : [];

      setNotes(safeNotes);
      setIsRateLimited(false);
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401) {
          toast.error("Unauthorized - token missing or expired");
        } else if (status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteDelete=(deletedId)=>{
    setNotes((prevNotes)=>prevNotes.filter((note)=>note._id !== deletedId))
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimtedUi />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading...</div>
        )}

        {notes.length === 0 && !loading && !isRateLimited && <NotesNotFound/>}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onDelete={handleNoteDelete } />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
