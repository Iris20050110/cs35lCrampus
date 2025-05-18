import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TasksByWeek() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    axios.get('/todos').then((r) => setTodos(r.data));
  }, []);

  const getWeekStartDate = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day - 1;
    return new Date(d.setDate(diff));
  };
  
  const weekStartDate = getWeekStartDate(selectedDate);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  const headerLabel = `${
    new Date(weekStartDate.getTime() + 24*60*60*1000).toLocaleDateString(
      undefined, { month: 'short', day: 'numeric' }
    )
  } - ${
    new Date(weekEndDate.getTime() + 24*60*60*1000).toLocaleDateString(
      undefined, { month: 'short', day: 'numeric' }
    )
  }`  

  const shiftWeek = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta * 7);
    setSelectedDate(d);
  };

  const toggleTodo = async (todo) => {
    const { data } = await axios.put(`/todos/${todo._id}`, {
      completed: !todo.completed,
      dueDate: todo.dueDate,
    });
    setTodos(todos.map((x) => (x._id === data._id ? data : x)));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/todos/${id}`);
    setTodos(todos.filter((x) => x._id !== id));
  };

  const renderWeek = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const currentDay = new Date(weekStartDate);
      currentDay.setDate(currentDay.getDate() + i);
      const dayTasks = todos.filter((todo) => {
        const dueDate = new Date(todo.dueDate);
        return dueDate.toDateString() === currentDay.toDateString();
      });
      return (
        <div key={i} className="flex-1 bg-gradient-ash p-2 m-1 rounded-lg shadow-md min-h-[250px]">
          <h3 className="text-center text-oynx text-lg font-semibold mb-2">{currentDay.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' })}</h3>
          {dayTasks.length > 0 ? (
            <ul>
              {dayTasks.map((todo) => (
                <li key={todo._id} className="text-onyx flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="h-4 w-4"
                  />
                  <span className="break-words">{todo.text}</span>
                </div>
                <button
                    onClick={() => deleteTodo(todo._id)}
                    className="ml-2 text-amaranth font-bold self-center relative right-2"
                    >✕</button>
              </li>
              
              ))}
            </ul>
          ) : (
            <p className="text-center text-onyx italic">No tasks</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-[100%] mx-auto my-8 p-4 font-sans">
      <div className="bg-gradient-ash shadow-md p-4 rounded-lg mb-6 flex items-center justify-between">
        <button onClick={() => shiftWeek(-1)} className="btn-nav font-bold">&#60;</button>
        <h2 className="text-2xl font-semibold text-onyx">{headerLabel}</h2>
        <button onClick={() => shiftWeek(1)} className="btn-nav font-bold">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderWeek()}
      </div>
    </div>
  );
}


