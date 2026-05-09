import { useState, useEffect } from "react";

const EMPTY_FORM = {
  applicationId: "",
  interviewDate: "",
  time: "",
  mode: "Google Meet",
  interviewerId: "",
};

function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    confirmed: 0,
    pending: 0,
  });
  const [applications, setApplications] = useState([]); // for the application picker
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchInterviews = () => {
    setLoading(true);
    fetch("/api/admin/interviews?upcoming=true")
      .then((r) => r.json())
      .then((data) => {
        setInterviews(data.interviews || []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error("Interviews fetch error:", err))
      .finally(() => setLoading(false));
  };

  // Fetch shortlisted/interview-stage applications to populate the picker
  const fetchApplications = () => {
    fetch("/api/admin/applications?status=shortlisted&limit=100")
      .then((r) => r.json())
      .then((data) => setApplications(data.applications || []))
      .catch(() => {});
    // Also fetch interview-stage so we can re-edit existing
    fetch("/api/admin/applications?status=interview&limit=100")
      .then((r) => r.json())
      .then((data) =>
        setApplications((prev) => {
          const ids = new Set(prev.map((a) => a.id));
          return [
            ...prev,
            ...(data.applications || []).filter((a) => !ids.has(a.id)),
          ];
        }),
      )
      .catch(() => {});
  };

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  // ── Submit / Edit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicationId || !formData.interviewDate || !formData.time) {
      alert("Application, date, and time are required.");
      return;
    }

    setSubmitting(true);

    // Combine date + time into an ISO string
    const isoDate = new Date(
      `${formData.interviewDate}T${formData.time}`,
    ).toISOString();
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    const payload = {
      applicationId: formData.applicationId,
      interviewDate: isoDate,
      mode: formData.mode,
      interviewerId: formData.interviewerId || storedUser?.id || null,
    };

    try {
      const url = editingId
        ? `/api/admin/interviews/${editingId}`
        : "/api/admin/interviews";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to schedule interview");
        return;
      }

      alert(
        editingId ? "Interview updated!" : "Interview scheduled successfully!",
      );
      setFormData(EMPTY_FORM);
      setEditingId(null);
      fetchInterviews();
    } catch (err) {
      console.error("Schedule error:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (iv) => {
    const d = new Date(iv.interviewDate);
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().slice(0, 5);
    setFormData({
      applicationId: iv.applicationId,
      interviewDate: date,
      time,
      mode: iv.mode,
      interviewerId: iv.interviewerId || "",
    });
    setEditingId(iv.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function formatDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " · " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  }

  function getStatusStyle(s) {
    if (s === "scheduled") return { bg: "#dbeafe", text: "#1d4ed8" };
    if (s === "completed") return { bg: "#dcfce7", text: "#166534" };
    return { bg: "#fef3c7", text: "#92400e" };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Interview Management</p>
          <h1 style={styles.heading}>Interview Schedule</h1>
          <p style={styles.subheading}>
            Plan interviews, assign interviewers, and manage upcoming sessions
            from one premium scheduling workspace.
          </p>
        </div>
        <button style={styles.primaryButton} onClick={fetchInterviews}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          {
            label: "Today's Interviews",
            value: stats.today,
            note: "Scheduled today",
          },
          {
            label: "This Week",
            value: stats.thisWeek,
            note: "Upcoming sessions",
          },
          { label: "Completed", value: stats.confirmed, note: "Sessions done" },
          { label: "Pending", value: stats.pending, note: "Awaiting" },
        ].map((s, i) => (
          <StatCard
            key={i}
            label={s.label}
            value={loading ? "…" : s.value}
            note={s.note}
          />
        ))}
      </div>

      <div style={styles.grid}>
        {/* ── Schedule Form ── */}
        <div style={styles.leftColumn}>
          <div style={styles.formCard}>
            <p style={styles.cardMini}>
              {editingId ? "Edit Schedule" : "Create Schedule"}
            </p>
            <h3 style={styles.cardTitle}>
              {editingId ? "Update Interview" : "Book New Interview"}
            </h3>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                {/* Application picker */}
                <div style={{ ...styles.fieldWrap, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>
                    Application (Candidate — Role)
                  </label>
                  <select
                    name="applicationId"
                    value={formData.applicationId}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select an application…</option>
                    {applications.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.candidateName} — {a.jobTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Date</label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Interview Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option>Google Meet</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>

              <div style={styles.actionRow}>
                {editingId && (
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => {
                      setFormData(EMPTY_FORM);
                      setEditingId(null);
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  style={styles.primaryButtonLarge}
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving…"
                    : editingId
                      ? "Update Interview"
                      : "Confirm Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Interview Queue ── */}
        <div style={styles.rightColumn}>
          <div style={styles.listCard}>
            <div style={styles.listHeader}>
              <div>
                <p style={styles.cardMini}>Upcoming Sessions</p>
                <h3 style={styles.cardTitle}>Interview Queue</h3>
              </div>
            </div>

            {loading ? (
              <p style={styles.emptyMsg}>Loading…</p>
            ) : interviews.length === 0 ? (
              <p style={styles.emptyMsg}>No upcoming interviews scheduled.</p>
            ) : (
              <div style={styles.interviewList}>
                {interviews.map((iv) => (
                  <div key={iv.id} style={styles.interviewCard}>
                    <div style={styles.interviewTop}>
                      <div>
                        <h4 style={styles.interviewName}>{iv.candidateName}</h4>
                        <p style={styles.interviewRole}>{iv.jobTitle}</p>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusStyle(iv.status).bg,
                          color: getStatusStyle(iv.status).text,
                        }}
                      >
                        {iv.status === "scheduled" ? "Scheduled" : "Completed"}
                      </span>
                    </div>

                    <div style={styles.infoList}>
                      <InfoRow
                        label="Date & Time"
                        value={formatDateTime(iv.interviewDate)}
                      />
                      <InfoRow label="Mode" value={iv.mode} />
                      <InfoRow label="Status" value={iv.status} />
                    </div>

                    <div style={styles.cardButtons}>
                      <button
                        style={styles.smallSecondary}
                        onClick={() => openEdit(iv)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, note }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value}</h2>
      <p style={styles.statNote}>{note}</p>
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
  primaryButtonLarge: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
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
  statValue: { margin: "12px 0 8px 0", fontSize: "34px", color: "#0f172a" },
  statNote: { margin: 0, color: "#94a3b8", fontSize: "13px" },
  grid: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "20px" },
  leftColumn: { display: "grid" },
  rightColumn: { display: "grid" },
  formCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  listCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardMini: { margin: 0, color: "#64748b", fontSize: "13px" },
  cardTitle: { margin: "6px 0 18px 0", color: "#0f172a", fontSize: "24px" },
  form: { display: "grid", gap: "18px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  fieldWrap: { display: "grid", gap: "8px" },
  label: { fontSize: "14px", color: "#334155", fontWeight: "700" },
  input: {
    height: "52px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  listHeader: { marginBottom: "8px" },
  interviewList: { display: "grid", gap: "16px" },
  interviewCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
  },
  interviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "16px",
  },
  interviewName: { margin: 0, color: "#0f172a", fontSize: "20px" },
  interviewRole: { margin: "6px 0 0 0", color: "#64748b", fontSize: "14px" },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  infoList: { display: "grid", gap: "10px", marginBottom: "16px" },
  infoRow: {
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
  cardButtons: { display: "flex", gap: "10px" },
  smallSecondary: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "20px 0" },
};

export default InterviewSchedule;
