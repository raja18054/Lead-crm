import React, { useState, useEffect, useCallback } from "react";
import LeadTable from "./components/LeadTable";
import LeadForm from "./components/LeadForm";
import StatsBar from "./components/StatsBar";
import { getLeads, createLead, updateLead, deleteLead, getStats } from "./api/axios";

const STATUS_FILTERS = ["All", "New", "Contacted", "Qualified", "Converted", "Lost"];

export default function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sortBy, order, limit: 10 };
      if (search) params.search = search;
      if (statusFilter !== "All") params.status = statusFilter;
      const { data } = await getLeads(params);
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      showToast("Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sortBy, order]);

  const fetchStats = async () => {
    try {
      const { data } = await getStats();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleSort = (col) => {
    if (sortBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else { setSortBy(col); setOrder("asc"); }
  };

  const handleSubmit = async (form) => {
    setFormLoading(true);
    try {
      if (editLead) {
        await updateLead(editLead._id, form);
        showToast("Lead updated successfully");
      } else {
        await createLead(form);
        showToast("Lead added successfully");
      }
      setShowForm(false);
      setEditLead(null);
      fetchLeads();
      fetchStats();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      showToast("Lead deleted");
      fetchLeads();
      fetchStats();
    } catch {
      showToast("Failed to delete lead", "error");
    }
  };

  const handleEdit = (lead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#16162a", borderBottom: "1px solid #2d2d3d", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, color: "#e2e8f0", fontSize: "20px", fontWeight: "800" }}>
            <span style={{ color: "#818cf8" }}>●</span> Lead CRM
          </h1>
          <p style={{ margin: "2px 0 0", color: "#4b5563", fontSize: "12px" }}>Full Stack MERN Project</p>
        </div>
        <button onClick={() => { setEditLead(null); setShowForm(true); }}
          style={{ padding: "10px 20px", background: "#4f46e5", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
          + Add Lead
        </button>
      </div>

      <div style={{ padding: "28px 32px" }}>
        <StatsBar stats={stats} />
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <input type="text" placeholder="🔍  Search by name, email, or company..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1", minWidth: "240px", padding: "10px 14px", background: "#1e1e2e", border: "1px solid #2d2d3d", borderRadius: "8px", color: "#e2e8f0", fontSize: "14px", outline: "none" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {STATUS_FILTERS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: "8px 14px", border: `1px solid ${statusFilter === s ? "#4f46e5" : "#2d2d3d"}`, borderRadius: "6px", background: statusFilter === s ? "#4f46e5" : "#1e1e2e", color: statusFilter === s ? "#fff" : "#64748b", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", color: "#4b5563", padding: "60px" }}>Loading leads...</div>
        ) : (
          <LeadTable leads={leads} total={total} page={page} totalPages={totalPages}
            onEdit={handleEdit} onDelete={handleDelete} onSort={handleSort}
            sortBy={sortBy} order={order} onPageChange={setPage} />
        )}
      </div>

      {showForm && (
        <LeadForm lead={editLead} onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditLead(null); }} loading={formLoading} />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: toast.type === "error" ? "#3f1212" : "#064e3b", border: `1px solid ${toast.type === "error" ? "#ef4444" : "#10b981"}`, color: toast.type === "error" ? "#f87171" : "#34d399", padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", zIndex: 100 }}>
          {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
        </div>
      )}
    </div>
  );
}
