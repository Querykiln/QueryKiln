import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiCopy, FiLock } from "react-icons/fi";

export default function SeoAnalyzer() {
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const [licenseData, setLicenseData] = useState(null);

  /* -------------------------------------------------------
     LOAD LICENSE TIER
  ------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      const lic = await window.api.loadSavedLicense();
      setLicenseData(lic);
    }
    load();
  }, []);

  /* -------------------------------------------------------
     RUN SEO ANALYSIS (Worker API)
  ------------------------------------------------------- */
  const runSeoAnalysis = async () => {
    if (!content.trim()) {
      toast.error("Please enter content to analyze.");
      return;
    }

    // ❌ Spark blocked
    if (licenseData?.tier === "Kiln Spark") {
      toast.error("SEO Analyzer is not available on the Spark plan.");
      return;
    }

    // ❌ Ember blocked
    if (licenseData?.tier === "Kiln Ember") {
      toast.error("SEO Analyzer is only available on the Forge plan.");
      return;
    }

    // ✔ Forge allowed (or dev)
    setLoading(true);
    toast.loading("Analyzing SEO…", { id: "seo" });

    try {
      const res = await window.api.sendSecureRequest("/seo", { content });

      if (res?.error) {
        toast.error(res.error, { id: "seo" });
        setLoading(false);
        return;
      }

      setAnalysis(res);
      toast.success("SEO analysis complete!", { id: "seo" });
    } catch (err) {
      console.error(err);
      toast.error("SEO analysis failed", { id: "seo" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY ORIGINAL CONTENT
  ------------------------------------------------------- */
  const copyText = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="SEO Analyzer"
        description="Analyze content for SEO performance, structure, issues, and recommendations."
      />

      {/* Spark/Ember Warning */}
      {(licenseData?.tier === "Kiln Spark" ||
        licenseData?.tier === "Kiln Ember") && (
        <div className="card" style={{ marginBottom: "15px" }}>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FiLock /> SEO Analyzer is only available on the Forge plan.
          </p>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">Content to Analyze</h3>

        <textarea
          className="input-textarea"
          placeholder="Paste your content here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={runSeoAnalysis}
        >
          {loading ? "Analyzing…" : "Run SEO Analysis"}
        </button>
      </div>

      {/* RESULTS CARD */}
      {analysis && (
        <div className="card seo-results">
          <h3 className="card-title">
            SEO Score:{" "}
            <span className="score-chip">{analysis.score || 0}/100</span>
          </h3>

          {/* ISSUES */}
          {analysis.issues?.length > 0 && (
            <div className="result-section">
              <h4>Detected Issues</h4>
              <ul>
                {analysis.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* RECOMMENDATIONS */}
          {analysis.recommendations?.length > 0 && (
            <div className="result-section">
              <h4>Recommendations</h4>
              <ul>
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn-secondary mt-2" onClick={copyText}>
            <FiCopy style={{ marginRight: "6px" }} />
            Copy Original Content
          </button>
        </div>
      )}
    </div>
  );
}
