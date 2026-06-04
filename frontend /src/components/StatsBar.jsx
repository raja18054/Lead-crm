import React from "react";

const STATUS_COLORS = {
  New: "#3b82f6", Contacted: "#f59e0b", Qualified: "#8b5cf6", Converted: "#10b981", Lost: "#ef4444",
};

export default function StatsBar({ stats }) {
  if (!stats) return null;
  const cards = [
    { label: "Total Leads", value: stats.total, color: "#6366f1" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, color: "#10b981" },
    ...Object.entries(stats.byStatus).map(([status, count]) => ({ label: status, value: count, color: STATUS_COLORS[status] })),
  ];
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
      {cards.map((card) => (
        <div key={card.label} style={{ background: "#1e1e2e", border: `1px solid ${card.color}33`, borderRadius: "10px", padding: "14px 20px", minWidth: "120px", flex: "1" }}>
          <div style={{ fontSize: "22px", fontWeight: "700", color: card.color }}>{card.value}</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
