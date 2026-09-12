import { useCallback, useRef } from "react";
import { SpinningBorderButton } from "@designcodeio/threeui";

type LiveDemoButtonProps = {
  href: string;
  /** Accessible name. The button's own label lives inside a sandboxed iframe,
   *  so it is not reliably exposed to assistive tech — this is what is read. */
  label: string;
};

/**
 * threeui renders its buttons as a sandboxed `<iframe srcdoc>`. That has two
 * consequences worth knowing before touching this:
 *
 * 1. The iframe swallows pointer events, and its sandbox is `allow-scripts`
 *    only — no `allow-top-navigation` — so it cannot navigate anywhere itself.
 *    The link has to be a real anchor out here, with the iframe made
 *    transparent to the pointer, which also keeps middle-click, right-click,
 *    focus and screen-reader link semantics working.
 * 2. Because the iframe never sees the pointer, it never sees `:hover` — and
 *    the spinning border is a hover-only effect. vite.config.ts patches a small
 *    message listener into the srcdoc; posting hover state to it is what makes
 *    the beam run. Keyboard focus drives the same thing, so the button reacts
 *    when tabbed to rather than only on mouseover.
 */
const LiveDemoButton = ({ href, label }: LiveDemoButtonProps) => {
  const hostRef = useRef<HTMLAnchorElement>(null);

  const setHover = useCallback((hover: boolean) => {
    hostRef.current
      ?.querySelector("iframe")
      ?.contentWindow?.postMessage(
        { threeuiRuntime: { hover: hover ? 1 : 0 } },
        "*"
      );
  }, []);

  return (
    <a
      ref={hostRef}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="live-demo-button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <SpinningBorderButton
        style={{ pointerEvents: "none", background: "transparent" }}
      />
    </a>
  );
};

export default LiveDemoButton;
