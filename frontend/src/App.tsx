import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workforce Hub
        </p>
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Employee Scheduling</h1>
        <p className="mb-8 text-base text-slate-700">
          Build weekly schedules, track availability, and keep teams aligned.
        </p>
        <Button className="bg-slate-900 text-white hover:bg-slate-800">Get started</Button>
      </div>
    </div>
  );
}

export default App;
