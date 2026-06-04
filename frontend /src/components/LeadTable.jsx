import React from "react";

const STATUS_STYLES = {
  New:       { bg: "#1e3a5f", color: "#60a5fa" },
  Contacted: { bg: "#3b2f00", color: "#fbbf24" },
  Qualified: { bg: "#2d1f5e", color: "#a78bfa" },
  Converted: { bg: "#064e3b", color: "#34d399" },
  Lost:      { bg: "#3f1212", color: "#f87171" },
};

export default function LeadTable({ leads, total, page, totalPages, onEdit, onDelete, onSort, sortBy, order, onPageChange }) {
  const cols = [
    { key: "name", label: "Name" }, { key: "email", label: "Email" },
    { key: "phone", label: "Phone" }, { key: "company", label: "Company" },
    { key: "status", label: "Status" }, { key: "createdAt", label: "Created" },
  ];

  const thStyle = (key) => ({
    padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700",
    color: sortBy === key ? "#818cf8" : "#64748b", textTransform: "uppercase",
    letterSpacing: "0.06em", cursor: "pointer", whiteSpace: "nowrap",
    userSelect: "none", borderBottom: "1px solid #1e1e2e",
  });

  const tdStyle = { padding: "14px 16px", fontSize: "13px", color: "#cbd5e1", borderBottom: "1px solid #1a1a2a", verticalAlign: "middle" };

  return (
    <div>
      <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid #2d2d3d" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e2e" }}>
          <thead style={{ background: "#16162a" }}>
            <tr>
              {cols.map((col) => (
                <th key={col.key} style={thStyle(col.key)} onClick={() => onSort(col.key)}>
                  {col.label} {sortBy === col.key ? (order === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th style={{ ...thStyle("actions"), cursor: "default" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: "#4b5563", padding: "40px" }}>No leads found. Add your first lead!</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#252535"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...tdStyle, fontWeight: "600", color: "#e2e8f0" }}>{lead.name}</td>
                  <td style={tdStyle}>{lead.email}</td>
                  <td style={tdStyle}>{lead.phone}</td>
                  <td style={tdStyle}>{lead.company}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", background: STATUS_STYLES[lead.status]?.bg, color: STATUS_STYLES[lead.status]?.color }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "#64748b" }}>{new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => onEdit(lead)} style={{ padding: "5px 12px", background: "#1e3a5f", border: "none", borderRadius: "6px", color: "#60a5fa", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>Edit</button>
                      <button onClick={() => onDelete(lead._id)} style={{ padding: "5px 12px", background: "#3f1212", border: "none", borderRadius: "6px", color: "#f87171", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <span style={{ color: "#64748b", fontSize: "13px" }}>Showing {leads.length} of {total} leads</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
            style={{ padding: "6px 14px", background: page === 1 ? "#1a1a2a" : "#2d2d3d", border: "none", borderRadius: "6px", color: page === 1 ? "#374151" : "#94a3b8", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}>← Prev</button>
          <span style={{ padding: "6px 14px", background: "#4f46e5", borderRadius: "6px", color: "#fff", fontSize: "13px", fontWeight: "600" }}>{page} / {totalPages || 1}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
            style={{ padding: "6px 14px", background: page >= totalPages ? "#1a1a2a" : "#2d2d3d", border: "none", borderRadius: "6px", color: page >= totalPages ? "#374151" : "#94a3b8", cursor: page >= totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
