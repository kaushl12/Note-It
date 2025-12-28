import React from "react";
import { Link } from "react-router-dom";

const My404Component = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body items-center text-center gap-4">
          <h1 className="text-7xl font-bold text-error">404</h1>

          <h2 className="text-2xl font-semibold">
            Page Not Found
          </h2>

          <p className="text-base-content/70">
            The page you are trying to access does not exist or was moved.
          </p>

          <div className="card-actions mt-4">
            <Link to="/" className="btn btn-primary">
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default My404Component;
