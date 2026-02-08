# 🗺️ Minima AI | Intelligence Interface

**Minima AI** is a high-end geospatial dashboard designed to visualize AI-driven weather predictions. By combining satellite data with Deep Learning, the application provides precise 24-hour minimum temperature forecasts for any location.

* **Live Application:** [https://minimaai.vercel.app/](https://minimaai.vercel.app/)
* **Backend Engine:** [Link to your Backend Repository]

---

## ✨ Features

* **Geospatial Visualization:** Built with **Leaflet.js** and **React-Leaflet**, featuring "Google Earth" style smooth fly-to animations and dark-themed mapping.
* **Deep Learning Integration:** Connects to a custom-trained **LSTM (Long Short-Term Memory)** model to predict temperature trends.
* **Automated Context:** Automatically fetches 14 days of historical weather data via the **Open-Meteo API** to feed the AI engine.
* **Real-time Status Monitoring:** A custom, animated **Status Pill** provides immediate feedback on the health of the AI Backend.
* **Modular Architecture:** Cleanly separated into Hooks, Components, and Services for maximum maintainability.

---

## 🚀 How It Works



1.  **Location Selection:** The user searches for a city via the **OpenStreetMap Nominatim API**.
2.  **Context Extraction:** Upon selection, the app retrieves the last 14 days of historical "Minimum Temperature" data.
3.  **Neural Inference:** The frontend transmits this temporal sequence to the **Minima AI Backend**.
4.  **Forecasting:** The LSTM model processes the sequence, identifies patterns, and returns a high-precision prediction for the following day.

---

## 🛠️ Tech Stack

* **Frontend Library:** React.js (Vite)
* **State Management:** React Hooks (Custom `useWeather` hook)
* **Maps & GIS:** Leaflet & React-Leaflet
* **Animations:** Framer Motion (for transitions and UI effects)
* **Icons:** Lucide-React
* **API Client:** Axios

---

## 🧠 Research & Data Assets

This interface acts as the presentation layer for a Software Engineering research project focusing on climate time-series analysis.

* **Algorithm:** Bidirectional LSTM (Long Short-Term Memory)
* **Mean Absolute Error (MAE):** 8.62°F
* **Training Notebook:** [Insert your Google Colab or Kaggle Notebook Link Here]
* **Dataset Source:** [Insert your Kaggle Dataset Link Here]

---

## 💻 Local Development

1.  **Clone the repository:**
    ```bash
    git clone <your-frontend-repo-url>
    cd Weather-Prediction-Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:8000
    VITE_DEFAULT_LAT=6.9271
    VITE_DEFAULT_LNG=79.8612
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 📝 Project Structure

```text
src/
├── components/     # UI Elements (MapView, Sidebar, StatusPill)
├── hooks/          # Logic (useWeather custom hook)
├── config.js       # Centralized configuration & Env handling
├── App.jsx         # Main Layout & Component Orchestration
└── main.jsx        # Entry point & Global CSS