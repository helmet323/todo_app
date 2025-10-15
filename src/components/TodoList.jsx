import { useState, useRef } from "react";

const defaultTasks = [
  { text: "Task 1", priority: 2 },
  { text: "Task 2", priority: 5 },
  { text: "Task 3", priority: 1 },
  { text: "Task 4", priority: 4 },
  { text: "Task 5", priority: 3 },
];

export default function TodoList() {
  const [tasks, setTasks] = useState(
    [...defaultTasks].sort((a, b) => a.priority - b.priority)
  );
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const taskInputRef = useRef(null);

  const addTask = (e) => {
    e.preventDefault();
    const priority = parseInt(taskPriority);
    if (!taskText || isNaN(priority) || priority <= 0) return;

    const newTask = { text: taskText, priority };
    const newTasks = [...tasks, newTask].sort(
      (a, b) => a.priority - b.priority
    );

    setTasks(newTasks);
    setTaskText("");
    setTaskPriority("");

    if (taskInputRef.current) taskInputRef.current.focus();
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const getMissingPriorities = () => {
    if (tasks.length === 0) return [];
    const existing = tasks.map((t) => t.priority);
    const maxPriority = Math.max(...existing);
    const missing = [];
    for (let i = 1; i < maxPriority; i++) {
      if (!existing.includes(i)) missing.push(i);
    }
    return missing;
  };

  const formatMissing = (missing) => {
    if (missing.length === 0) return "None";
    return missing.join(", ");
  };

  const missing = getMissingPriorities();

  return (
    <div className="bg-white shadow-lg p-6 w-full max-w-md mx-auto font-sans resizable-card">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">ToDo List</h2>

      {/* Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Task description"
          value={taskText}
          ref={taskInputRef}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400"
        />
        <input
          type="number"
          placeholder="Priority"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          className="w-24 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition-colors font-medium"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-3 overflow-auto flex-1">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 transition-all"
          >
            <span className="text-gray-700 font-medium">{task.text}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">
                Priority: {task.priority}
              </span>
              <button
                onClick={() => deleteTask(index)}
                className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Missing Priorities */}
      <div className="mt-4 text-gray-700 font-medium text-sm">
        <strong>Missing Priorities:</strong> {formatMissing(missing)}
      </div>
    </div>
  );
}
