import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function BacklinkChecker() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCheck = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    toast.loading("Checking backlinks…", { id: "bl" });

    try {
      const res = await window.api.sendSecureRequest("/backlinks", { domain });

      if (res.error) {
        toast.error(res.error, { id: "bl" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Backlink check complete!", { id: "bl" });
    } catch (err) {
      toast.error("Error checking backlinks", { id: "bl" });
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Backlink Checker"
        description="Analyze backlink totals, referring domains, anchor text distribution, and more."
      />

      {/* INPUT */}
      <div className="card">
        <h3 className="card-title">
          <FiSearch className="card-icon" />
          Domain
        </h3>

        <input
          type="text"
          className="input"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          onClick={runCheck}
        >
          {loading ? "Checking…" : "Run Backlink Check"}
        </button>
      </div>

      {/* RESULTS */}
      {results?.backlink_analysis && (
        <div className="card">
          <h3 className="card-title">Backlink Overview</h3>

          {/* METRICS */}
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-value">{results.backlink_analysis.total_backlinks}</div>
              <div className="metric-label">Total Backlinks</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">{results.backlink_analysis.referring_domains}</div>
              <div className="metric-label">Referring Domains</div>
            </div>
          </div>

          {/* TOP REFERRING DOMAINS */}
          <h4 className="subheading" style={{ marginTop: "20px" }}>
            Top Referring Domains
          </h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Backlinks</th>
              </tr>
            </thead>
            <tbody>
              {results.backlink_analysis.top_referring_domains.map((t, i) => (
                <tr key={i}>
                  <td>{t.domain}</td>
                  <td>{t.backlinks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BACKLINK TYPES */}
          <h4 className="subheading">Backlink Types</h4>
          <ul className="list">
            <li>Dofollow: {results.backlink_analysis.backlink_types.dofollow}</li>
            <li>Nofollow: {results.backlink_analysis.backlink_types.nofollow}</li>
          </ul>

          {/* ANCHOR TEXT */}
          <h4 className="subheading">Anchor Text Distribution</h4>
          <ul className="list">
            {Object.entries(results.backlink_analysis.anchor_text_distribution).map(
              ([k, v], i) => (
                <li key={i}>
                  {k}: {v}%
                </li>
              )
            )}
          </ul>

          {/* COUNTRIES */}
          <h4 className="subheading">Top Countries</h4>
          <ul className="list">
            {Object.entries(results.backlink_analysis.top_countries).map(
              ([k, v], i) => (
                <li key={i}>
                  {k}: {v}%
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
