import { useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { apiFetch, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/Avatar';
import { PositionBadge } from '@/components/PositionBadge';

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string | null;
  avatar: string | null;
};

function LoginCard() {
  const { login } = useAuth();
  const [email, setEmail] = useState('owner@company.com');
  const [password, setPassword] = useState('password123');

  const mutation = useMutation({
    mutationFn: () => login(email, password),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-4 rounded-2xl border border-line-soft bg-paper p-6"
    >
      <div>
        <h1 className="font-display text-3xl text-ink">Sign in</h1>
        <p className="text-sm text-ink-3">Data-layer demo</p>
      </div>
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold tracking-wider text-ink-3 uppercase">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full rounded-md border border-line-soft bg-bg px-3 py-2 font-mono text-sm focus:border-ink focus:outline-none"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[11px] font-semibold tracking-wider text-ink-3 uppercase">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full rounded-md border border-line-soft bg-bg px-3 py-2 font-mono text-sm focus:border-ink focus:outline-none"
        />
      </label>
      {mutation.error && (
        <p className="text-sm text-red-700">
          {mutation.error instanceof ApiError
            ? `${mutation.error.status} ${mutation.error.message}`
            : (mutation.error as Error).message}
        </p>
      )}
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}

function EmployeesList({ token }: { token: string }) {
  const query = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiFetch<{ employees: Employee[] }>('/employees', { token }),
  });

  if (query.isLoading)
    return <p className="text-ink-3">Loading employees...</p>;
  if (query.isError) {
    return (
      <p className="text-red-700">
        Failed to load:{' '}
        {query.error instanceof ApiError
          ? `${query.error.status} ${query.error.message}`
          : (query.error as Error).message}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {query.data!.employees.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-line-soft bg-paper p-3"
        >
          <div className="flex items-center gap-3">
            <Avatar
              firstName={e.firstName}
              lastName={e.lastName}
              position={e.position}
            />
            <div>
              <div className="text-sm font-medium text-ink">
                {e.firstName} {e.lastName}
              </div>
              <div className="font-mono text-[11px] text-ink-3">{e.email}</div>
            </div>
          </div>
          <PositionBadge position={e.position} />
        </li>
      ))}
    </ul>
  );
}

function Dashboard() {
  const { user, token, logout } = useAuth();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between rounded-2xl border border-line-soft bg-paper p-4">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-ink-3 uppercase">
            Signed in as {user!.role}
          </p>
          <p className="font-mono text-sm text-ink">{user!.email}</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </header>

      {user!.role === 'EMPLOYER' ? (
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-ink">Employees</h2>
          <EmployeesList token={token!} />
        </section>
      ) : (
        <p className="rounded-2xl border border-line-soft bg-paper p-4 text-sm text-ink-3">
          Logged in as employee. Employee screens land in #17 / #18.
        </p>
      )}
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-bg text-ink">
      <main className="mx-auto max-w-2xl px-6 py-12">
        {isAuthenticated ? <Dashboard /> : <LoginCard />}
      </main>
    </div>
  );
}

export default App;
