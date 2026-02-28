import React, { useState, useRef, useEffect } from "react";
import "@spectrum-web-components/button/sp-button.js";

// Placeholder imports for the tab content
import { CreateTab } from "./CreateTab";
import { SettingsTab } from "./SettingsTab";

export const App = () => {
  const [selectedTab, setSelectedTab] = useState("create");
  const [playHTCred, setPlayHTCred] = useState({
    userId: "",
    secretKey: "",
    gender: "male",
    audio: ""
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#e8eaed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "900px",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(16px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        padding: "32px",
        minHeight: "85vh"
      }}>
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            margin: "0 0 12px 0",
            fontSize: "36px",
            fontWeight: "700",
            background: "linear-gradient(to right, #a18cd1 0%, #fbc2eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px"
          }}>
            MemoMosaic
          </h1>
          <p style={{
            margin: "0",
            fontSize: "16px",
            color: "#a0a0a0",
            fontWeight: "400"
          }}>
            Craft your stories with the power of AI
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div style={{
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          padding: "6px",
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
          width: "fit-content",
          margin: "0 auto 32px auto"
        }}>
          <button
            onClick={() => setSelectedTab("create")}
            style={{
              padding: "10px 24px",
              background: selectedTab === "create"
                ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                : "transparent",
              border: "none",
              borderRadius: "12px",
              color: selectedTab === "create" ? "white" : "#888",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: selectedTab === "create" ? "0 4px 15px rgba(118, 75, 162, 0.4)" : "none"
            }}
          >
            ✨ Create
          </button>
          <button
            onClick={() => setSelectedTab("settings")}
            style={{
              padding: "10px 24px",
              background: selectedTab === "settings"
                ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                : "transparent",
              border: "none",
              borderRadius: "12px",
              color: selectedTab === "settings" ? "white" : "#888",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: selectedTab === "settings" ? "0 4px 15px rgba(118, 75, 162, 0.4)" : "none"
            }}
          >
            ⚙️ Settings
          </button>
        </div>

        <div style={{ animation: "fadeIn 0.5s ease-out" }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {selectedTab === "create" && (
            <CreateTab playHTCred={playHTCred} setPlayHTCred={setPlayHTCred} />
          )}
          {selectedTab === "settings" && (
            <SettingsTab playHTCred={playHTCred} setPlayHTCred={setPlayHTCred} />
          )}
        </div>
      </div>
    </div>
  );
};
