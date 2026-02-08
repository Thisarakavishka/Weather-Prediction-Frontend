import React, { useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import StatusPill from "./components/StatusPill";
import useWeather from "./hooks/useWeather";
import { DEFAULT_CENTER } from "./../config";

export default function App() {
  const [pos, setPos] = useState(DEFAULT_CENTER);
  const { prediction, history, loading, apiStatus, fetchWeather } =
    useWeather();

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
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 2000,
          }}
        >
          <StatusPill status={apiStatus} />
        </div>
        <Sidebar
          setPos={setPos}
          fetchWeather={fetchWeather}
          prediction={prediction}
          history={history}
          loading={loading}
        />
      </div>
      <MapView pos={pos} />
    </div>
  );
}
