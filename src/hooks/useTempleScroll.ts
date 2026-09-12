import { useEffect } from "react";

declare global {
  // read each frame by the patched Kage renderer (see vite.config.ts) to place
  // the camera along its waypoint spline
  // eslint-disable-next-line no-var
  var __templeScrollProgress: number | undefined;
}

/**
 * Publishes page scroll position as 0..1 for the temple backdrop's camera.
 *
 * The renderer eases toward this value itself, so this only has to report the
 * raw position — no smoothing needed here.
 */
export function useTempleScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      globalThis.__templeScrollProgress =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
    };

    // scroll fires faster than we can paint, so coalesce onto a frame
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const sync = () => {
      if (reduceMotion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        globalThis.__templeScrollProgress = 0;
        window.removeEventListener("scroll", onScroll);
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      apply();
    };

    sync();
    window.addEventListener("resize", onScroll, { passive: true });
    reduceMotion.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduceMotion.removeEventListener("change", sync);
      globalThis.__templeScrollProgress = 0;
    };
  }, []);
}
