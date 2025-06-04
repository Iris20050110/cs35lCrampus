import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

export default function TasksByDay() {
  const [todos, setTodos] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    axios
      .get('/api/todos')
      .then((res) => setTodos(res.data))
      .catch((err) => console.error('Error fetching todos:', err));
  }, [])

  const getWeekStartDate = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const weekStartDate = getWeekStartDate(selectedDate)
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekStartDate.getDate() + 6)

  const headerLabel = `${
    new Date(weekStartDate.getTime()).toLocaleDateString(
      undefined,
      { month: 'short', day: 'numeric' }
    )
  } - ${
    new Date(weekEndDate.getTime()).toLocaleDateString(
      undefined,
      { month: 'short', day: 'numeric' }
    )
  }`

  const shiftWeek = (delta) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + delta * 7)
    setSelectedDate(d)
  }

  const toggleTodo = async (todo) => {
    try {
      const { data } = await axios.put(
        `/api/todos/${todo._id}`,
        {
          completed: !todo.completed,
          dueDate: todo.dueDate,
        }
      )
      setTodos((prev) =>
        prev.map((x) => (x._id === data._id ? data : x))
      )
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  };

  const renderWeek = () =>
    Array.from({ length: 7 }).map((_, i) => {
      const currentDay = new Date(weekStartDate);
      currentDay.setDate(currentDay.getDate() + i)

      const dayTasks = todos.filter((todo) => {
        const due = new Date(todo.dueDate)
        due.setDate(due.getDate() + 1)
        return due.toDateString() === currentDay.toDateString()
      });

      return (
        <div
          key={i}
          className="font-[lexend] flex-1 bg-gradient-ash p-2 m-1 rounded-lg shadow-md min-h-[250px] transition-transform duration-300 hover:scale-103 hover:shadow-2xl"
        >
          <h3 className="text-center text-onyx text-lg font-bold mb-2">
            {currentDay.toLocaleDateString(undefined, {
              weekday: 'short',
              timeZone: 'UTC',
            })}
          </h3>
          {dayTasks.length > 0 ? (
            <ul>
              {dayTasks.map((todo) => (
                <li
                  key={todo._id}
                  className="text-onyx flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                      className="h-4 w-4"
                    />
                    <span className={`break-words ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-2xl text-amaranth bg-transparent p-0"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-onyx italic">No tasks</p>
          )}
        </div>
      );
    });

  return (
    <div className="font-[lexend] w-full my-8 p-4 font-sans">
      <div className="bg-gradient-ash shadow-md p-4 rounded-lg mb-6 flex items-center justify-between">
        <button onClick={() => shiftWeek(-1)} className="btn-nav font-bold transition-transform duration-300 hover:scale-103 hover:shadow-2xl">
          &#60;
        </button>
        <h2 className="text-2xl font-bold text-onyx">{headerLabel}</h2>
        <button onClick={() => shiftWeek(1)} className="btn-nav font-bold transition-transform duration-300 hover:scale-103 hover:shadow-2xl">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 w-full">{renderWeek()}</div>
    </div>
  );
}
