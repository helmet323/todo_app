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

  const [edittingText, setEdittingText] = useState("");
  const [edittingPriority, setEdittingPriority] = useState("");
  const [edittingMode, setEdittingMode] = useState(null);

  const [completedTasks, setCompletedTasks] = useState([]);
  const [checked, setChecked] = useState(false);

  const [error, setError] = useState("");

  // exists => true
  const checkPriority = (priority) => {
    const exists = tasks.filter((e) => e.priority === priority);
    return exists.length === 1;
  };

  const addTask = (e) => {
    e.preventDefault();
    const priority = parseInt(taskPriority);
    if (!taskText || isNaN(priority) || priority <= 0) return;

    const checkPrio = checkPriority(priority);
    if (checkPrio) {
      setError("Priority already exists");
      return;
    }
    setError("");

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

  const goIntoEditting = (index, task) => {
    setEdittingMode(index);
    setEdittingPriority(task.priority);
    setEdittingText(task.text);
  };

  const saveEdit = (index) => {
    const priority = parseInt(edittingPriority);
    if (!edittingText || isNaN(priority) || priority <= 0) return;

    const checkPrio = checkPriority(priority);
    if (checkPrio) {
      setError("Priority already exists");
      return;
    }

    setError("");

    const newTask = { text: edittingText, priority };
    const taskList = [...tasks];
    taskList[index] = newTask;
    const sortedTasks = taskList.sort((a, b) => a.priority - b.priority);
    setTasks(sortedTasks);

    setEdittingMode(null);
    setEdittingPriority("");
    setEdittingText("");
  };

  const handleComplete = (index) => {
    const newCompleteList = [...completedTasks, { text: tasks[index].text }];
    setCompletedTasks(newCompleteList);

    const taskList = tasks.filter((e, i) => i != index);
    setTasks(taskList);

    setChecked(false);
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

      {/* Errors */}
      <div className="text-red-600">{error}</div>

      {/* Task List */}
      <div>Tasks</div>
      <ul className="space-y-3 overflow-auto flex-1">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 transition-all"
          >
            {edittingMode !== index ? (
              <>
                <div className="flex gap-4">
                  <input
                    onChange={() => handleComplete(index)}
                    checked={checked}
                    type="checkbox"
                  />
                  <span className="text-gray-700 font-medium">{task.text}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">
                    Priority: {task.priority}
                  </span>
                  <button
                    onClick={() => goIntoEditting(index, task)}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <input type="checkbox" />
                  <input
                    value={edittingText}
                    onChange={(e) => setEdittingText(e.target.value)}
                    className="text-gray-700 font-medium border p-1"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">Priority:</span>
                  <input
                    value={edittingPriority}
                    onChange={(e) => setEdittingPriority(e.target.value)}
                    className="text-gray-700 font-medium border p-1"
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEdittingMode(null)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}

        <div>Completed tasks</div>
        {completedTasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-100 transition-all"
          >
            <span className="text-gray-700 font-medium">{task.text}</span>
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
