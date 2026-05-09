import { useState, useEffect, useMemo } from "react";

const EMPTY_FORM = {
  title: "",
  description: "",
  department: "",
  location: "",
  type: "Full Time",
  salary: "",
  experience: "",
  status: "open",
};

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Create / edit modal
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchJobs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);

    fetch(`/api/admin/jobs?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setJobs(data.jobs || []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error("Jobs fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!searchTerm) return jobs;
    const q = searchTerm.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.department?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q),
    );
  }, [jobs, searchTerm]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingJob(null);
    setModal("create");
  };
  const openEdit = (job) => {
    setForm({
      title: job.title,
      description: job.description || "",
      department: job.department || "",
      location: job.location || "",
      type: job.type || "Full Time",
      salary: job.salary || "",
      experience: job.experience || "",
      status: job.status,
    });
    setEditingJob(job);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Job title is required");
      return;
    }
    setSaving(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const isEdit = modal === "edit";
      const url = isEdit
        ? `/api/admin/jobs/${editingJob.id}`
        : "/api/admin/jobs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, createdBy: storedUser?.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Save failed");
        return;
      }

      setModal(null);
      fetchJobs();
    } catch (err) {
      console.error("Save job error:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`))
      return;
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }
      fetchJobs();
    } catch (err) {
      console.error("Delete job error:", err);
    }
  };

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusColor(s) {
    if (s === "open") return { bg: "#dcfce7", text: "#166534" };
    return { bg: "#fee2e2", text: "#991b1b" };
  }

  return (
    <div style={styles.page}>
      <div style={styles.topSection}>
        <div>
          <p style={styles.smallText}>Recruitment Control</p>
          <h1 style={styles.heading}>Manage Jobs</h1>
          <p style={styles.subText}>
            Create, update, organize, and monitor all open positions from a
            premium hiring workspace.
          </p>
        </div>
        <div style={styles.topActions}>
          <button style={styles.secondaryTopButton} onClick={fetchJobs}>
            Refresh
          </button>
          <button style={styles.primaryTopButton} onClick={openCreate}>
            + Create New Job
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          {
            label: "Total Jobs",
            value: stats.total,
            note: "All created openings",
          },
          {
            label: "Active Jobs",
            value: stats.active,
            note: "Currently accepting",
          },
          {
            label: "Closed Jobs",
            value: stats.closed,
            note: "Hiring cycle completed",
          },
          {
            label: "Total Applicants",
            value: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
            note: "Across all jobs",
          },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <h2 style={styles.statValue}>{loading ? "…" : s.value}</h2>
            <p style={styles.statNote}>{s.note}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search by title, department, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterWrap}>
          {["All", "open", "closed"].map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              style={
                statusFilter === opt
                  ? styles.filterButtonActive
                  : styles.filterButton
              }
            >
              {opt === "All"
                ? "All Status"
                : opt === "open"
                  ? "Active"
                  : "Closed"}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      {loading ? (
        <p style={styles.emptyMsg}>Loading jobs…</p>
      ) : filtered.length === 0 ? (
        <p style={styles.emptyMsg}>No jobs found.</p>
      ) : (
        <div style={styles.cardGrid}>
          {filtered.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.jobDept}>{job.department}</p>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(job.status).bg,
                    color: getStatusColor(job.status).text,
                  }}
                >
                  {job.status === "open" ? "Active" : "Closed"}
                </span>
              </div>

              <div style={styles.metaRow}>
                <span style={styles.metaChip}>📍 {job.location}</span>
                <span style={styles.metaChip}>💼 {job.type}</span>
                <span style={styles.metaChip}>
                  👥 {job.applicants} Applicants
                </span>
              </div>

              <div style={styles.infoBox}>
                <InfoRow
                  label="Posted Date"
                  value={formatDate(job.createdAt)}
                />
                <InfoRow label="Salary Range" value={job.salary || "—"} />
                <InfoRow label="Experience" value={job.experience || "—"} />
              </div>

              <div style={styles.actionRow}>
                <button
                  style={styles.viewButton}
                  onClick={() =>
                    alert(
                      `${job.title}\n\n${job.description || "No description."}`,
                    )
                  }
                >
                  View
                </button>
                <button style={styles.editButton} onClick={() => openEdit(job)}>
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(job)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {modal === "create" ? "Create New Job" : "Edit Job"}
            </h3>
            <div style={styles.formGrid}>
              <FormField
                label="Job Title *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />
              <FormField
                label="Department"
                value={form.department}
                onChange={(v) => setForm({ ...form, department: v })}
              />
              <FormField
                label="Location"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
              />
              <FormField
                label="Salary Range"
                value={form.salary}
                onChange={(v) => setForm({ ...form, salary: v })}
              />
              <FormField
                label="Experience"
                value={form.experience}
                onChange={(v) => setForm({ ...form, experience: v })}
              />
              <div style={styles.fieldWrap}>
                <label style={styles.fieldLabel}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={styles.input}
                >
                  {["Full Time", "Part Time", "Remote", "Contract"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              {modal === "edit" && (
                <div style={styles.fieldWrap}>
                  <label style={styles.fieldLabel}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    style={styles.input}
                  >
                    <option value="open">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
            <div style={{ ...styles.fieldWrap, marginTop: "4px" }}>
              <label style={styles.fieldLabel}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={styles.textarea}
                placeholder="Describe the role and responsibilities…"
              />
            </div>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmButton}
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving…"
                  : modal === "create"
                    ? "Create Job"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function FormField({ label, value, onChange }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  smallText: { margin: 0, color: "#64748b", fontSize: "14px" },
  heading: { margin: "8px 0 10px 0", fontSize: "38px", color: "#0f172a" },
  subText: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  topActions: { display: "flex", gap: "12px", flexWrap: "wrap" },
  primaryTopButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "16px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 15px 30px rgba(59,130,246,0.22)",
  },
  secondaryTopButton: {
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 20px",
    borderRadius: "16px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  statLabel: { margin: 0, color: "#64748b", fontSize: "14px" },
  statValue: { margin: "12px 0 8px 0", color: "#0f172a", fontSize: "32px" },
  statNote: { margin: 0, color: "#94a3b8", fontSize: "13px" },
  toolbar: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
    flexWrap: "wrap",
  },
  searchWrap: { flex: 1, minWidth: "280px" },
  searchInput: {
    width: "100%",
    height: "54px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "0 16px",
    fontSize: "15px",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  },
  filterWrap: { display: "flex", gap: "10px", flexWrap: "wrap" },
  filterButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  filterButtonActive: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "22px",
  },
  jobCard: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "16px",
  },
  jobDept: { margin: 0, color: "#2563eb", fontSize: "13px", fontWeight: "700" },
  jobTitle: {
    margin: "8px 0 0 0",
    color: "#0f172a",
    fontSize: "24px",
    lineHeight: 1.2,
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  metaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  metaChip: {
    display: "inline-block",
    padding: "9px 12px",
    borderRadius: "999px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "600",
  },
  infoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  infoLabel: { color: "#64748b", fontSize: "14px", fontWeight: "600" },
  infoValue: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "right",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },
  viewButton: {
    flex: 1,
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "90px",
  },
  editButton: {
    flex: 1,
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "90px",
  },
  deleteButton: {
    flex: 1,
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    padding: "12px 14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    minWidth: "90px",
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "20px 0" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: "26px",
    padding: "32px",
    width: "100%",
    maxWidth: "580px",
    boxShadow: "0 30px 60px rgba(15,23,42,0.18)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: { margin: "0 0 20px 0", fontSize: "24px", color: "#0f172a" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  fieldWrap: { display: "grid", gap: "8px" },
  fieldLabel: { fontSize: "13px", fontWeight: "700", color: "#334155" },
  input: {
    height: "50px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    fontSize: "14px",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: "100px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    padding: "12px 14px",
    fontSize: "14px",
    background: "#f8fafc",
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    width: "100%",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "22px",
  },
  cancelButton: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "12px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  confirmButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default ManageJobs;
