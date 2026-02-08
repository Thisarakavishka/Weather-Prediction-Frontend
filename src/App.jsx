import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, Loader2, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- CONFIGURATION FROM ENV ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MAP_TILES = import.meta.env.VITE_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_CENTER = [
  parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 6.9271,
  parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 79.8612,
];

// Modern Blue Marker
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

// Helper: Smooth Map Animation
const MapFly = ({ pos }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(pos, 11, { duration: 2.5 });
  }, [pos, map]);
  return null;
};

export default function App() {
  const [pos, setPos] = useState(DEFAULT_CENTER);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [locationLabel, setLocationLabel] = useState("Colombo, Sri Lanka");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("connecting");

  const toC = (f) => ((f - 32) * 5) / 9;

  // Check API Health on load
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/health`);
        setApiStatus(res.data.status);
      } catch (err) {
        setApiStatus("disconnected");
      }
    };
    checkHealth();
  }, []);

  // Modern Search Logic
  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`,
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (item) => {
    const newPos = [parseFloat(item.lat), parseFloat(item.lon)];
    setPos(newPos);
    setLocationLabel(item.display_name);
    setSearchResults([]);
    setSearchQuery("");
    fetchWeather(newPos[0], newPos[1]);
  };

  const fetchWeather = async (lat, lng) => {
    setLoading(true);
    setPrediction(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const start = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Fetch weather history from Open-Meteo
      const res = await axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${today}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`,
      );

      const daily = res.data.daily;
      const historyData = daily.time.map((t, i) => ({
        date: t,
        min_f: daily.temperature_2m_min[i],
        max_f: daily.temperature_2m_max[i],
        isToday: t === today,
      }));
      setHistory(historyData);

      // Send to Backend for AI Prediction
      const backend = await axios.post(`${API_BASE_URL}/predict`, {
        daily_history: historyData.map((d) => ({
          min_temp: d.min_f,
          max_temp: d.max_f,
          date: d.date,
        })),
      });
      setPrediction(backend.data);
    } catch (e) {
      alert("AI Engine error. Make sure the backend is running.");
      console.error("API Error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#020617",
        color: "white",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "450px",
          background: "rgba(15, 23, 42, 0.95)",
          padding: "30px",
          zIndex: 1000,
          overflowY: "auto",
          boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* API STATUS HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: apiStatus === "connected" ? "#10b981" : "#ef4444",
            }}
          />
          <span
            style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}
          >
            {apiStatus === "connected"
              ? "AI ENGINE ONLINE"
              : "CONNECTING TO BACKEND..."}
          </span>
        </div>

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
            style={{
              fontSize: "26px",
              fontWeight: "800",
              letterSpacing: "-1px",
            }}
          >
            SKYNET AI
          </h1>
        </div>

        {/* SEARCH BAR */}
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
              placeholder="Search city in Sri Lanka..."
              style={{
                background: "none",
                border: "none",
                color: "white",
                outline: "none",
                marginLeft: "12px",
                width: "100%",
                fontSize: "15px",
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
                  overflow: "hidden",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
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
                    onMouseOver={(e) => (e.target.style.background = "#334155")}
                    onMouseOut={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    {item.display_name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CHOSEN LOCATION */}
        <div
          style={{
            background: "rgba(56, 189, 248, 0.1)",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "25px",
            display: "flex",
            gap: "12px",
            border: "1px solid rgba(56, 189, 248, 0.2)",
          }}
        >
          <MapPin color="#38bdf8" size={24} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: "14px", color: "#e2e8f0" }}>{locationLabel}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Loader2 size={50} color="#38bdf8" />
            </motion.div>
            <p style={{ marginTop: "20px", color: "#94a3b8" }}>
              Analyzing 14-Day Context...
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* PREDICTION CARD */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    padding: "30px",
                    borderRadius: "24px",
                    textAlign: "center",
                    marginBottom: "30px",
                    boxShadow: "0 15px 30px -10px rgba(14, 165, 233, 0.5)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      opacity: 0.8,
                      letterSpacing: "2px",
                    }}
                  >
                    TOMORROW'S MIN TEMP
                  </p>
                  <h1
                    style={{
                      fontSize: "60px",
                      margin: "10px 0",
                      fontWeight: "900",
                    }}
                  >
                    {prediction.prediction_f}°F
                  </h1>
                  <h3 style={{ fontSize: "24px", opacity: 0.9 }}>
                    {prediction.prediction_c.toFixed(1)}°C
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <Calendar size={20} color="#38bdf8" />
                  <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                    Recent History
                  </h3>
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
                        background: day.isToday
                          ? "rgba(56, 189, 248, 0.15)"
                          : "rgba(255,255,255,0.02)",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        borderLeft: day.isToday ? "4px solid #38bdf8" : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: day.isToday ? "#38bdf8" : "#94a3b8",
                        }}
                      >
                        {day.date} {day.isToday ? "(Today)" : ""}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "700", fontSize: "15px" }}>
                          {day.min_f}°F
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          {toC(day.min_f).toFixed(1)}°C
                        </div>
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={pos}
          zoom={8}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url={MAP_TILES} />
          <MapFly pos={pos} />
          <Marker position={pos} icon={customIcon} />
        </MapContainer>
      </div>
    </div>
  );
}
