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
import MoreInformationPage from "./pages/MoreInformationPage";  // adjust path if needed


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // your layout wrapper
    children: [
      { index: true, element: <MainPage /> }, // renders at "/"
      { path: "add", element: <AddSpotPage /> }, // renders at "/add"
      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> }, // not logged in
      { path: "profile/:id", element: <ProfilePage /> }, // logged in
      { path: "todos", element: <AssignmentPage /> },
      { path: "spots/:id", element: <MoreInformationPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* other routes you may have */}
//         <Route path="/spots/:id" element={<MoreInformationPage />} />
//       </Routes>
//     </Router>
//   );
// }

//export default App;
