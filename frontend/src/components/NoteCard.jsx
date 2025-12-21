import { PenSquareIcon, Trash2Icon, TrashIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";

const NoteCard = ({ note }) => {
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-300 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00eeff]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <h3 className="text-base-content/70 line-clamp-3">{note.content}</h3>
        <div className="card-actions justify-between items-center mt-4">
          <span>{formatDate(new Date( note.createdAt))}</span>
          <div className="flex items-center gap-1 ">
            <PenSquareIcon className="size-4" />
            <button className="btn btn-ghost btn-xs text-error">
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
