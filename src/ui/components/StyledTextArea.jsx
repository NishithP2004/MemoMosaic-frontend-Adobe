import React from "react";

export const StyledTextArea = ({ value, onChange, placeholder, style = {}, rows = 4, ...props }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#e8eaed",
                fontSize: "16px",
                outline: "none",
                resize: "vertical",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
                boxSizing: "border-box",
                ...style
            }}
            onFocus={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.borderColor = "rgba(161, 140, 209, 0.5)";
            }}
            onBlur={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
            {...props}
        />
    );
};
