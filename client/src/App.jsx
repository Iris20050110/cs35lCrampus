// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import MainPage from "./pages/mainPage";
import AddSpotPage from "./pages/addSpotPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AssignmentPage from "./pages/AssignmentPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // your layout wrapper
    children: [
      { index: true, element: <MainPage /> }, // renders at "/"
      { path: "add", element: <AddSpotPage /> }, // renders at "/add"
      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "scheduler", element: <AssignmentPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
