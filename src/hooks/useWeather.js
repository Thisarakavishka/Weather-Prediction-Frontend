import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function useWeather() {
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("connecting");

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

  const fetchWeather = async (lat, lng) => {
    setLoading(true);
    setPrediction(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const start = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const res = await axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${today}&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`
      );

      const daily = res.data.daily;
      const historyData = daily.time.map((t, i) => ({
        date: t,
        min_f: daily.temperature_2m_min[i],
        max_f: daily.temperature_2m_max[i],
        isToday: t === today,
      }));
      setHistory(historyData);

      const backend = await axios.post(`${API_BASE_URL}/predict`, {
        daily_history: historyData.map((d) => ({
          min_temp: d.min_f,
          max_temp: d.max_f,
          date: d.date,
        })),
      });
      setPrediction(backend.data);
    } catch (e) {
      console.error("API Error", e);
    } finally {
      setLoading(false);
    }
  };

  return { prediction, history, loading, apiStatus, fetchWeather };
}