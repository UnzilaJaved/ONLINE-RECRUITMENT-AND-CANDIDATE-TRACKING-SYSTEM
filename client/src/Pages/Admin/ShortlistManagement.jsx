import { useState, useEffect, useMemo } from "react";

const TABS = ["All", "shortlisted", "applied", "interview", "rejected"];

function ShortlistManagement() {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("All");
  const [updating, setUpdating] = useState(null); // id of row being updated

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/applications?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setCandidates(data.applications || []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error("Shortlist fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (selectedTab === "All") return candidates;
    return candidates.filter((c) => c.status === selectedTab);
  }, [candidates, selectedTab]);

  // ── Status actions ───────────────────────────────────────────────────────
  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong.");
    } finally {
      setUpdating(null);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function tabLabel(t) {
    const map = {
      applied: "Under Review",
      shortlisted: "Shortlisted",
      interview: "Interview Ready",
      rejected: "Rejected",
    };
    return map[t] || t;
  }

  function getStatusStyle(s) {
    if (s === "shortlisted") return { bg: "#dcfce7", text: "#166534" };
    if (s === "applied") return { bg: "#dbeafe", text: "#1d4ed8" };
    if (s === "interview") return { bg: "#ede9fe", text: "#5b21b6" };
    return { bg: "#fee2e2", text: "#991b1b" };
  }

  // Skills come as a comma-separated string from the DB
  function parseSkills(s) {
    if (!s) return [];
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Candidate Evaluation</p>
          <h1 style={styles.heading}>Shortlist Management</h1>
          <p style={styles.subheading}>
            Review applicants, compare profiles, and move strong candidates
            toward the interview stage.
          </p>
        </div>
        <button style={styles.primaryButton} onClick={fetchData}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total Reviewed", value: stats.total },
          { label: "Shortlisted", value: stats.shortlisted },
          {
            label: "Interview Ready",
            value: candidates.filter((c) => c.status === "interview").length,
          },
          { label: "Rejected", value: stats.rejected },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <h2 style={styles.statValue}>{loading ? "…" : s.value}</h2>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={styles.filterBar}>
        <div style={styles.tabWrap}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={selectedTab === tab ? styles.activeTab : styles.tab}
            >
              {tab === "All" ? "All" : tabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={styles.emptyMsg}>Loading candidates…</p>
      ) : filtered.length === 0 ? (
        <p style={styles.emptyMsg}>No candidates in this category.</p>
      ) : (
        <div style={styles.cardGrid}>
          {filtered.map((c) => {
            const skills = parseSkills(c.skills);
            const isUpdating = updating === c.id;
            return (
              <div key={c.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.profileRow}>
                    <div style={styles.avatar}>
                      {(c.candidateName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={styles.name}>{c.candidateName}</h3>
                      <p style={styles.role}>{c.jobTitle}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: getStatusStyle(c.status).bg,
                      color: getStatusStyle(c.status).text,
                    }}
                  >
                    {tabLabel(c.status)}
                  </span>
                </div>

                <div style={styles.infoGrid}>
                  <InfoItem label="Experience" value={c.experience || "—"} />
                  <InfoItem label="Education" value={c.education || "—"} />
                  <InfoItem label="City" value={c.city || "—"} />
                  <InfoItem label="Email" value={c.email || "—"} />
                </div>

                {skills.length > 0 && (
                  <div style={styles.skillWrap}>
                    {skills.map((skill, i) => (
                      <span key={i} style={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {c.coverLetter && (
                  <div style={styles.noteBox}>
                    <p style={styles.noteLabel}>Cover Letter</p>
                    <p style={styles.noteText}>
                      {c.coverLetter.slice(0, 180)}
                      {c.coverLetter.length > 180 ? "…" : ""}
                    </p>
                  </div>
                )}

                <div style={styles.actionRow}>
                  {c.resumeUrl && (
                    <a
                      href={`/uploads/${c.resumeUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.resumeLink}
                    >
                      Resume
                    </a>
                  )}
                  {c.status !== "shortlisted" && (
                    <button
                      style={styles.primarySmallButton}
                      disabled={isUpdating}
                      onClick={() => updateStatus(c.id, "shortlisted")}
                    >
                      {isUpdating ? "…" : "Shortlist"}
                    </button>
                  )}
                  {c.status !== "interview" && (
                    <button
                      style={styles.primarySmallButton}
                      disabled={isUpdating}
                      onClick={() => updateStatus(c.id, "interview")}
                    >
                      {isUpdating ? "…" : "Move to Interview"}
                    </button>
                  )}
                  {c.status !== "rejected" && (
                    <button
                      style={styles.rejectButton}
                      disabled={isUpdating}
                      onClick={() => updateStatus(c.id, "rejected")}
                    >
                      {isUpdating ? "…" : "Reject"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  eyebrow: { margin: 0, color: "#64748b", fontSize: "14px" },
  heading: { margin: "8px 0 10px 0", fontSize: "38px", color: "#0f172a" },
  subheading: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "760px",
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "16px",
    fontSize: "14px",
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
    background: "#fff",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  statLabel: { margin: 0, color: "#64748b", fontSize: "14px" },
  statValue: { margin: "12px 0 0 0", fontSize: "34px", color: "#0f172a" },
  filterBar: {
    background: "#fff",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  tabWrap: { display: "flex", gap: "10px", flexWrap: "wrap" },
  tab: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "11px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    cursor: "pointer",
  },
  activeTab: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "11px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "26px",
    padding: "22px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "18px",
  },
  profileRow: { display: "flex", gap: "14px", alignItems: "center" },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "22px",
  },
  name: { margin: 0, color: "#0f172a", fontSize: "22px" },
  role: { margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  infoGrid: { display: "grid", gap: "10px", marginBottom: "16px" },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #edf2f7",
  },
  infoLabel: { color: "#64748b", fontSize: "14px", fontWeight: "600" },
  infoValue: {
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "right",
  },
  skillWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  skillTag: {
    padding: "9px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "12px",
    fontWeight: "700",
  },
  noteBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "18px",
  },
  noteLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },
  noteText: {
    margin: "8px 0 0 0",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "4px",
  },
  resumeLink: {
    textDecoration: "none",
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "13px",
  },
  primarySmallButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },
  rejectButton: {
    border: "none",
    background: "#ef4444",
    color: "#fff",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "20px 0" },
};

export default ShortlistManagement;
