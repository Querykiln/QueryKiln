import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FiLayers } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ContentGap() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runGapAnalysis = async () => {
    if (!text.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setLoading(true);
    toast.loading("Running content gap analysis…", { id: "gap" });

    try {
      const res = await window.api.sendSecureRequest("/content-gap", { text });

      if (res.error) {
        toast.error(res.error, { id: "gap" });
        setLoading(false);
        return;
      }

      setResults(res.content_gap_analysis);
      toast.success("Content gap analysis complete!", { id: "gap" });
    } catch (err) {
      toast.error("Failed to analyze content", { id: "gap" });
    }

    setLoading(false);
  };

  const renderList = (label, items) => (
    <div style={{ marginBottom: "20px" }}>
      <h4 className="subheading">{label}</h4>
      {items?.length > 0 ? (
        <ul className="list">
          {items.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>
      ) : (
        <p style={{ opacity: 0.7 }}>No data</p>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Content Gap Analysis"
        description="Uncover missing keywords, topics, and content opportunities."
      />

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiLayers className="card-icon" />
          Content to Analyze
        </h3>

        <textarea
          className="textarea"
          placeholder="Paste your content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          onClick={runGapAnalysis}
        >
          {loading ? "Analyzing…" : "Run Content Gap Analysis"}
        </button>
      </div>

      {/* RESULTS */}
      {results && (
        <div className="card">
          <h3 className="card-title">Gaps Identified</h3>

          {renderList("Missing Keywords", results.gaps.keywords)}
          {renderList("Missing Topics", results.gaps.topics)}
          {renderList("Audience Needs Not Addressed", results.gaps.audience_needs)}
          {renderList("Competitor Insights Needed", results.gaps.competitor_analysis)}
          {renderList("Content Format Gaps", results.gaps.content_format)}
          {renderList("Depth of Information Gaps", results.gaps.depth_of_information)}

          <h3 className="card-title" style={{ marginTop: "30px" }}>
            Recommendations
          </h3>

          {renderList("Keywords to Target", results.recommendations.keywords)}
          {renderList("Topics to Explore", results.recommendations.topics_to_explore)}
          {renderList("Recommended Content Types", results.recommendations.content_types)}
          {renderList("Additional Resources", results.recommendations.additional_resources)}
        </div>
      )}
    </div>
  );
}
