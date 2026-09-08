"use client";

import { useEffect, useRef } from "react";

/**
 * Stamps when the form became interactive, so the handler can reject
 * submissions that arrive implausibly fast.
 *
 * Set on the client rather than at render: `Date.now()` during a prerender is
 * an unstable value, and Cache Components refuses to build a page containing
 * one. Stamping after mount also measures the right thing — how long a person
 * actually had the form open.
 *
 * Written to the DOM node through a ref rather than through state: the value is
 * never read during render, so putting it in state would only cause a second
 * render for nothing.
 *
 * With JavaScript off this stays empty and the handler skips the check, falling
 * back to the honeypot and the rate limit.
 */
export function FormTimestamp({ name = "t" }: { name?: string }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);

  return <input ref={ref} type="hidden" name={name} defaultValue="" />;
}
