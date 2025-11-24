import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import { FiCopy, FiLock } from "react-icons/fi";

export default function SERPPreview() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState(null);
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
     GENERATE SERP PREVIEW (Worker API)
  ------------------------------------------------------- */
  const generatePreview = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    // Spark tier → block
    if (licenseData?.tier === "Kiln Spark") {
      toast.error("SERP Preview is not included in the Spark plan.");
      return;
    }

    setLoading(true);
    toast.loading("Generating SERP preview…", { id: "serp" });

    try {
      const res = await window.api.sendSecureRequest("/serp-preview", { url });

      if (res?.error) {
        toast.error(res.error, { id: "serp" });
        setLoading(false);
        return;
      }

      setPreview(res);
      toast.success("SERP preview generated!", { id: "serp" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate SERP preview", { id: "serp" });
    }

    setLoading(false);
  };

  /* -------------------------------------------------------
     COPY RESULT
  ------------------------------------------------------- */
  const copyResult = () => {
    if (!preview) return;

    const text = `
Title: ${preview.title}
Description: ${preview.description}
Keywords: ${preview.keywords.join(", ")}
`;

    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="page-container">
      <PageHeader
        title="SERP Preview"
        description="Generate a search result snippet preview for any URL."
      />

      {/* Spark tier lock notice */}
      {licenseData?.tier === "Kiln Spark" && (
        <div className="card" style={{ marginBottom: "15px" }}>
          <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FiLock /> SERP Preview is only available on Ember and Forge plans.
          </p>
        </div>
      )}

      {/* INPUT CARD */}
      <div className="card">
        <h3 className="card-title">Website URL</h3>

        <input
          type="text"
          className="input-text"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className={`btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
          onClick={generatePreview}
        >
          {loading ? "Generating…" : "Generate SERP Preview"}
        </button>
      </div>

      {/* PREVIEW RESULT */}
      {preview && (
        <div className="card serp-card">
          <div
            className="card-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>SERP Result</span>
            <button className="btn-icon" onClick={copyResult}>
              <FiCopy size={18} />
            </button>
          </div>

          <div className="serp-preview-box">
            <h2 className="serp-title">{preview.title}</h2>
            <p className="serp-url">{url}</p>
            <p className="serp-description">{preview.description}</p>

            {preview.keywords?.length > 0 && (
              <div className="serp-keywords">
                <strong>Suggested Keywords:</strong>
                <ul className="mt-1">
                  {preview.keywords.map((kw, i) => (
                    <li key={i}>• {kw}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
