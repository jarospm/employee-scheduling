import { useState } from 'react';
import { Calendar, Grid3x3, Users } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { PositionBadge } from '@/components/PositionBadge';
import { ShiftChip } from '@/components/ShiftChip';
import { WeekNavigator } from '@/components/WeekNavigator';
import { TopChrome } from '@/components/TopChrome';
import { Logo, LogoMark } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { thisMonday } from '@/lib/dates';

const SAMPLE_PEOPLE = [
  { firstName: 'Eva', lastName: 'Larsson', position: 'Head Waiter' },
  { firstName: 'Elin', lastName: 'Bernsson', position: 'Waiter' },
  { firstName: 'Oskar', lastName: 'Berg', position: 'Runner' },
  { firstName: 'Maja', lastName: 'Nilsson', position: 'Sommelier' },
  { firstName: 'Lukas', lastName: 'Olsson', position: 'Chef' },
  { firstName: 'Anna', lastName: 'Ström', position: 'Bartender' },
];

const MANAGER_TABS = [
  { id: 'employees', label: 'Employees', icon: <Users size={14} /> },
  { id: 'job_schedule', label: 'Job Schedule', icon: <Calendar size={14} /> },
  { id: 'work_schedule', label: 'Work Schedule', icon: <Grid3x3 size={14} /> },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="rounded-2xl border border-line-soft bg-paper p-6">
        {children}
      </div>
    </section>
  );
}

function App() {
  const [tab, setTab] = useState('employees');
  const [week, setWeek] = useState(thisMonday());

  return (
    <div className="min-h-screen bg-bg text-ink">
      <TopChrome
        badge="Manager · Restaurant"
        tabs={MANAGER_TABS}
        activeTab={tab}
        onTabChange={setTab}
        user={{ firstName: 'Anna', lastName: 'Ramos' }}
        onLogout={() => alert('logout')}
      />

      <main className="mx-auto max-w-5xl space-y-10 px-8 py-12">
        <header className="space-y-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
            Foundation demo
          </p>
          <h1 className="font-display text-5xl leading-tight text-ink">
            Primitives, <i className="text-terracotta">in full</i>.
          </h1>
          <p className="max-w-xl text-sm text-ink-3">
            Throwaway showcase for the design tokens and shared components.
            Delete once the real screens land.
          </p>
        </header>

        <Section title="Logo">
          <div className="flex items-center gap-8">
            <LogoMark />
            <Logo />
            <Logo size={28} />
          </div>
        </Section>

        <Section title="Avatars">
          <div className="flex flex-wrap items-center gap-4">
            {SAMPLE_PEOPLE.map((p) => (
              <Avatar key={p.firstName} {...p} />
            ))}
            <Avatar
              firstName="Eva"
              lastName="Larsson"
              position="Head Waiter"
              size={56}
              ring
            />
          </div>
        </Section>

        <Section title="Position badges">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PEOPLE.map((p) => (
              <PositionBadge key={p.position} position={p.position} />
            ))}
            <PositionBadge position="Pastry Chef" size="md" />
          </div>
        </Section>

        <Section title="Shift chips">
          <div className="flex flex-wrap gap-3">
            <ShiftChip shiftType="MORNING" />
            <ShiftChip shiftType="AFTERNOON" />
            <ShiftChip shiftType="NIGHT" />
          </div>
        </Section>

        <Section title="Week navigator">
          <WeekNavigator weekOf={week} onChange={setWeek} />
          <p className="mt-3 font-mono text-[11px] text-ink-3">
            weekOf = {week}
          </p>
        </Section>

        <Section title="Buttons (shadcn, themed)">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Section>

        <Section title="Type stack">
          <div className="space-y-3">
            <p className="font-display text-3xl">Display - Instrument Serif</p>
            <p className="font-sans text-base">
              Body - Inter Variable - the quick brown fox jumps over the lazy
              dog.
            </p>
            <p className="font-mono text-sm">
              Mono - JetBrains Mono - 07:00 - 15:00 - 2026-04-13
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
}

export default App;
