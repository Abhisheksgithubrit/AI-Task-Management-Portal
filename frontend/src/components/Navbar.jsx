import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-lg font-bold text-white shadow-md shadow-primary-500/30">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">AI Task Portal</h1>
            <p className="text-xs text-slate-500">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-bold text-white">
              {initial}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Welcome back</p>
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            </div>
          </div>
          <button type="button" onClick={logout} className="btn-secondary text-xs sm:text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
