import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskStats from '../components/TaskStats';
import {
  createTask,
  deleteTask,
  getTaskStats,
  getTasks,
  updateTask,
} from '../api/taskApi';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, statsRes] = await Promise.all([getTasks(), getTaskStats()]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load tasks. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data) => {
    await createTask(data);
    setShowForm(false);
    await loadData();
  };

  const handleUpdate = async (data) => {
    await updateTask(editingTask.id, data);
    setEditingTask(null);
    await loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    await loadData();
  };

  const handleStatusChange = async (task, status) => {
    await updateTask(task.id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status,
    });
    await loadData();
  };

  const mapTaskToForm = (task) => ({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate || '',
    status: task.status,
    estimatedTime: '',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      <Navbar />

      {/* Hero banner */}
      <div className="border-b border-slate-200/60 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="animate-fade-in">
              <p className="text-sm font-medium text-indigo-200">Your workspace</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Task Dashboard
              </h2>
              <p className="mt-2 max-w-lg text-indigo-100/90">
                Create, prioritize, and track tasks — with AI-powered suggestions from Gemini.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
            >
              <span className="text-lg">+</span> Create New Task
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 animate-slide-up">
          <TaskStats stats={stats} />
        </section>

        {(showForm || editingTask) && (
          <section className="mb-8 animate-slide-up rounded-2xl border border-slate-100 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 text-white">
                {editingTask ? '✎' : '+'}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <p className="text-sm text-slate-500">
                  Use Generate AI for smart suggestions
                </p>
              </div>
            </div>
            <TaskForm
              key={editingTask?.id || 'new'}
              initialData={editingTask ? mapTaskToForm(editingTask) : undefined}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              submitLabel={editingTask ? 'Update Task' : 'Create Task'}
            />
          </section>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="animate-slide-up">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Tasks</h3>
              <p className="text-sm text-slate-500">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} in your workspace
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-16">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                Loading your tasks...
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 p-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl">
                📋
              </div>
              <p className="text-lg font-semibold text-slate-700">No tasks yet</p>
              <p className="mt-1 text-slate-500">Click Create New Task to get started with AI assistance</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => {
                    setShowForm(false);
                    setEditingTask(t);
                  }}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
