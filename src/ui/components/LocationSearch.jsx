import React, { useState, useEffect, useRef } from "react";

export const LocationSearch = ({ onLocationSelect, initialValue = "" }) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const searchCompletions = async (q) => {
        if (!q || q.length < 3) {
            setResults([]);
            return;
        }
        try {
            let res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${q}&addressdetails=1&format=json`
            ).then((res) => res.json());
            setResults(res.map((place) => place.display_name));
            setIsOpen(true);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (query && query.length >= 3) {
                searchCompletions(query);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500); // 500ms throttle

        return () => {
            clearTimeout(timerId);
        };
    }, [query]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSelect = (loc) => {
        setQuery(loc);
        setIsOpen(false);
        onLocationSelect(loc);
    };

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
            <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
            }}>
                <span style={{
                    position: "absolute",
                    left: "12px",
                    fontSize: "18px",
                    color: "#8e8e8e"
                }}>📍</span>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search for a location..."
                    style={{
                        width: "100%",
                        padding: "12px 12px 12px 40px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#e8eaed",
                        fontSize: "16px",
                        outline: "none",
                        boxSizing: "border-box", // Important for padding
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
            </div>

            {isOpen && results.length > 0 && (
                <ul style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "rgba(30, 30, 35, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    marginTop: "8px",
                    padding: "8px 0",
                    listStyle: "none",
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}>
                    {results.map((loc, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSelect(loc)}
                            style={{
                                padding: "10px 16px",
                                cursor: "pointer",
                                color: "#e8eaed",
                                fontSize: "14px",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
                            onMouseLeave={(e) => e.target.style.background = "transparent"}
                        >
                            {loc}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
