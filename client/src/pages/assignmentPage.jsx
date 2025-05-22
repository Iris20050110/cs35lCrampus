import { useState, useEffect } from 'react'
import axios from 'axios'

export default function TodoList() {
  const [todos, setTodos]     = useState([])
  const [text, setText]       = useState('')
  const [dueDate, setDueDate] = useState('')

  //fetch on mount
  useEffect(() => {
    axios.get('/todos').then(r => setTodos(r.data))
  }, [])

  const addTodo = async e => {
    e.preventDefault()
    if (!text.trim()) return

    const { data } = await axios.post('/todos', {
      text,
      dueDate: dueDate
    })
    setTodos([data, ...todos])
    setText('')
    setDueDate('')
  }

  const toggleTodo = async t => {
    const { data } = await axios.put(`/todos/${t._id}`, {
      completed: !t.completed,
      dueDate:    t.dueDate
    })
    setTodos(todos.map(x => x._id === data._id ? data : x))
  }

  const deleteTodo = async id => {
    await axios.delete(`/todos/${id}`)
    setTodos(todos.filter(x => x._id !== id))
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Add your Tasks</h1>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          style={{ flex: 1, padding: '0.5rem' }}
          type="text"
          placeholder="Task description…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(t => (
          <li key={t._id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee'
          }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleTodo(t)}
            />
            <div style={{ flex: 1, marginLeft: '0.5rem' }}>
              <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                {t.text}
              </span>
              {t.dueDate && (
                <small style={{ marginLeft: '0.5rem', color: '#666' }}>
                  (due {new Date(t.dueDate).toLocaleDateString()})
                </small>
              )}
            </div>
            <button
              onClick={() => deleteTodo(t._id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#c00',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default assignmentPage
