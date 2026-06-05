import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-800 to-primary-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
            ✦
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-white">
            AI Task Portal
          </h1>
          <p className="mt-4 max-w-sm text-lg text-indigo-100/90">
            Smart task management powered by Google Gemini. Organize, prioritize, and ship faster.
          </p>
        </div>
        <ul className="relative z-10 space-y-4 text-sm text-indigo-100/80">
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">✓</span>
            JWT secured authentication
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">✓</span>
            AI-generated descriptions & priorities
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">✓</span>
            Real-time task analytics dashboard
          </li>
        </ul>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col justify-center bg-gradient-to-b from-slate-50 to-indigo-50/30 px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md animate-slide-up">
          <div className="mb-8 lg:hidden">
            <span className="text-2xl font-bold text-primary-700">✦ AI Task Portal</span>
          </div>
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-500">{subtitle}</p>
            {children}
          </div>
          <p className="mt-6 text-center text-sm text-slate-600">
            {footerText}{' '}
            <Link to={footerLink} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
