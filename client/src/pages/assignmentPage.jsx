import React, {useState} from 'react'
import TasksByDay from '../components/tasksByDay'
import CreateTodo from './schedulePage'

const assignmentPage = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <div className="bg-tan min-h-screen font-sans p-6">
      <header className="relative mb-6 h-12">
        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                 text-3xl font-bold text-onyx">Todo List</h1>
        <div className="flex justify-end relative">
          <button
            onClick={() => setShowDropdown(open => !open)}
            className="btn-nav">
              + New Todo
          </button>
          
          {showDropdown && (
          <div
            className={`fixed inset-0 shadow-md
                        g-opacity-75 backdrop-blur-sm
                        z-50 transform transition-transform duration-300 ease-out
                        ${showDropdown ? 'translate-y-0' : '-translate-y-full'}`}
          >
            <div className="absolute inset-0 flex items-start justify-center pt-16 px-4">
              <div className="bg-white w-full max-w-xl relative rounded-lg">
              <div className="relative bg-opacity-100 bg-tan rounded-lg shadow-lg w-full max-w-xl">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="absolute top-2 right-2 text-2xl font-bold text-amaranth"
                >
                  &times;
                </button>
                <CreateTodo />
              </div>
              </div>
            </div>
          </div>
)}
        </div>
       </header>
    
      <TasksByDay />
    </div>
  )
}

export default assignmentPage