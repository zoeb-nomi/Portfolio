// Shared behaviour for the animated figures.
//
// Every figure is complete without this script and with reduced motion: the markup and CSS draw the final
// state. When motion is allowed, a figure is put in its start frame (data-state="pre") and plays once, the
// first time it scrolls into view. The small Replay link in the figure caption plays it again.

export const motionAllowed = (): boolean => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Show the start frame, commit it, then release it so the CSS transitions run to the final state. */
export function replay(root: HTMLElement): void {
  root.dataset.state = 'pre';
  void root.offsetWidth;
  root.dataset.state = 'run';
}

/** Find every figure root matching `selector`, arm it, and wire its figure's Replay link. */
export function mountFigures(selector: string): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!roots.length || !motionAllowed()) return;

  const wired = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        replay(entry.target as HTMLElement);
      }
    },
    { threshold: 0.35 },
  );

  for (const root of roots) {
    root.dataset.state = 'pre';
    io.observe(root);
    const figure = root.closest('figure');
    const button = figure?.querySelector<HTMLButtonElement>('.ef-replay');
    if (figure && button && !wired.has(figure)) {
      wired.add(figure);
      button.hidden = false;
      button.addEventListener('click', () => {
        figure.querySelectorAll<HTMLElement>('[data-fig]').forEach(replay);
      });
    }
  }
}
