const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600 ring-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-200',
  HIGH: 'bg-red-50 text-red-700 ring-red-200',
};

const statusStyles = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
  DONE: 'bg-emerald-100 text-emerald-800',
};

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const priorityIcons = { LOW: '↓', MEDIUM: '→', HIGH: '↑' };

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:border-primary-100 hover:shadow-card-hover">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="hidden h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-primary-500 to-accent-500 sm:block" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-700 transition">
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${priorityStyles[task.priority]}`}>
                {priorityIcons[task.priority]} {task.priority}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                {statusLabels[task.status]}
              </span>
              {task.dueDate && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  📅 Due {task.dueDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            className="input-field !py-1.5 !text-sm w-auto min-w-[130px]"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <button type="button" onClick={() => onEdit(task)} className="btn-secondary !py-1.5">
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
