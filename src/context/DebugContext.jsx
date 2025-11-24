import React, { createContext, useContext, useState } from "react";

const DebugContext = createContext();

export function DebugProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);

  const addLog = (entry) => {
    setLogs((prev) => [...prev, entry]);
    setOpen(true);
  };

  return (
    <DebugContext.Provider value={{ logs, addLog, open, setOpen }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  return useContext(DebugContext);
}
