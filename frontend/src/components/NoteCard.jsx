import React, { useState } from "react";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";

const NoteCard = ({ note,onDelete }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

   const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/notes/delete/${note._id}`);
      onDelete(note._id)
      toast.success("Note deleted successfully");
      setOpenModal(false);
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };
  if (!note) return null;

  return (
    <>
    <div className="card bg-base-300 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ccff]">
      {/* CARD CLICK AREA */}
      <Link to={`/note/${note._id}`} className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>

        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
      </Link>

      {/* ACTIONS */}
      <div className="card-actions justify-between items-center px-6 pb-4">
        <span className="text-sm opacity-70">
          {formatDate(new Date(note.createdAt))}
        </span>

        <div className="flex items-center gap-2">
          {/* EDIT */}
          <Link
            to={`/note/edit/${note._id}`}
            className="btn btn-ghost btn-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <PenSquareIcon className="size-4" />
          </Link>

          {/* DELETE */}
          <button
            className="btn btn-ghost btn-xs text-error"
            onClick={(e) => {
              e.stopPropagation();
             setOpenModal(true);
            }}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
    {/* MODAL */}
      <DeleteModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDelete}
      />
      </>
  );
};

export default NoteCard;
