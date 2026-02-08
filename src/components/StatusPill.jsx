import { motion } from "framer-motion";

export default function StatusPill({ status }) {
  const isConnected = status === "connected";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: isConnected
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(239, 68, 68, 0.15)",
          border: `1px solid ${isConnected ? "#10b981" : "#ef4444"}`,
          borderRadius: "20px",
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isConnected ? "#10b981" : "#ef4444",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: isConnected ? "#10b981" : "#ef4444",
            letterSpacing: "0.5px",
          }}
        >
          {isConnected ? "AI ENGINE ONLINE" : "ENGINE OFFLINE"}
        </span>
      </motion.div>
    </div>
  );
}
