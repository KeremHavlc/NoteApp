import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrivateNotePage from "./pages/PrivateNotePage";
import PublicNotePage from "./pages/PublicNotePage";
import CalendarPages from "./pages/CalendarPages";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import KeyPage from "./pages/KeyPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddNote from "./components/AddNote";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage";
const App = () => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return (
      <div className="mobile-message">
        Sorry, this app is not supported on mobile devices YET
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RouteControl>
              <HomePage />
            </RouteControl>
          }
        />
        <Route
          path="/privatenote"
          element={
            <RouteControl requireKey={true}>
              <PrivateNotePage />
            </RouteControl>
          }
        />
        <Route
          path="/publicnote"
          element={
            <RouteControl>
              <PublicNotePage />
            </RouteControl>
          }
        />
        <Route
          path="/calendar"
          element={
            <RouteControl>
              <CalendarPages />
            </RouteControl>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteControl>
              <ProfileSettingsPage />
            </RouteControl>
          }
        />
        <Route path="/key" element={<KeyPage />} />
        <Route
          path="/addnote"
          element={
            <RouteControl>
              <AddNote />
            </RouteControl>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Routes>
        <Route
          path="*"
          element={
            <RouteControl>
              <NotFoundPage />
            </RouteControl>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export const RouteControl = ({ children, requireKey = false }) => {
  const authToken = localStorage.getItem("authToken");
  const accessKey = localStorage.getItem("accessKey");
  if (!authToken) {
    return <Navigate to="/login" />;
  }
  if (requireKey && !accessKey) {
    return <Navigate to="/key" />;
  }
  return children;
};

export default App;
