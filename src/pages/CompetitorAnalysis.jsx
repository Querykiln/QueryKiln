import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FiTrendingUp } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function CompetitorAnalysis() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    toast.loading("Running competitor analysis…", { id: "cmp" });

    try {
      const res = await window.api.sendSecureRequest("/competitors", { domain });

      if (res.error) {
        toast.error(res.error, { id: "cmp" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Competitor analysis complete!", { id: "cmp" });
    } catch (err) {
      toast.error("Failed to run competitor analysis", { id: "cmp" });
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Competitor Analysis"
        description="Analyze strengths, weaknesses, key features, opportunities, and threats in your competitor landscape."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiTrendingUp className="card-icon" />
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
          onClick={runAnalysis}
        >
          {loading ? "Analyzing…" : "Run Analysis"}
        </button>
      </div>

      {/* RESULTS */}
      {results?.competitors && (
        <div className="card">
          <h3 className="card-title">Competitor Overview</h3>

          {/* COMPETITOR LIST */}
          <h4 className="subheading" style={{ marginTop: "20px" }}>
            Competitors
          </h4>

          <table className="data-table">
            <thead>
              <tr>
                <th>Competitor</th>
                <th>Market Share</th>
                <th>Strengths</th>
                <th>Weaknesses</th>
                <th>Key Features</th>
              </tr>
            </thead>

            <tbody>
              {results.competitors.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.market_share}</td>
                  <td>
                    <ul className="list">
                      {c.strengths.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul className="list">
                      {c.weaknesses.map((w, j) => (
                        <li key={j}>{w}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul className="list">
                      {c.key_features.map((k, j) => (
                        <li key={j}>{k}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SUMMARY */}
          <h4 className="subheading" style={{ marginTop: "30px" }}>
            Market Summary
          </h4>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Market Trends</div>
              <div className="metric-value">
                {results.analysis_summary.overall_market_trends}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Opportunities</div>
              <ul className="list">
                {results.analysis_summary.opportunities.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            <div className="metric-card">
              <div className="metric-label">Threats</div>
              <ul className="list">
                {results.analysis_summary.threats.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
