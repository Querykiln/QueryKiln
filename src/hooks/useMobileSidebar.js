// src/hooks/useMobileSidebar.js
import { useState, useCallback } from "react";

export default function useMobileSidebar() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    toggle,
    close,
    openSidebar,
  };
}
