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
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        minHeight: "100vh",
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
        borderRadius: "0 0 16px 16px"
      }}>
        <div style={{
          marginBottom: "32px",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "16px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "12px",
          padding: "24px",
          margin: "0 -24px 32px -24px"
        }}>
          <h1 style={{
            margin: "0 0 8px 0",
            fontSize: "28px",
            fontWeight: "600",
            color: "#2c2c2c",
            textAlign: "center"
          }}>
            MemoMosaic
          </h1>
          <p style={{
            margin: "0",
            fontSize: "16px",
            color: "#666",
            fontStyle: "italic",
            textAlign: "center"
          }}>
            Create beautiful memories with AI-powered storytelling
          </p>
        </div>
        
        {/* Custom Tab Navigation */}
        <div style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "12px",
          padding: "8px",
          display: "flex",
          gap: "8px"
        }}>
          <button
            onClick={() => setSelectedTab("create")}
            style={{
              flex: 1,
              padding: "12px 24px",
              background: selectedTab === "create" 
                ? "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)" 
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: selectedTab === "create" ? "2px solid #1976d2" : "1px solid #e0e0e0",
              borderRadius: "8px",
              color: selectedTab === "create" ? "white" : "#666",
              fontWeight: "500",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none"
            }}
          >
            📝 Create
          </button>
          <button
            onClick={() => setSelectedTab("settings")}
            style={{
              flex: 1,
              padding: "12px 24px",
              background: selectedTab === "settings" 
                ? "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)" 
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: selectedTab === "settings" ? "2px solid #1976d2" : "1px solid #e0e0e0",
              borderRadius: "8px",
              color: selectedTab === "settings" ? "white" : "#666",
              fontWeight: "500",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none"
            }}
          >
            ⚙️ Settings
          </button>
        </div>
        
        {selectedTab === "create" && (
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}>
            <CreateTab playHTCred={playHTCred} setPlayHTCred={setPlayHTCred} />
          </div>
        )}
        {selectedTab === "settings" && (
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}>
            <SettingsTab playHTCred={playHTCred} setPlayHTCred={setPlayHTCred} />
          </div>
        )}
      </div>
    </div>
  );
};
