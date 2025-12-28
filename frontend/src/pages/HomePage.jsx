import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import RateLimtedUi from "../components/RateLimtedUi";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiRequest";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();

 
  const fetchNotes = useCallback(async () => {
  setLoading(true);
  setIsRateLimited(false);

  try {
    const res = await apiRequest(() =>
      api.get("/notes/all")
    );

    const safeNotes = Array.isArray(res.data?.data?.notes)
      ? res.data.data.notes
      : [];

    setNotes(safeNotes);
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    } else if (status === 429) {
      setIsRateLimited(true);
    } else {
      toast.error("Failed to load notes");
    }
  } finally {
    setLoading(false);
  }
}, [navigate]);


  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteDelete = (deletedId) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note._id !== deletedId)
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      {isRateLimited && <RateLimtedUi />}

      <main className="max-w-7xl mx-auto p-4 mt-6">
        {/* Loading */}
        {loading && (
          <div className="text-center text-primary py-10">
            Loading notes...
          </div>
        )}

        {!loading && !isRateLimited && notes.length === 0 && (
          <NotesNotFound />
        )}

        {!loading && !isRateLimited && notes.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleNoteDelete}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;
