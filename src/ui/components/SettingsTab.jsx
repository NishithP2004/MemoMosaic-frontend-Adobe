import React, { useState } from "react";
import "@spectrum-web-components/button/sp-button.js";
import "@spectrum-web-components/textfield/sp-textfield.js";
import "@spectrum-web-components/radio/sp-radio-group.js";
import "@spectrum-web-components/radio/sp-radio.js";

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
          color: "#2c2c2c",
          margin: "0 0 8px 0"
        }}>
          Voice Settings
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#666",
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
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "8px",
          padding: "24px"
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            fontWeight: "500",
            color: "#2c2c2c",
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
                color: "#2c2c2c"
              }}>
                User ID
              </label>
              <div style={{
                position: "relative",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "2px solid #e0e0e0",
                transition: "all 0.2s ease",
                overflow: "hidden"
              }}>
                <input
                  type="text"
                  id="userId"
                  value={playHTCred.userId}
                  disabled={disabled}
                  onChange={e => setPlayHTCred(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Enter your PlayHT User ID"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#2c2c2c",
                    boxSizing: "border-box"
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.2s ease"
                }} />
              </div>
            </div>
            
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#2c2c2c"
              }}>
                Secret Key
              </label>
              <div style={{
                position: "relative",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "2px solid #e0e0e0",
                transition: "all 0.2s ease",
                overflow: "hidden"
              }}>
                <input
                  type="password"
                  id="secretKey"
                  value={playHTCred.secretKey}
                  disabled={disabled}
                  onChange={e => setPlayHTCred(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="Enter your PlayHT Secret Key"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#2c2c2c",
                    boxSizing: "border-box"
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.2s ease"
                }} />
              </div>
            </div>
            
            <div>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#2c2c2c"
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
                  padding: "12px 16px",
                  background: playHTCred.gender === "male" 
                    ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" 
                    : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderRadius: "8px",
                  border: playHTCred.gender === "male" ? "2px solid #2196f3" : "1px solid #e0e0e0",
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
                      marginRight: "12px",
                      transform: "scale(1.2)"
                    }}
                  />
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>👨</span>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#2c2c2c"
                  }}>
                    Male Voice
                  </span>
                </label>
                
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  background: playHTCred.gender === "female" 
                    ? "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" 
                    : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderRadius: "8px",
                  border: playHTCred.gender === "female" ? "2px solid #2196f3" : "1px solid #e0e0e0",
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
                      marginRight: "12px",
                      transform: "scale(1.2)"
                    }}
                  />
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>👩</span>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#2c2c2c"
                  }}>
                    Female Voice
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderRadius: "8px",
          padding: "24px"
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            fontWeight: "500",
            color: "#2c2c2c",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🎤 Voice Cloning
          </h3>
          
          <div style={{
            border: "2px dashed #e0e0e0",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            transition: "all 0.2s ease",
            cursor: "pointer",
            position: "relative"
          }}>
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
              color: "#666",
              marginBottom: "12px"
            }}>
              🎵
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#2c2c2c",
              marginBottom: "8px"
            }}>
              {file ? file.name : "Click to upload audio sample"}
            </div>
            <div style={{
              fontSize: "14px",
              color: "#888"
            }}>
              Upload a ~30 second audio sample to clone your voice
            </div>
          </div>
          
          {file && (
            <div style={{
              marginTop: "16px",
              padding: "12px 16px",
              background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
              borderRadius: "6px",
              border: "1px solid #c8e6c9"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <span style={{ fontSize: "16px" }}>✅</span>
                  <span style={{
                    fontSize: "14px",
                    color: "#2c2c2c"
                  }}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <sp-button 
                  variant="secondary" 
                  size="s"
                  onClick={() => setFile(undefined)} 
                  disabled={disabled}
                >
                  Remove
                </sp-button>
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center"
        }}>
          <sp-button 
            variant="primary" 
            type="submit" 
            disabled={disabled}
            style={{
              minWidth: "120px",
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              border: "none",
              borderRadius: "6px",
              padding: "12px 24px",
              color: "white",
              fontWeight: "500",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1
            }}
          >
            Save Settings
          </sp-button>
          <sp-button 
            variant="secondary" 
            type="button" 
            onClick={() => setDisabled(false)}
            style={{
              minWidth: "120px",
              background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
              border: "1px solid #d0d0d0",
              borderRadius: "6px",
              padding: "12px 24px",
              color: "#666",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Edit
          </sp-button>
        </div>
      </form>
    </div>
  );
}; 