import { useState, useEffect, useMemo } from "react";

const STATUS_OPTIONS = [
  "All",
  "applied",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
];

function Applications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Status-update modal
  const [modalApp, setModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);

    fetch(`/api/admin/applications?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setApplications(data.applications || []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error("Applications fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  // ── Client-side search on top of server results ──────────────────────────
  const filtered = useMemo(() => {
    if (!searchTerm) return applications;
    const q = searchTerm.toLowerCase();
    return applications.filter(
      (a) =>
        a.candidateName?.toLowerCase().includes(q) ||
        a.jobTitle?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q),
    );
  }, [applications, searchTerm]);

  // ── Status update ────────────────────────────────────────────────────────
  const openModal = (app) => {
    setModalApp(app);
    setNewStatus(app.status);
  };

  const handleStatusUpdate = async () => {
    if (!modalApp || newStatus === modalApp.status) {
      setModalApp(null);
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${modalApp.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }
      setApplications((prev) =>
        prev.map((a) =>
          a.id === modalApp.id ? { ...a, status: newStatus } : a,
        ),
      );
      // Refresh stats
      setStats((prev) => {
        const s = { ...prev };
        if (modalApp.status === "applied")
          s.pending = Math.max(0, s.pending - 1);
        if (modalApp.status === "shortlisted")
          s.shortlisted = Math.max(0, s.shortlisted - 1);
        if (modalApp.status === "rejected")
          s.rejected = Math.max(0, s.rejected - 1);
        if (newStatus === "applied") s.pending++;
        if (newStatus === "shortlisted") s.shortlisted++;
        if (newStatus === "rejected") s.rejected++;
        return s;
      });
      setModalApp(null);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatStatus(s) {
    const map = {
      applied: "Under Review",
      shortlisted: "Shortlisted",
      interview: "Interview",
      offered: "Offered",
      rejected: "Rejected",
    };
    return map[s] || s;
  }

  function getStatusColor(s) {
    if (s === "shortlisted") return { bg: "#dcfce7", text: "#166534" };
    if (s === "rejected") return { bg: "#fee2e2", text: "#991b1b" };
    if (s === "interview") return { bg: "#ede9fe", text: "#5b21b6" };
    if (s === "offered") return { bg: "#fef9c3", text: "#854d0e" };
    return { bg: "#dbeafe", text: "#1d4ed8" };
  }

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.topSection}>
        <div>
          <p style={styles.smallText}>Recruitment Panel</p>
          <h1 style={styles.heading}>Applications Management</h1>
          <p style={styles.subText}>
            Review all submitted applications, monitor status, and take hiring
            actions from one premium workspace.
          </p>
        </div>
        <button style={styles.primaryButton} onClick={fetchData}>
          Refresh
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Applications", value: stats.total },
          { label: "Pending Review", value: stats.pending },
          { label: "Shortlisted", value: stats.shortlisted },
          { label: "Rejected", value: stats.rejected },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <h2 style={styles.statValue}>{loading ? "…" : s.value}</h2>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by candidate name, role, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterGroup}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              style={
                statusFilter === opt
                  ? styles.filterButtonActive
                  : styles.filterButton
              }
            >
              {opt === "All" ? "All Status" : formatStatus(opt)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <p style={styles.tableMini}>Live Records</p>
            <h3 style={styles.tableTitle}>
              Candidate Applications
              {!loading && (
                <span style={styles.countBadge}>{filtered.length}</span>
              )}
            </h3>
          </div>
        </div>

        {loading ? (
          <p style={styles.emptyMsg}>Loading applications…</p>
        ) : filtered.length === 0 ? (
          <p style={styles.emptyMsg}>No applications found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Candidate</th>
                  <th style={styles.th}>Applied Role</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Experience</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>
                          {(item.candidateName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={styles.userName}>{item.candidateName}</p>
                          <p style={styles.userSub}>
                            {item.department || "Candidate Profile"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{item.jobTitle}</td>
                    <td style={styles.td}>{item.email}</td>
                    <td style={styles.td}>{item.experience}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(item.status).bg,
                          color: getStatusColor(item.status).text,
                        }}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(item.appliedAt)}</td>
                    <td style={styles.td}>
                      <div style={styles.actionRow}>
                        <button
                          style={styles.viewButton}
                          onClick={() =>
                            alert(
                              `Application ID: ${item.id}\nCandidate: ${item.candidateName}\nRole: ${item.jobTitle}\nEducation: ${item.education}\nCity: ${item.city}\nSkills: ${item.skills || "—"}`,
                            )
                          }
                        >
                          View
                        </button>
                        <button
                          style={styles.editButton}
                          onClick={() => openModal(item)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Status Update Modal ── */}
      {modalApp && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Update Application Status</h3>
            <p style={styles.modalSub}>
              <strong>{modalApp.candidateName}</strong> — {modalApp.jobTitle}
            </p>
            <label style={styles.label}>New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={styles.select}
            >
              {STATUS_OPTIONS.filter((o) => o !== "All").map((o) => (
                <option key={o} value={o}>
                  {formatStatus(o)}
                </option>
              ))}
            </select>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelButton}
                onClick={() => setModalApp(null)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmButton}
                onClick={handleStatusUpdate}
                disabled={updating}
              >
                {updating ? "Saving…" : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}
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
  heading: { margin: "8px 0 10px 0", fontSize: "36px", color: "#0f172a" },
  subText: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  primaryButton: {
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  statLabel: { margin: 0, color: "#64748b", fontSize: "14px" },
  statValue: { margin: "12px 0 0 0", color: "#0f172a", fontSize: "30px" },
  toolbar: {
    background: "#ffffff",
    borderRadius: "22px",
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
  searchInput: {
    flex: 1,
    minWidth: "280px",
    height: "54px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "0 16px",
    fontSize: "15px",
    background: "#f8fafc",
    outline: "none",
  },
  filterGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  filterButtonActive: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },
  tableCard: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  tableMini: { margin: 0, color: "#64748b", fontSize: "13px" },
  tableTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  countBadge: {
    fontSize: "13px",
    background: "#eef2ff",
    color: "#3730a3",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "700",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "14px 10px",
    color: "#64748b",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 10px",
    color: "#0f172a",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  userCell: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "16px",
  },
  userName: { margin: 0, fontWeight: "700", color: "#0f172a" },
  userSub: { margin: "4px 0 0 0", color: "#64748b", fontSize: "12px" },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  actionRow: { display: "flex", gap: "8px" },
  viewButton: {
    border: "1px solid #dbe2ea",
    background: "#ffffff",
    color: "#0f172a",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  editButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#ffffff",
    padding: "9px 12px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "20px 0" },
  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: "26px",
    padding: "32px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 30px 60px rgba(15,23,42,0.18)",
  },
  modalTitle: { margin: "0 0 8px 0", fontSize: "22px", color: "#0f172a" },
  modalSub: { margin: "0 0 22px 0", color: "#475569", fontSize: "14px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    fontSize: "14px",
    background: "#f8fafc",
    outline: "none",
    marginBottom: "22px",
  },
  modalActions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
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

export default Applications;
