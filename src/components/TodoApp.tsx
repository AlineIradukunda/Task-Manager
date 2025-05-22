import React, { useState, useEffect } from 'react';
import './TodoApp.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string; // Added dueDate (ISO format)
}

const TodoApp: React.FC = () => {
  // Load todos from localStorage or use default initial todos
  const [todos, setTodos] = useState<Todo[]>(() => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  } else {
    return []; // Start with no tasks
  }
});


  // Save todos to localStorage every time todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const [activeFilter, setActiveFilter] = useState<'active' | 'completed' | 'all'>('all');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [dueDate, setDueDate] = useState(''); // New state for due date

  const handleAddTodo = () => {
    if (newTodoText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText,
        completed: false,
        dueDate,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setDueDate('');
      setShowInput(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <div className="add-task-container">
        <button className="add-button" onClick={() => setShowInput(!showInput)}>+</button>

        {showInput && (
          <div className="add-input-inside-button">
            <input
              type="text"
              placeholder="Write your task..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button className="submit-button" onClick={handleAddTodo}>Add Task</button>
          </div>
        )}
      </div>

      <div className="filters">
        <button className={`filter ${activeFilter === 'active' ? 'active' : ''}`} onClick={() => setActiveFilter('active')}>Active</button>
        <button className={`filter ${activeFilter === 'completed' ? 'active' : ''}`} onClick={() => setActiveFilter('completed')}>Completed</button>
        <button className={`filter ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All todos</button>
      </div>

      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id ? { ...t, completed: !t.completed } : t
                    )
                  )
                }
              />
              <span className={`text ${todo.completed ? 'line-through' : ''}`}>
                {todo.text}
              </span>
              {todo.dueDate && (
                <small style={{ display: 'block', fontSize: '0.75rem', color: '#E3EEB2' }}>
                  Due: {new Date(todo.dueDate).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </small>
              )}
            </label>
            <button
              className="delete"
              onClick={() => {
                setTodos(todos.filter((t) => t.id !== todo.id));
                if (selectedTodoId === todo.id) {
                  setSelectedTodoId(null);
                }
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
