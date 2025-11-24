import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiSearch, FiCopy, FiAlertTriangle } from "react-icons/fi";

export default function KeywordResearch() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [licenseData, setLicenseData] = useState(null);
  const [usage, setUsage] = useState(null);

  /* -------------------------------------------------------
     LOAD LICENSE + USAGE (Spark tier only)
  ------------------------------------------------------- */
  useEffect(() => {
    async function loadInfo() {
      const lic = await window.api.loadSavedLicense();
      setLicenseData(lic);

      if (lic && lic.tier === "Kiln Spark") {
        const usageRes = await window.api.getUsage();
        setUsage(usageRes?.usage || {});
      }
    }

    loadInfo();
  }, []);

  /* -------------------------------------------------------
     RUN KEYWORD RESEARCH (Worker API)
  ------------------------------------------------------- */
  const runResearch = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    // Spark → daily 10 limit
    if (licenseData?.tier === "Kiln Spark" && usage?.keywords >= 10) {
      toast.error("Daily keyword research limit reached for Spark tier.");
      return;
    }

    setLoading(true);
    toast.loading("Generating keyword ideas…", { id: "kr" });

    try {
      const res = await window.api.sendSecureRequest("/keywords", { topic });

      if (res?.error) {
        toast.error(res.error, { id: "kr" });
        setLoading(false);
        return;
      }

      if (!res?.keywords || !Array.isArray(res.keywords)) {
        toast.error("Worker returned invalid keyword data.", { id: "kr" });
        setLoading(false);
        return;
      }

      setResults(res);
      toast.success("Keyword research complete!", { id: "kr" });

      // Refresh Spark usage
      if (licenseData?.tier === "Kiln Spark") {
        const usageRes = await window.api.getUsage();
        setUsage(usageRes?.usage || {});
      }

    } catch (err) {
      console.error(err);
      toast.error("Error generating keywords", { id: "kr" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY RESULTS
  ------------------------------------------------------- */
  const copyResults = () => {
    if (!results?.keywords) return;

    const text = results.keywords
      .map(
        (k) =>
          `${k.keyword} — Volume: ${k.volume} — Difficulty: ${k.difficulty}`
      )
      .join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Keyword Research"
        description="Generate SEO keyword suggestions with volume and difficulty scoring."
      />

      {/* Spark usage badge */}
      {licenseData?.tier === "Kiln Spark" && usage && (
        <div className="card" style={{ marginBottom: "15px" }}>
          <p>
            <FiAlertTriangle /> <strong>Spark Daily Usage:</strong>{" "}
            {usage.keywords || 0}/10 keyword searches used
          </p>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiSearch className="card-icon" />
          Keyword Topic
        </h3>

        <textarea
          className="input-textarea"
          placeholder="Enter a topic…"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          onClick={runResearch}
          disabled={loading}
        >
          {loading ? "Generating…" : "Run Keyword Research"}
        </button>
      </div>

      {/* RESULTS CARD */}
      {results?.keywords && (
        <div className="card">
          <h3
            className="card-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Keyword Results</span>
            <button className="btn-icon" onClick={copyResults} title="Copy">
              <FiCopy size={18} />
            </button>
          </h3>

          <div className="keyword-list">
            {results.keywords.map((item, i) => (
              <div key={i} className="keyword-row">
                <span className="keyword-term">{item.keyword}</span>

                <div className="keyword-metrics">
                  <span>Vol: {item.volume}</span>
                  <span>Diff: {item.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
