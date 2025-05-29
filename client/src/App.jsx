import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LoginPage from './pages/loginPage'
import MainPage from './pages/mainPage'
import ProfilePage from './pages/profilePage'
import AssignmentPage from './pages/assignmentPage'
import MainLayout from './layout/mainLayout'

function App() {
  const router = createBrowserRouter([{ 
    path: "",
    element: <MainLayout />, 
    children: [{path: "/", element: <MainPage />}, 
        {path: "/login", element: <LoginPage />},
        {path: "/profile/:id", element: <ProfilePage />},
        {path: "/assignment", element: <AssignmentPage />},
    ]}]);

  return <RouterProvider router={router} />
}

export default App
