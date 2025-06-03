// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import MainPage from "./pages/mainPage";
import AddSpotPage from "./pages/addSpotPage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import AssignmentPage from "./pages/assignmentPage";
import MoreInformationPage from "./pages/MoreInformationPage"; 


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> }, 
      { path: "add", element: <AddSpotPage /> }, 
      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/:id", element: <ProfilePage /> }, 
      { path: "todos", element: <AssignmentPage /> },
      { path: "spots/:id", element: <MoreInformationPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}