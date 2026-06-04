import React, { useState, useEffect } from "react";

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const emptyForm = { name: "", email: "", phone: "", company: "", status: "New", notes: "" };

export default function LeadForm({ lead, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) setForm({ ...emptyForm, ...lead });
    else setForm(emptyForm);
  }, [lead]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.company.trim()) errs.company = "Company is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    onSubmit(form);
  };

  const inputStyle = (field) => ({
    width: "100%", padding: "10px 12px", background: "#0f0f1a",
    border: `1px solid ${errors[field] ? "#ef4444" : "#2d2d3d"}`,
    borderRadius: "8px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#1e1e2e", borderRadius: "14px", padding: "28px", width: "100%", maxWidth: "480px", border: "1px solid #2d2d3d", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: "700", margin: 0 }}>{lead ? "Edit Lead" : "Add New Lead"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { name: "email", label: "Email Address", type: "email", placeholder: "john@company.com" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
            { name: "company", label: "Company Name", type: "text", placeholder: "Acme Corp" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>{field.label}</label>
              <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} style={inputStyle(field.name)} />
              {errors[field.name] && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors[field.name]}</span>}
            </div>
          ))}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>Lead Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={{ ...inputStyle("status"), cursor: "pointer" }}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any additional notes..." style={{ ...inputStyle("notes"), resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", background: "#2d2d3d", border: "none", borderRadius: "8px", color: "#94a3b8", fontSize: "14px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: "10px", background: loading ? "#4f46e5aa" : "#4f46e5", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "700" }}>
              {loading ? "Saving..." : lead ? "Update Lead" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
