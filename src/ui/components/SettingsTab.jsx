import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import { StyledInput } from "./StyledInput";

export const SettingsTab = ({ playHTCred, setPlayHTCred }) => {
  const [file, setFile] = useState();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setDisabled(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{
        textAlign: "center",
        marginBottom: "32px"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#fff",
          margin: "0 0 8px 0"
        }}>
          Voice Settings
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#a0a0a0",
          margin: "0"
        }}>
          Configure PlayHT credentials for AI voice narration
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            fontWeight: "500",
            color: "#e8eaed",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🔑 PlayHT Credentials
          </h3>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e8eaed"
              }}>
                User ID
              </label>
              <StyledInput
                type="text"
                id="userId"
                value={playHTCred.userId}
                disabled={disabled}
                onChange={e => setPlayHTCred(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter your PlayHT User ID"
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e8eaed"
              }}>
                Secret Key
              </label>
              <StyledInput
                type="password"
                id="secretKey"
                value={playHTCred.secretKey}
                disabled={disabled}
                onChange={e => setPlayHTCred(prev => ({ ...prev, secretKey: e.target.value }))}
                placeholder="Enter your PlayHT Secret Key"
              />
            </div>

            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#e8eaed"
              }}>
                Voice Gender
              </label>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  background: playHTCred.gender === "male"
                    ? "linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  border: playHTCred.gender === "male" ? "1px solid #764ba2" : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={playHTCred.gender === "male"}
                    onChange={e => setPlayHTCred(prev => ({ ...prev, gender: e.target.value }))}
                    style={{
                      marginRight: "16px",
                      accentColor: "#764ba2",
                      transform: "scale(1.2)"
                    }}
                  />
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>👨</span>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#e8eaed"
                  }}>
                    Male Voice
                  </span>
                </label>

                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  background: playHTCred.gender === "female"
                    ? "linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  border: playHTCred.gender === "female" ? "1px solid #764ba2" : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={playHTCred.gender === "female"}
                    onChange={e => setPlayHTCred(prev => ({ ...prev, gender: e.target.value }))}
                    style={{
                      marginRight: "16px",
                      accentColor: "#764ba2",
                      transform: "scale(1.2)"
                    }}
                  />
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>👩</span>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#e8eaed"
                  }}>
                    Female Voice
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            fontWeight: "500",
            color: "#e8eaed",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🎤 Voice Cloning
          </h3>

          <div style={{
            border: "2px dashed rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.02)",
            transition: "all 0.2s ease",
            cursor: "pointer",
            position: "relative"
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(161, 140, 209, 0.5)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            }}
          >
            <input
              type="file"
              accept="audio/wav"
              id="audioSample"
              disabled={disabled}
              onChange={async e => {
                const file = e.target.files[0];
                setFile(file);
                const arrayBuffer = await file.arrayBuffer();
                const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                setPlayHTCred(prev => ({ ...prev, audio: base64Audio }));
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: disabled ? "not-allowed" : "pointer"
              }}
            />
            <div style={{
              fontSize: "32px",
              marginBottom: "16px"
            }}>
              🎵
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#e8eaed",
              marginBottom: "8px"
            }}>
              {file ? file.name : "Click to upload audio sample"}
            </div>
            <div style={{
              fontSize: "14px",
              color: "#a0a0a0"
            }}>
              Upload a ~30 second audio sample to clone your voice
            </div>
          </div>

          {file && (
            <div style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "rgba(0, 255, 0, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(0, 255, 0, 0.2)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "16px" }}>✅</span>
                  <span style={{
                    fontSize: "14px",
                    color: "#e8eaed"
                  }}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(undefined)}
                  disabled={disabled}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    color: "#e8eaed",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center"
        }}>
          <button
            type="submit"
            disabled={disabled}
            style={{
              flex: 1,
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "12px",
              padding: "14px 24px",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              transition: "transform 0.2s",
              boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)"
            }}
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={() => setDisabled(false)}
            style={{
              flex: 1,
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "14px 24px",
              color: "#e0e0e0",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};
