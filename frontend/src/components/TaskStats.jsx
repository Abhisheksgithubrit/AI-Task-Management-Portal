const statCards = [
  {
    key: 'total',
    label: 'Total Tasks',
    icon: '📋',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  {
    key: 'todo',
    label: 'To Do',
    icon: '⏳',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: '🚀',
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  {
    key: 'done',
    label: 'Completed',
    icon: '✅',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
];

export default function TaskStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map(({ key, label, icon, gradient, bg, text }) => (
        <div
          key={key}
          className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:shadow-card-hover"
        >
          <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition group-hover:opacity-20`} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                {stats?.[key] ?? 0}
              </p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} text-xl`}>
              {icon}
            </span>
          </div>
          <div className={`mt-3 inline-flex items-center rounded-full ${bg} px-2.5 py-0.5 text-xs font-medium ${text}`}>
            Live stats
          </div>
        </div>
      ))}
    </div>
  );
}
