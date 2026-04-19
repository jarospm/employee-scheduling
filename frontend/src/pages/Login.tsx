import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const HOME_FOR_ROLE = {
  EMPLOYER: '/manager/employees',
  EMPLOYEE: '/staff/availability',
} as const;

export function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@company.com');
  const [password, setPassword] = useState('password123');

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (loggedInUser) => {
      navigate(HOME_FOR_ROLE[loggedInUser.role], { replace: true });
    },
  });

  if (isAuthenticated && user) {
    return <Navigate to={HOME_FOR_ROLE[user.role]} replace />;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="mx-auto flex min-h-screen max-w-sm items-center px-6">
        <form
          onSubmit={onSubmit}
          className="w-full space-y-4 rounded-2xl border border-line-soft bg-paper p-6"
        >
          <div>
            <h1 className="font-display text-3xl text-ink">Sign in</h1>
            <p className="text-sm text-ink-3">Sundsgården scheduling</p>
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
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}
