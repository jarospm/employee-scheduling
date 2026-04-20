import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeekNavigator } from '@/components/WeekNavigator';
import { ApiError, apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { SHIFT_LABEL, SHIFT_TIME, type ShiftType } from '@/lib/colors';
import { thisMonday, toISODate, weekDates } from '@/lib/dates';

const SHIFTS: ShiftType[] = ['MORNING', 'AFTERNOON', 'NIGHT'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const SHIFT_HUE: Record<ShiftType, number> = {
  MORNING: 230,
  AFTERNOON: 190,
  NIGHT: 285,
};

type ScheduleEntry = {
  id: string;
  date: string;
  shiftType: ShiftType;
  employee: { id: string; firstName: string; lastName: string };
};

export function StaffSchedulePage() {
  const { token } = useAuth();
  const [weekOf, setWeekOf] = useState(thisMonday());

  const scheduleQuery = useQuery({
    queryKey: ['my-schedule', weekOf],
    queryFn: () =>
      apiFetch<{ schedule: ScheduleEntry[] }>(`/schedule?weekOf=${weekOf}`, {
        token,
      }),
  });

  // (date|shift) -> true if the employee is scheduled.
  const onCell = useMemo(() => {
    const set = new Set<string>();
    for (const e of scheduleQuery.data?.schedule ?? []) {
      set.add(`${e.date.slice(0, 10)}|${e.shiftType}`);
    }
    return set;
  }, [scheduleQuery.data]);

  const days = useMemo(() => weekDates(weekOf), [weekOf]);
  const shiftCount = onCell.size;

  return (
    <div className="space-y-6">
      <Hero
        weekOf={weekOf}
        shiftCount={shiftCount}
        loading={scheduleQuery.isLoading}
        onWeekChange={setWeekOf}
      />

      {scheduleQuery.isError ? (
        <ErrorBanner error={scheduleQuery.error} />
      ) : (
        <Grid days={days} onCell={onCell} loading={scheduleQuery.isLoading} />
      )}
    </div>
  );
}

function Hero({
  weekOf,
  shiftCount,
  loading,
  onWeekChange,
}: {
  weekOf: string;
  shiftCount: number;
  loading: boolean;
  onWeekChange: (next: string) => void;
}) {
  const eyebrow = loading
    ? `Week of ${weekOf}`
    : `Week of ${weekOf} · ${shiftCount} ${shiftCount === 1 ? 'shift' : 'shifts'}`;
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 flex-[1_1_420px]">
        <p className="mb-2 text-[12px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-[48px] leading-[1.08] text-ink">
          My weekly <i className="text-terracotta">schedule</i>
        </h1>
      </div>
      <WeekNavigator weekOf={weekOf} onChange={onWeekChange} />
    </div>
  );
}

function Grid({
  days,
  onCell,
  loading,
}: {
  days: Date[];
  onCell: Set<string>;
  loading: boolean;
}) {
  const cols = '180px repeat(7, minmax(0, 1fr))';

  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-line-soft bg-paper">
      <div
        className="grid border-b-[1.5px] border-line-soft bg-bg-2"
        style={{ gridTemplateColumns: cols }}
      >
        <div className="px-5 py-3.5 text-[11px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
          Shift
        </div>
        {days.map((d, i) => (
          <div
            key={i}
            className="flex flex-col gap-0.5 border-l border-line-soft px-3 py-3.5"
          >
            <span className="text-[11px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
              {DAY_LABELS[i]}
            </span>
            <span className="font-display text-[18px] leading-tight">
              {MONTHS[d.getMonth()]} {d.getDate()}
            </span>
          </div>
        ))}
      </div>

      {SHIFTS.map((shift, si) => (
        <div
          key={shift}
          className={`grid ${si < SHIFTS.length - 1 ? 'border-b-[1.5px] border-line-soft' : ''}`}
          style={{ gridTemplateColumns: cols }}
        >
          <div className="flex flex-col gap-1 border-r-[1.5px] border-line-soft bg-paper p-5">
            <span className="font-display text-[22px] leading-none">
              {SHIFT_LABEL[shift]}
            </span>
            <span className="font-mono text-[11px] text-ink-3">
              {SHIFT_TIME[shift]}
            </span>
          </div>
          {days.map((d, di) => {
            const date = toISODate(d);
            const on = onCell.has(`${date}|${shift}`);
            return (
              <div
                key={di}
                className="flex min-h-[76px] items-center justify-center border-l border-line-soft p-2"
              >
                {loading ? (
                  <div className="h-11 w-full animate-pulse rounded-md bg-bg-2" />
                ) : on ? (
                  <ScheduledCell shift={shift} />
                ) : (
                  <EmptyCell />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const SHIFT_RANGE: Record<ShiftType, string> = {
  MORNING: '07-15',
  AFTERNOON: '15-22',
  NIGHT: '22-02',
};

function ScheduledCell({ shift }: { shift: ShiftType }) {
  const hue = SHIFT_HUE[shift];
  return (
    <div
      className="flex h-11 w-full flex-col items-center justify-center rounded-md px-1.5 leading-tight"
      style={{
        background: `oklch(0.93 0.06 ${hue})`,
        border: `1.5px solid oklch(0.58 0.12 ${hue})`,
        color: `oklch(0.3 0.11 ${hue})`,
      }}
    >
      <span className="text-[12.5px] font-semibold tracking-[0.02em]">
        Scheduled
      </span>
      <span className="mt-0.5 font-mono text-[10.5px] opacity-90">
        {SHIFT_RANGE[shift]}
      </span>
    </div>
  );
}

function EmptyCell() {
  return (
    <div
      className="flex h-11 w-full items-center justify-center rounded-md text-[13px] text-ink-4"
      style={{ border: '1.5px dashed var(--line-soft)' }}
    >
      -
    </div>
  );
}

function ErrorBanner({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? `${error.status} - ${error.message}`
      : (error as Error).message;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <p className="font-display text-lg text-red-800">
        Could not load your schedule.
      </p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}
