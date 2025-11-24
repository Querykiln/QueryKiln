// src/Layout.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiEdit3,
  FiType,
  FiSearch,
  FiList,
  FiLayers,
  FiBookOpen,
  FiTarget,
  FiBarChart2,
  FiSettings,
  FiAlertCircle   // ✔ VALID ICON
} from "react-icons/fi";

import { useDebug } from "./context/DebugContext";

export default function Layout({ children }) {
  const { open, setOpen } = useDebug();

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>QueryKiln</h2>

        <NavLink to="/" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiHome /> Dashboard
        </NavLink>

        <NavLink to="/rewrite" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiEdit3 /> Rewrite
        </NavLink>

        <NavLink to="/grammar" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiType /> Grammar
        </NavLink>

        <NavLink to="/keywords" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiSearch /> Keyword Research
        </NavLink>

        <NavLink to="/backlinks" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiList /> Backlink Checker
        </NavLink>

        <NavLink to="/competitors" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiTarget /> Competitor Analysis
        </NavLink>

        <NavLink to="/gap" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiLayers /> Content Gap
        </NavLink>

        <NavLink to="/plagiarism" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiBookOpen /> Plagiarism
        </NavLink>

        <NavLink to="/seo" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiBarChart2 /> SEO Analyzer
        </NavLink>

        <NavLink to="/serp" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiSearch /> SERP Preview
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <FiSettings /> Settings
        </NavLink>

        {/* Debug Button */}
        <button
          className="nav-item"
          style={{ marginTop: "20px" }}
          onClick={() => setOpen(!open)}
        >
          <FiAlertCircle /> Debug Panel
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {children}
      </main>
    </div>
  );
}
