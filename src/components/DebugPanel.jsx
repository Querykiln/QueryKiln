import React from "react";
import { useDebug } from "../context/DebugContext";

export default function DebugPanel() {
  const { logs, open, setOpen } = useDebug();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "420px",
        height: "100vh",
        background: "#111",
        color: "#0f0",
        zIndex: 999999,
        overflowY: "auto",
        padding: "16px",
        borderLeft: "2px solid #0f0"
      }}
    >
      <button
        onClick={() => setOpen(false)}
        style={{
          background: "red",
          color: "white",
          padding: "6px 12px",
          marginBottom: "10px"
        }}
      >
        Close Debug
      </button>

      <h2>Debug Logs</h2>

      {logs.length === 0 && <p>No debug data yet.</p>}

      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: "20px", borderBottom: "1px solid #333" }}>
          <p><strong>Endpoint:</strong> {log.endpoint}</p>
          <p><strong>Timestamp:</strong> {log.timestamp}</p>

          <p><strong>Payload:</strong></p>
          <pre>{JSON.stringify(log.payload, null, 2)}</pre>

          <p><strong>Response:</strong></p>
          <pre>{JSON.stringify(log.response, null, 2)}</pre>

          <p><strong>Status:</strong> {log.status}</p>
          <p><strong>Duration:</strong> {log.duration} ms</p>
        </div>
      ))}
    </div>
  );
}
