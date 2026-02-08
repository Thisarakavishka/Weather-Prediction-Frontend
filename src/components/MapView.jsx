import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { MAP_TILES } from "../../config";

const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

// This component handles the "Google Earth" style movement
function MapController({ pos }) {
  const map = useMap();

  useEffect(() => {
    if (pos) {
      // The "flyTo" method creates the smooth zoom-out/zoom-in effect
      map.flyTo(pos, 11, {
        animate: true,
        duration: 2.5, // 2.5 seconds for a professional, smooth feel
      });

      // Also fix the pixelated/missing tiles issue here
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }
  }, [pos, map]);

  return null;
}

export default function MapView({ pos }) {
  return (
    <div style={{ flex: 1, height: "100vh", position: "relative", overflow: "hidden" }}>
      <MapContainer 
        center={pos} 
        zoom={8} 
        zoomControl={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={MAP_TILES} />
        
        {/* This component watches for 'pos' changes and triggers animation */}
        <MapController pos={pos} />
        
        <Marker position={pos} icon={customIcon} />
      </MapContainer>
    </div>
  );
}