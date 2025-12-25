import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NotedetailPage from "./pages/NotedetailPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoutes from "./context/ProtectedRoutes";

const App = () => {
  return (
    <div data-theme="night">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoutes>
              <CreatePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/note/:id"
          element={
            <ProtectedRoutes>
              <NotedetailPage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
