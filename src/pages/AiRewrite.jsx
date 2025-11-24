import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { FiEdit3, FiCopy, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function AiRewrite() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("neutral");
  const [style, setStyle] = useState("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [licenseData, setLicenseData] = useState(null);
  const [usage, setUsage] = useState(null);

  /* -------------------------------------------------------
       LOAD LICENSE + USAGE INFO
  ------------------------------------------------------- */
  useEffect(() => {
    async function loadData() {
      const lic = await window.api.loadSavedLicense();
      setLicenseData(lic);

      if (lic && lic.tier === "Kiln Spark") {
        const usageRes = await window.api.getUsage();
        setUsage(usageRes);
      }
    }
    loadData();
  }, []);

  /* -------------------------------------------------------
       RUN REWRITE (Worker API)
  ------------------------------------------------------- */
  const runRewrite = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to rewrite");
      return;
    }

    // Spark tier limit check
    if (licenseData?.tier === "Kiln Spark" && usage) {
      if (usage.rewrite >= 10) {
        toast.error("Daily rewrite limit reached for Spark tier.");
        return;
      }
    }

    setLoading(true);
    toast.loading("Rewriting text…", { id: "rw" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text,
        tone,
        style,
      });

      // Worker limit error
      if (res?.limit) {
        toast.error("Daily rewrite limit reached.", { id: "rw" });
        setLoading(false);
        return;
      }

      if (res?.error) {
        toast.error(res.error, { id: "rw" });
        setLoading(false);
        return;
      }

      setOutput(res.output || "");
      toast.success("Rewrite complete!", { id: "rw" });

      // Refresh Spark usage
      if (licenseData?.tier === "Kiln Spark") {
        const usageRes = await window.api.getUsage();
        setUsage(usageRes);
      }

    } catch (err) {
      console.error(err);
      toast.error("Rewrite failed", { id: "rw" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
       COPY OUTPUT
  ------------------------------------------------------- */
  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="AI Rewrite"
        description="Rewrite text with improved clarity, flow, and style."
      />

      {/* Spark Usage Badge */}
      {licenseData?.tier === "Kiln Spark" && usage && (
        <div className="card" style={{ marginBottom: "15px" }}>
          <p>
            <FiAlertTriangle /> <strong>Spark Daily Usage:</strong> {usage.rewrite}/10 rewrites used
          </p>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">
          <FiEdit3 className="card-icon" />
          Original Text
        </h3>

        <textarea
          className="input-textarea"
          placeholder="Enter text to rewrite…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="input-row">
          <div className="input-group">
            <label>Tone</label>
            <select
              className="input-select"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          <div className="input-group">
            <label>Style</label>
            <select
              className="input-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="simplified">Simplified</option>
              <option value="detailed">Detailed</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={runRewrite}
        >
          {loading ? "Rewriting…" : "Rewrite Text"}
        </button>
      </div>

      {/* OUTPUT CARD */}
      {output && (
        <div className="card">
          <h3 className="card-title">
            Rewritten Text
            <button className="btn-icon" onClick={copyOutput}>
              <FiCopy size={18} />
            </button>
          </h3>

          <textarea className="output-textarea" value={output} readOnly />
        </div>
      )}
    </div>
  );
}
