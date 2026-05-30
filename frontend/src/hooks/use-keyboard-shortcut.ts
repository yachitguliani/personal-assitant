"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrlOrMeta = options.ctrl ? e.ctrlKey || e.metaKey : true;
      const shift = options.shift !== undefined ? e.shiftKey === options.shift : true;
      if (e.key.toLowerCase() === key.toLowerCase() && ctrlOrMeta && shift) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options.ctrl, options.meta, options.shift]);
}
