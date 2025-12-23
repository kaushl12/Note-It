import React from "react";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";

const NoteCard = ({ note, onDelete }) => {
  if (!note) return null;

  return (
    <div className="card bg-base-300 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ccff]">
      
      {/* CARD CLICK AREA */}
      <Link to={`/note/${note._id}`} className="card-body">
        <h3 className="card-title text-base-content">
          {note.title}
        </h3>

        <p className="text-base-content/70 line-clamp-3">
          {note.content}
        </p>
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
              onDelete?.(note._id);
            }}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
