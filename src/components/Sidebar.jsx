import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, Loader2, Navigation } from "lucide-react";

export default function Sidebar({
  setPos,
  fetchWeather,
  prediction,
  history,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [locationLabel, setLocationLabel] = useState("Colombo, Sri Lanka");

  const toC = (f) => ((f - 32) * 5) / 9;

  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`,
      );
      setSearchResults(res.data);
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (item) => {
    const newPos = [parseFloat(item.lat), parseFloat(item.lon)];
    // This triggers the useEffect inside MapView.jsx
    setPos(newPos);
    setLocationLabel(item.display_name);
    setSearchResults([]);
    setSearchQuery("");
    fetchWeather(newPos[0], newPos[1]);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <Navigation size={35} color="#38bdf8" />
        <h1
          style={{ fontSize: "26px", fontWeight: "800", letterSpacing: "-1px" }}
        >
          MINIMA AI
        </h1>
      </div>

      {/* Search Input */}
      <div style={{ position: "relative", marginBottom: "25px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            padding: "12px 15px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Search size={20} color="#94a3b8" />
          <input
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder="Search city..."
            style={{
              background: "none",
              border: "none",
              color: "white",
              outline: "none",
              marginLeft: "12px",
              width: "100%",
            }}
          />
        </div>
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                top: "55px",
                width: "100%",
                background: "#1e293b",
                borderRadius: "12px",
                zIndex: 2000,
              }}
            >
              {searchResults.map((item, i) => (
                <div
                  key={i}
                  onClick={() => selectLocation(item)}
                  style={{
                    padding: "15px",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "14px",
                  }}
                >
                  {item.display_name}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        style={{
          background: "rgba(56, 189, 248, 0.1)",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "25px",
          display: "flex",
          gap: "12px",
        }}
      >
        <MapPin color="#38bdf8" size={24} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: "14px" }}>{locationLabel}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <Loader2 size={50} color="#38bdf8" className="animate-spin" />
        </div>
      ) : (
        prediction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                padding: "30px",
                borderRadius: "24px",
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                TOMORROW'S MIN TEMP
              </p>
              <h1 style={{ fontSize: "60px", margin: "10px 0" }}>
                {prediction.prediction_f}°F
              </h1>
              <h3>{prediction.prediction_c.toFixed(1)}°C</h3>
            </div>
            {history
              .slice()
              .reverse()
              .map((day, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{day.date}</span>
                  <div style={{ textAlign: "right" }}>
                    <strong>{day.min_f}°F</strong>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                      {toC(day.min_f).toFixed(1)}°C
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )
      )}
    </>
  );
}
