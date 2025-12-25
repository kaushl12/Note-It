import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, UserCog } from "lucide-react";
import api from "../api/axiosInstance";
import { logout } from "../api/auth";

const Navbar = () => {
    const navigate=useNavigate()

    const handleLogout=async()=>{
        try {
            await logout();
            navigate('/login')
        } catch (error) {
            
        }
    }
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
            Note-It 📝
          </h1>
          <div className="flex items-center gap-5">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-4" />
              <span>New Note</span>
            </Link>

            <div className="dropdown dropdown-end dropdown-hover">
              {/* Avatar */}
              <div tabIndex={0} className="avatar cursor-pointer">
                <UserCog className="size-6" />
              </div>

              {/* Dropdown menu */}
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2  bg-base-300 rounded-box w-36"
              >
                <li>
                  <button className="text-error " onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
