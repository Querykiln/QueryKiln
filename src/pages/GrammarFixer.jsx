import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiCopy, FiAlertTriangle } from "react-icons/fi";

export default function GrammarFixer() {
  const [text, setText] = useState("");
  const [fixedText, setFixedText] = useState("");
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
        setUsage(usageRes);
      }
    }

    loadInfo();
  }, []);

  /* -------------------------------------------------------
     RUN GRAMMAR FIX (Worker API)
  ------------------------------------------------------- */
  const handleGrammarFix = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to fix.");
      return;
    }

    // Spark limit check
    if (licenseData?.tier === "Kiln Spark" && usage) {
      if (usage.grammar >= 10) {
        toast.error("Daily grammar fix limit reached for Spark tier.");
        return;
      }
    }

    setLoading(true);
    toast.loading("Fixing grammar…", { id: "gf" });

    try {
      const res = await window.api.sendSecureRequest("/grammar", { text });

      // Worker Spark limit reply
      if (res?.limit) {
        toast.error("Daily grammar fix limit reached.", { id: "gf" });
        setLoading(false);
        return;
      }

      if (res?.error) {
        toast.error(res.error, { id: "gf" });
        setLoading(false);
        return;
      }

      setFixedText(res.output || "");
      toast.success("Grammar fixed!", { id: "gf" });

      // Refresh usage for Spark tier
      if (licenseData?.tier === "Kiln Spark") {
        const usageRes = await window.api.getUsage();
        setUsage(usageRes);
      }

    } catch (err) {
      console.error(err);
      toast.error("Grammar fixer failed", { id: "gf" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY OUTPUT
  ------------------------------------------------------- */
  const copyOutput = () => {
    if (!fixedText) return;
    navigator.clipboard.writeText(fixedText);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Grammar Fixer"
        description="Fix grammar, spelling, clarity, and punctuation."
      />

      {/* Spark usage badge */}
      {licenseData?.tier === "Kiln Spark" && usage && (
        <div className="card" style={{ marginBottom: "15px" }}>
          <p>
            <FiAlertTriangle /> <strong>Spark Daily Usage:</strong>{" "}
            {usage.grammar}/10 grammar fixes used
          </p>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">Original Text</h3>

        <textarea
          className="input-textarea"
          placeholder="Enter text to fix…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={handleGrammarFix}
        >
          {loading ? "Fixing…" : "Fix Grammar"}
        </button>
      </div>

      {/* OUTPUT CARD */}
      {fixedText && (
        <div className="card">
          <div
            className="card-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Corrected Text</span>
            <button className="btn-icon" onClick={copyOutput}>
              <FiCopy size={18} />
            </button>
          </div>

          <textarea className="output-textarea" value={fixedText} readOnly />
        </div>
      )}
    </div>
  );
}
