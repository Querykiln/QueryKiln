import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { toast } from "react-hot-toast";
import {
  FiCpu,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiLock,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

export default function Dashboard() {
  const [license, setLicense] = useState(null);
  const [usage, setUsage] = useState(null);

  const [checkingWorker, setCheckingWorker] = useState(false);
  const [workerStatus, setWorkerStatus] = useState(null);

  const [checkingUpdates, setCheckingUpdates] = useState(false);

  /* -------------------------------------------------------
     LOAD LICENSE + USAGE
  ------------------------------------------------------- */
  useEffect(() => {
    async function loadData() {
      const lic = await window.api.loadSavedLicense();
      setLicense(lic);

      // Fetch usage only if Spark (free tier)
      if (lic && lic.tier === "Kiln Spark") {
        const res = await window.api.getUsage();
        if (!res.error) setUsage(res);
      }
    }
    loadData();
  }, []);

  /* -------------------------------------------------------
     CHECK WORKER (API TEST)
  ------------------------------------------------------- */
  const checkWorker = async () => {
    setCheckingWorker(true);
    toast.loading("Checking API connection…", { id: "wk" });

    try {
      const res = await window.api.sendSecureRequest("/rewrite", {
        text: "test",
        tone: "neutral",
        style: "standard",
      });

      if (res?.error) {
        setWorkerStatus("error");
        toast.error("Worker error: " + res.error, { id: "wk" });
      } else {
        setWorkerStatus("ok");
        toast.success("API connection OK", { id: "wk" });
      }
    } catch {
      setWorkerStatus("error");
      toast.error("API unreachable", { id: "wk" });
    }

    setCheckingWorker(false);
  };

  /* -------------------------------------------------------
     CHECK FOR APP UPDATES
  ------------------------------------------------------- */
  const checkUpdates = async () => {
    setCheckingUpdates(true);
    toast.loading("Checking for updates…", { id: "up" });

    const res = await window.api.checkForUpdates();

    if (!res.success) {
      toast.error(res.message || "Update check failed.", { id: "up" });
      setCheckingUpdates(false);
      return;
    }

    if (res.version) {
      toast.success("Update available: v" + res.version, { id: "up" });
    } else {
      toast.success("You are up to date!", { id: "up" });
    }

    setCheckingUpdates(false);
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        description="Overview of your QueryKiln installation."
      />

      {/* -----------------------------------------------------
         LICENSE CARD
      ----------------------------------------------------- */}
      <div className="card">
        <h3 className="card-title">
          <FiLock className="card-icon" />
          License Status
        </h3>

        {license ? (
          <>
            <p>
              <strong>Tier:</strong> {license.tier || "Unknown"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {license.dev ? "Developer Mode" : license.mode || "Active"}
            </p>

            {license.renews_at && (
              <p>
                <strong>Renews:</strong>{" "}
                {new Date(license.renews_at).toLocaleDateString()}
              </p>
            )}

            <p>
              <strong>Key:</strong>{" "}
              {license.licenseKey?.key
                ? license.licenseKey.key.replace(/.(?=.{4})/g, "*")
                : "Unavailable"}
            </p>

            <a href="#/settings">
              <button className="btn-secondary">Manage License</button>
            </a>
          </>
        ) : (
          <>
            <p>No license installed.</p>
            <a href="#/settings">
              <button className="btn-primary">Activate License</button>
            </a>
          </>
        )}
      </div>

      {/* -----------------------------------------------------
         SPARK DAILY USAGE (only shows if Spark)
      ----------------------------------------------------- */}
      {license?.tier === "Kiln Spark" && usage && (
        <div className="card">
          <h3 className="card-title">
            <FiZap className="card-icon" />
            Today’s Usage (Spark)
          </h3>

          <p>
            <strong>AI Rewrite:</strong> {usage.rewrite}/10
          </p>
          <p>
            <strong>Grammar Fix:</strong> {usage.grammar}/10
          </p>
          <p>
            <strong>Keyword Research:</strong> {usage.keywords}/10
          </p>

          <p style={{ marginTop: "10px", opacity: 0.8 }}>
            Usage resets daily at midnight.
          </p>

          <a href="https://querykiln.lemonsqueezy.com" target="_blank">
            <button className="btn-primary" style={{ marginTop: "10px" }}>
              Upgrade to Ember / Forge
            </button>
          </a>
        </div>
      )}

      {/* -----------------------------------------------------
         EMBER UPGRADE CARD
      ----------------------------------------------------- */}
      {license?.tier === "Kiln Ember" && (
        <div className="card">
          <h3 className="card-title">
            <FiTrendingUp className="card-icon" />
            Upgrade Available
          </h3>

          <p>
            You have <strong>Kiln Ember</strong>.  
            Unlock full SEO suite + Competitors + Backlinks + Content Gap.
          </p>

          <a href="https://querykiln.lemonsqueezy.com" target="_blank">
            <button className="btn-primary">Upgrade to Kiln Forge</button>
          </a>
        </div>
      )}

      {/* -----------------------------------------------------
         API CONNECTIVITY
      ----------------------------------------------------- */}
      <div className="card">
        <h3 className="card-title">
          <FiCpu className="card-icon" />
          API Connectivity
        </h3>

        {workerStatus === "ok" && (
          <p className="success-text">
            <FiCheckCircle /> Worker is responding normally.
          </p>
        )}

        {workerStatus === "error" && (
          <p className="error-text">
            <FiAlertTriangle /> Worker failed to respond.
          </p>
        )}

        {!workerStatus && <p>Run a quick connection test.</p>}

        <button
          className={`btn-secondary ${
            checkingWorker ? "btn-disabled" : ""
          }`}
          disabled={checkingWorker}
          onClick={checkWorker}
        >
          {checkingWorker ? "Testing…" : "Test API Connection"}
        </button>
      </div>

      {/* -----------------------------------------------------
         UPDATES
      ----------------------------------------------------- */}
      <div className="card">
        <h3 className="card-title">
          <FiRefreshCw className="card-icon" />
          Updates
        </h3>

        <button
          className={`btn-primary ${
            checkingUpdates ? "btn-disabled" : ""
          }`}
          disabled={checkingUpdates}
          onClick={checkUpdates}
        >
          {checkingUpdates ? "Checking…" : "Check for Updates"}
        </button>
      </div>
    </div>
  );
}
