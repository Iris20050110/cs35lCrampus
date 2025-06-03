import React, { useState } from "react";
import TasksByDay from "../components/TasksByDay";
import CreateTodo from "./schedulePage";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";
import LoginRequired from "../components/LoginRequired";

const AssignmentPage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated } = useAuth({ redirectIfUnauth: false });

  const toggleDropdown = () => {
    setShowDropdown((open) => !open);
  };

  if (!isAuthenticated) {
    return (
      <LoginRequired message="You must be signed in with a UCLA email to view your todo list." />
    );
  }

  return (
    <div className="bg-tan min-w-screen min-h-screen font-[lexend] pt-5">
      <div className="w-full mb-4 m">
        <NavBar />
      </div>

      <header className="relative mb-6 h-12 w-full">
        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-onyx">
          Todo List
        </h1>
        <div className="flex justify-end relative w-full">
          <button onClick={toggleDropdown} className="btn-nav">
            + New Todo
          </button>

          {showDropdown && (
            <div
              className={`fixed inset-0 shadow-md g-opacity-75 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-out ${
                showDropdown ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="absolute inset-0 flex items-start justify-center pt-16 px-4">
                <div className="bg-white w-full max-w-xl relative rounded-lg">
                  <div className="relative bg-opacity-100 bg-tan rounded-lg shadow-lg w-full max-w-xl">
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="absolute top-2 right-2 p-1 text-3xl font-[bold] bg-transparent text-amaranth"
                    >
                      &times;
                    </button>
                    <CreateTodo dropdown={toggleDropdown} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <TasksByDay />
    </div>
  );
};

export default AssignmentPage;
