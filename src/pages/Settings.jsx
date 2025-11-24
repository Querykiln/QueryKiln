// src/pages/Settings.jsx

import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import {
  FiKey,
  FiCheckCircle,
  FiAlertTriangle,
  FiShoppingCart,
} from "react-icons/fi";

export default function Settings() {
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseData, setLicenseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkingWorker, setCheckingWorker] = useState(false);
  const [workerStatus, setWorkerStatus] = useState(null);

  // NEW — usage tracking
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const STORE_URL = "https://querykiln.lemonsqueezy.com/";

  /* -------------------------------------------------------
     LOAD SAVED LICENSE + FETCH USAGE (Spark)
  ------------------------------------------------------- */
  useEffect(() => {
    window.api.loadSavedLicense().then(async (data) => {
      setLicenseData(data);
      setLoading(false);

      if (data && data.tier === "Kiln Spark") {
        fetchUsage();
      }
    });
  }, []);

  /* -------------------------------------------------------
     FETCH SPARK USAGE
  ------------------------------------------------------- */
  const fetchUsage = async () => {
    setUsageLoading(true);

    const res = await window.api.getUsage();

    if (res?.error) {
      toast.error("Failed to load usage limits");
      setUsage(null);
    } else {
      setUsage(res);
    }

    setUsageLoading(false);
  };

  /* -------------------------------------------------------
     ACTIVATE LICENSE
  ------------------------------------------------------- */
  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      toast.error("Please enter a license key.");
      return;
    }

    toast.loading("Activating license…", { id: "ls" });

    const res = await window.api.validateLicense(licenseKey.trim());

    if (!res.success) {
      toast.error(res.message || "Activation failed.", { id: "ls" });
      return;
    }

    setLicenseData(res);
    toast.success("License activated!", { id: "ls" });

    setLicenseKey("");

    // If Spark, load usage
    if (res.tier === "Kiln Spark") {
      fetchUsage();
    }
  };

  /* -------------------------------------------------------
     DEACTIVATE LICENSE
  ------------------------------------------------------- */
  const handleDeactivate = async () => {
    toast.loading("Removing license…", { id: "ls2" });

    await window.api.clearSavedLicense();
    setLicenseData(null);
    setUsage(null);

    toast.success("License removed.", { id: "ls2" });
  };

  /* -------------------------------------------------------
     CHECK WORKER (API CONNECTIVITY)
  ------------------------------------------------------- */
  const checkWorker = async () => {
    setCheckingWorker(true);
    toast.loading("Testing API…", { id: "wk" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text: "test",
        tone: "neutral",
        style: "default",
      });

      if (res?.error) {
        setWorkerStatus("error");
        toast.error(res.error, { id: "wk" });
      } else {
        setWorkerStatus("ok");
        toast.success("API connection OK!", { id: "wk" });
      }
    } catch (err) {
      setWorkerStatus("error");
      toast.error("API unreachable", { id: "wk" });
    }

    setCheckingWorker(false);
  };

  /* -------------------------------------------------------
     FORMATTERS
  ------------------------------------------------------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="page-container">
      <PageHeader
        title="Settings"
        description="Manage your license and system configuration."
      />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {/* -----------------------------------------------------
             LICENSE CARD
          ----------------------------------------------------- */}
          <div className="card">
            <h3 className="card-title">
              <FiKey className="card-icon" />
              License Key
            </h3>

            {!licenseData ? (
              <>
                <input
                  type="text"
                  className="input"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />

                <button className="btn-primary" onClick={handleActivate}>
                  Activate License
                </button>

                {/* BUY LICENSE */}
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                >
                  <FiShoppingCart /> Buy a License
                </a>
              </>
            ) : (
              <>
                {/* TIER */}
                <p>
                  <strong>Tier:</strong> {licenseData.tier}
                </p>

                {/* STATUS */}
                <p>
                  <strong>Status:</strong>{" "}
                  {licenseData.dev ? "Developer Mode" : licenseData.mode || "Active"}
                </p>

                {/* RENEW DATE */}
                {licenseData.renews_at && (
                  <p>
                    <strong>Renews:</strong> {formatDate(licenseData.renews_at)}
                  </p>
                )}

                {/* LICENSE KEY MASKED */}
                <p>
                  <strong>Key:</strong>{" "}
                  {licenseData.licenseKey?.key
                    ? licenseData.licenseKey.key.replace(/.(?=.{4})/g, "*")
                    : "Hidden"}
                </p>

                {/* REMOVE LICENSE */}
                <button className="btn-danger" onClick={handleDeactivate} style={{ marginTop: "8px" }}>
                  Deactivate License
                </button>

                {/* MANAGE SUBSCRIPTION */}
                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                >
                  <FiShoppingCart /> Manage Subscription
                </a>
              </>
            )}
          </div>

          {/* -----------------------------------------------------
             SPARK USAGE CARD (ONLY FOR FREE TIER)
          ----------------------------------------------------- */}
          {licenseData?.tier === "Kiln Spark" && (
            <div className="card">
              <h3 className="card-title">Daily Usage (Spark)</h3>

              {usageLoading && <p>Loading usage…</p>}

              {!usageLoading && usage && (
                <div>
                  <p><strong>AI Rewrites:</strong> {usage.rewrite}/10</p>
                  <p><strong>Grammar Fixer:</strong> {usage.grammar}/10</p>
                  <p><strong>Keyword Searches:</strong> {usage.keywords}/10</p>

                  <button className="btn-secondary" style={{ marginTop: "10px" }} onClick={fetchUsage}>
                    Refresh Usage
                  </button>
                </div>
              )}

              {!usageLoading && !usage && (
                <p>Could not load usage data.</p>
              )}
            </div>
          )}

          {/* -----------------------------------------------------
             WORKER TEST CARD
          ----------------------------------------------------- */}
          <div className="card">
            <h3 className="card-title">API Connectivity</h3>

            {workerStatus === "ok" && (
              <p className="success-text">
                <FiCheckCircle /> Worker is running normally.
              </p>
            )}

            {workerStatus === "error" && (
              <p className="error-text">
                <FiAlertTriangle /> Worker failed to respond.
              </p>
            )}

            {!workerStatus && <p>Run a quick connection test.</p>}

            <button
              className={`btn-secondary ${checkingWorker ? "btn-disabled" : ""}`}
              disabled={checkingWorker}
              onClick={checkWorker}
            >
              {checkingWorker ? "Testing…" : "Test Worker Connection"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
