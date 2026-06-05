import { useState } from 'react';
import { generateTaskDetails } from '../api/aiApi';

const emptyForm = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  status: 'TODO',
  estimatedTime: '',
};

function normalizePriority(value) {
  const upper = String(value || 'MEDIUM').toUpperCase();
  if (upper.includes('HIGH')) return 'HIGH';
  if (upper.includes('LOW')) return 'LOW';
  return 'MEDIUM';
}

export default function TaskForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateAi = async () => {
    if (!form.title.trim()) {
      setAiMessage('Please enter a task title first.');
      return;
    }
    setAiLoading(true);
    setAiMessage('');
    try {
      const { data } = await generateTaskDetails(form.title.trim());
      setForm((prev) => ({
        ...prev,
        description: data.description,
        priority: normalizePriority(data.priority),
        estimatedTime: data.estimatedTime,
      }));
      setAiMessage(
        data.aiGenerated
          ? '✨ AI suggestions applied successfully!'
          : '⚡ Fallback suggestions applied (Gemini unavailable).'
      );
    } catch {
      setAiMessage('Could not reach AI service. Please fill fields manually.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description,
        priority: normalizePriority(form.priority),
        dueDate: form.dueDate || null,
        status: form.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const aiSuccess = aiMessage.includes('successfully');

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Task title</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="input-field flex-1"
            placeholder="e.g. Complete quarterly sales report"
          />
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={aiLoading}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition hover:from-accent-600 hover:to-accent-600 disabled:opacity-60"
          >
            {aiLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>✨ Generate AI</>
            )}
          </button>
        </div>
        {aiMessage && (
          <p className={`mt-2 rounded-lg px-3 py-2 text-sm ${aiSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>
            {aiMessage}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none"
          placeholder="Detailed task breakdown..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Due date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Estimated time (AI)</label>
          <input
            name="estimatedTime"
            value={form.estimatedTime}
            onChange={handleChange}
            readOnly
            className="input-field bg-slate-50 text-slate-500"
            placeholder="Auto-filled by AI"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
