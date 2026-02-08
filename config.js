export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export const MAP_TILES = import.meta.env.VITE_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const DEFAULT_CENTER = [
  parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 6.9271,
  parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 79.8612
];