type Props = {
  title: string;
  issue: string;
};

/** Stand-in for a route that hasn't been built yet. Tracks which issue will replace it. */
export function PlaceholderPage({ title, issue }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold tracking-wider text-ink-3 uppercase">
        Coming in {issue}
      </p>
      <h1 className="font-display text-5xl text-ink">{title}</h1>
      <p className="max-w-xl text-sm text-ink-3">
        This route is wired up but the screen lives in another issue. Routing,
        guards, and layout are all in place; the body lands when {issue} ships.
      </p>
    </div>
  );
}
