import { useEffect, useRef } from "react";

/**
 * Proximity-magnify behaviour for the ThreeUI "animated top dock".
 *
 * The package ships this logic in an internal module that its `exports` map
 * doesn't expose, and its `AnimatedTopDock` component renders hardcoded demo
 * links. So the physics are ported here to drive our own markup, which keeps
 * the real navigation while reusing the package's `.atd-modern` styling.
 *
 * Every element marked `data-dock-item` inside the returned ref grows as the
 * pointer nears it, easing on a spring. Each item also gets `data-dock-near`,
 * which is what the package stylesheet hooks for the lit-up pill state.
 */
export interface TopDockOptions {
  /** px from an item's centre at which it starts responding */
  proximity: number;
  spring: number;
  damping: number;
  widthGrowth: number;
  heightGrowth: number;
  /** px the item slides down as it grows */
  drop: number;
  /** pin the track's width so growing items don't reflow the bar */
  lockTrack: boolean;
}

// Matches ANIMATED_TOP_DOCK_DEFAULTS for the "modern" variant.
const DEFAULTS: TopDockOptions = {
  proximity: 122,
  spring: 0.19,
  damping: 0.7,
  widthGrowth: 17,
  heightGrowth: 16,
  drop: 3.5,
  lockTrack: true,
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

interface DockItem {
  element: HTMLElement;
  baseWidth: number;
  baseHeight: number;
  value: number;
  velocity: number;
  target: number;
}

function createTopDockController(
  dock: HTMLElement,
  getOptions: () => TopDockOptions
) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)");

  const items: DockItem[] = Array.from(
    dock.querySelectorAll<HTMLElement>("[data-dock-item]")
  ).map((element) => ({
    element,
    baseWidth: 0,
    baseHeight: 0,
    value: 0,
    velocity: 0,
    target: 0,
  }));

  let enabled = false;
  let tracking = false;
  let animating = false;
  let frame = 0;
  let disposed = false;

  // Touch and reduced-motion users get the static bar; the effect needs a real
  // hovering pointer to make any sense.
  const canAnimate = () =>
    !reduceMotion.matches &&
    dock.clientWidth > 0 &&
    window.innerWidth > 600 &&
    finePointer.matches;

  const render = () => {
    const options = getOptions();
    for (const item of items) {
      const amount = clamp(item.value, 0, 1.08);
      // cap horizontal growth so short labels don't stretch out of proportion
      const growWidth = Math.min(options.widthGrowth, item.baseWidth * 0.24);
      item.element.style.width = `${(item.baseWidth + growWidth * amount).toFixed(2)}px`;
      item.element.style.height = `${(item.baseHeight + options.heightGrowth * amount).toFixed(2)}px`;
      item.element.style.transform = `translateY(${(amount * options.drop).toFixed(2)}px)`;
    }
  };

  const measure = () => {
    enabled = canAnimate();
    if (getOptions().lockTrack) dock.style.width = "";

    for (const item of items) {
      item.element.style.width = "";
      item.element.style.height = "";
      item.element.style.transform = "";
      item.element.dataset.dockNear = "false";
    }
    for (const item of items) {
      const rect = item.element.getBoundingClientRect();
      item.baseWidth = rect.width;
      item.baseHeight = rect.height;
      item.value = 0;
      item.velocity = 0;
      item.target = 0;
    }

    tracking = false;
    animating = false;
    if (getOptions().lockTrack) {
      dock.style.width = `${dock.getBoundingClientRect().width.toFixed(2)}px`;
    }
    dock.dataset.dockState = enabled ? "idle" : "static";
    dock.dataset.dockMax = "0.00";
  };

  const settle = () => {
    tracking = false;
    animating = true;
    for (const item of items) {
      item.target = 0;
      item.element.dataset.dockNear = "false";
    }
  };

  const trackPointer = (clientX: number) => {
    if (!enabled) return;
    const options = getOptions();
    const rects = items.map((item) => item.element.getBoundingClientRect());

    items.forEach((item, index) => {
      const rect = rects[index];
      const centre = rect.left + rect.width * 0.5;
      const falloff = clamp(
        1 - Math.abs(clientX - centre) / Math.max(1, options.proximity),
        0,
        1
      );
      // smoothstep, so the growth eases in rather than ramping linearly
      item.target = falloff * falloff * (3 - 2 * falloff);
      item.element.dataset.dockNear = item.target > 0.08 ? "true" : "false";
    });

    tracking = true;
    animating = true;
    dock.dataset.dockState = "active";
  };

  const focusItem = (element: Element) => {
    if (!enabled) return;
    const focused = items.findIndex((item) => item.element === element);
    if (focused < 0) return;

    items.forEach((item, index) => {
      const distance = Math.abs(index - focused);
      item.target = distance === 0 ? 1 : distance === 1 ? 0.24 : 0;
      item.element.dataset.dockNear = item.target > 0.08 ? "true" : "false";
    });
    tracking = false;
    animating = true;
    dock.dataset.dockState = "focus";
  };

  const tick = () => {
    if (enabled && animating) {
      const options = getOptions();
      let moving = false;
      let peak = 0;

      for (const item of items) {
        item.velocity += (item.target - item.value) * options.spring;
        item.velocity *= options.damping;
        item.value += item.velocity;

        if (
          Math.abs(item.target - item.value) < 1e-3 &&
          Math.abs(item.velocity) < 1e-3
        ) {
          item.value = item.target;
          item.velocity = 0;
        } else {
          moving = true;
        }
        peak = Math.max(peak, clamp(item.value, 0, 1.08));
      }

      render();
      dock.dataset.dockMax = peak.toFixed(2);
      if (!moving) {
        animating = false;
        if (items.every((item) => item.target === 0)) {
          dock.dataset.dockState = "idle";
        }
      }
    }
    frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => trackPointer(event.clientX);

  // The bar sits over page content, so also watch for the pointer leaving its
  // bounds entirely — pointerleave alone misses fast exits past a grown item.
  const onWindowPointerMove = (event: PointerEvent) => {
    if (!tracking) return;
    const bounds = dock.getBoundingClientRect();
    const lowest = Math.max(
      bounds.bottom,
      ...items.map((item) => item.element.getBoundingClientRect().bottom)
    );
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > lowest
    ) {
      settle();
    }
  };

  const onFocusIn = (event: FocusEvent) => {
    const item = (event.target as Element | null)?.closest("[data-dock-item]");
    if (item) focusItem(item);
  };

  const onFocusOut = () =>
    requestAnimationFrame(() => {
      if (!dock.contains(document.activeElement)) settle();
    });

  const remeasure = () => {
    if (!disposed) measure();
  };

  // Web fonts land after first paint and change item widths, so measure again.
  void document.fonts?.ready.then(remeasure);

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(dock.parentElement ?? dock);

  dock.addEventListener("pointermove", onPointerMove);
  dock.addEventListener("pointerleave", settle);
  dock.addEventListener("focusin", onFocusIn);
  dock.addEventListener("focusout", onFocusOut);
  dock.addEventListener("click", settle);
  window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
  reduceMotion.addEventListener("change", measure);
  finePointer.addEventListener("change", measure);

  measure();
  frame = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    dock.style.width = "";
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    dock.removeEventListener("pointermove", onPointerMove);
    dock.removeEventListener("pointerleave", settle);
    dock.removeEventListener("focusin", onFocusIn);
    dock.removeEventListener("focusout", onFocusOut);
    dock.removeEventListener("click", settle);
    window.removeEventListener("pointermove", onWindowPointerMove);
    reduceMotion.removeEventListener("change", measure);
    finePointer.removeEventListener("change", measure);
  };
}

export function useTopDock<T extends HTMLElement>(
  options: Partial<TopDockOptions> = {}
) {
  const ref = useRef<T>(null);
  const optionsRef = useRef<TopDockOptions>({ ...DEFAULTS, ...options });
  optionsRef.current = { ...DEFAULTS, ...options };

  useEffect(() => {
    const dock = ref.current;
    if (!dock) return;
    return createTopDockController(dock, () => optionsRef.current);
  }, []);

  return ref;
}
