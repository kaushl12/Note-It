import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import DeleteModal from "../components/DeleteModal";

const NotedetailPage = () => {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/notes/delete/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };
  const handleSave = async () => {
    if (!notes.title.trim() || !notes.content.trim()) {
      toast.error("All Fields are required");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/notes/update/${id}`, notes);
      toast.success("Notes Updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error while updating note", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const res = await api.get(`/notes/get/${id}`);
      setNotes(res.data.data);
      setNotFound(false);
    } catch (error) {
      const status = error.response?.status;

      if (status === 404) {
        setNotFound(true);
      } else {
        toast.error("Failed to fetch the note");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, [id]);

  console.log("NOtes", notes);
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-14" />
      </div>
    );
  }
  if (notFound) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Note not found</h2>
      <p className="opacity-70">
        The note you are looking for does not exist or was deleted.
      </p>
      <Link to="/" className="btn btn-primary">
        Go back
      </Link>
    </div>
  );
}
  return (
    <>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to={"/"} className="btn btn-ghost mb-6">
                <ArrowLeftIcon className="size-5" />
                Back to Notes
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
                className="btn btn-error btn-outline "
              >
                <Trash2Icon className="size-4" />
                Delete Note
              </button>
            </div>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input input-bordered"
                  value={notes.title}
                  onChange={(e) =>
                    setNotes({ ...notes, title: e.target.value })
                  }
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write you own note here..."
                  className="textarea textarea-bordered h-32"
                  value={notes.content}
                  onChange={(e) =>
                    setNotes({ ...notes, content: e.target.value })
                  }
                />
              </div>
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving.." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default NotedetailPage;
