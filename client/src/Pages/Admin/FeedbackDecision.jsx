import { useState, useEffect } from "react";

const EMPTY_FORM = {
  technicalScore: "",
  communicationScore: "",
  confidenceScore: "",
  cultureFit: "Strong",
  finalDecision: "Selected",
  feedback: "",
};

function FeedbackDecision() {
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    selected: 0,
    rejected: 0,
    finalRound: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/feedback")
      .then((r) => r.json())
      .then((data) => {
        setQueue(data.queue || []);
        if (data.stats) setStats(data.stats);
        // Auto-select first item
        if (data.queue?.length > 0 && !selectedInterview) {
          selectInterview(data.queue[0]);
        }
      })
      .catch((err) => console.error("Feedback fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Select interview — pre-fill form if feedback exists ──────────────────
  const selectInterview = (iv) => {
    setSelectedInterview(iv);
    if (iv.existingFeedback) {
      // Fetch full parsed form data
      fetch(`/api/admin/feedback/${iv.id}`)
        .then((r) => r.json())
        .then((fb) => {
          if (fb) {
            setFormData({
              technicalScore: fb.technicalScore || "",
              communicationScore: fb.communicationScore || "",
              confidenceScore: fb.confidenceScore || "",
              cultureFit: fb.cultureFit || "Strong",
              finalDecision: fb.finalDecision || "Selected",
              feedback: fb.detailedFeedback || "",
            });
          }
        })
        .catch(() => setFormData(EMPTY_FORM));
    } else {
      setFormData(EMPTY_FORM);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInterview) {
      alert("Select a candidate first");
      return;
    }

    setSubmitting(true);
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    try {
      const res = await fetch("/api/admin/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: selectedInterview.id,
          createdBy: storedUser?.id,
          technicalScore: formData.technicalScore,
          communicationScore: formData.communicationScore,
          confidenceScore: formData.confidenceScore,
          cultureFit: formData.cultureFit,
          finalDecision: formData.finalDecision,
          feedback: formData.feedback,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save decision");
        return;
      }

      alert("Decision saved successfully!");
      fetchData();
    } catch (err) {
      console.error("Feedback submit error:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getDecisionStyle(s) {
    if (s === "Selected") return { bg: "#dcfce7", text: "#166534" };
    if (s === "Rejected") return { bg: "#fee2e2", text: "#991b1b" };
    return { bg: "#fef3c7", text: "#92400e" };
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Final Evaluation</p>
          <h1 style={styles.heading}>Feedback & Decision</h1>
          <p style={styles.subheading}>
            Review interview performance, record evaluator remarks, and mark the
            final hiring decision.
          </p>
        </div>
        <button style={styles.primaryButton} onClick={fetchData}>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          {
            label: "Pending Decisions",
            value: stats.pending,
            note: "Awaiting review",
          },
          { label: "Selected", value: stats.selected, note: "Offer ready" },
          { label: "Rejected", value: stats.rejected, note: "Closed profiles" },
          {
            label: "Final Round",
            value: stats.finalRound,
            note: "Under evaluation",
          },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <p style={styles.statLabel}>{s.label}</p>
            <h2 style={styles.statValue}>{loading ? "…" : s.value}</h2>
            <p style={styles.statNote}>{s.note}</p>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        {/* Decision Queue */}
        <div style={styles.leftColumn}>
          <div style={styles.panel}>
            <p style={styles.panelMini}>Interviewed Candidates</p>
            <h3 style={styles.panelTitle}>Decision Queue</h3>

            {loading ? (
              <p style={styles.emptyMsg}>Loading…</p>
            ) : queue.length === 0 ? (
              <p style={styles.emptyMsg}>No interviews in the queue yet.</p>
            ) : (
              <div style={styles.candidateList}>
                {queue.map((iv) => (
                  <button
                    key={iv.id}
                    onClick={() => selectInterview(iv)}
                    style={
                      selectedInterview?.id === iv.id
                        ? styles.activeCandidateCard
                        : styles.candidateCard
                    }
                  >
                    <div style={styles.cardTop}>
                      <div>
                        <h4 style={styles.candidateName}>{iv.candidateName}</h4>
                        <p style={styles.candidateRole}>{iv.jobTitle}</p>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getDecisionStyle(iv.decisionStatus).bg,
                          color: getDecisionStyle(iv.decisionStatus).text,
                        }}
                      >
                        {iv.decisionStatus}
                      </span>
                    </div>

                    <div style={styles.infoList}>
                      <InfoRow label="Mode" value={iv.mode} />
                      <InfoRow label="Interviewer" value={iv.interviewer} />
                      <InfoRow
                        label="Date"
                        value={formatDate(iv.interviewDate)}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Form */}
        <div style={styles.rightColumn}>
          <div style={styles.panel}>
            <p style={styles.panelMini}>Evaluation Form</p>
            <h3 style={styles.panelTitle}>Candidate Decision</h3>

            <div style={styles.selectedBox}>
              <span style={styles.selectedLabel}>Selected Candidate</span>
              <h4 style={styles.selectedName}>
                {selectedInterview?.candidateName ?? "None selected"}
              </h4>
              {selectedInterview && (
                <p style={styles.selectedRole}>{selectedInterview.jobTitle}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <Field
                  label="Technical Score"
                  name="technicalScore"
                  value={formData.technicalScore}
                  onChange={handleChange}
                />
                <Field
                  label="Communication Score"
                  name="communicationScore"
                  value={formData.communicationScore}
                  onChange={handleChange}
                />
                <Field
                  label="Confidence Score"
                  name="confidenceScore"
                  value={formData.confidenceScore}
                  onChange={handleChange}
                />
                <SelectField
                  label="Culture Fit"
                  name="cultureFit"
                  value={formData.cultureFit}
                  onChange={handleChange}
                  options={["Strong", "Moderate", "Average", "Weak"]}
                />
                <SelectField
                  label="Final Decision"
                  name="finalDecision"
                  value={formData.finalDecision}
                  onChange={handleChange}
                  options={["Selected", "Rejected", "Hold", "Second Review"]}
                />
              </div>

              <div style={styles.textareaWrap}>
                <label style={styles.label}>Detailed Feedback</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Describe the candidate's performance, strengths, and concerns…"
                />
              </div>

              <div style={styles.actionRow}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setFormData(EMPTY_FORM)}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  style={styles.primaryButtonLarge}
                  disabled={submitting || !selectedInterview}
                >
                  {submitting ? "Saving…" : "Save Final Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, name, value, onChange }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
      >
        {options.map((o, i) => (
          <option key={i}>{o}</option>
        ))}
      </select>
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
  grid: { display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "20px" },
  leftColumn: { display: "grid" },
  rightColumn: { display: "grid" },
  panel: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelMini: { margin: 0, color: "#64748b", fontSize: "13px" },
  panelTitle: { margin: "6px 0 18px 0", color: "#0f172a", fontSize: "24px" },
  candidateList: { display: "grid", gap: "14px" },
  candidateCard: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  activeCandidateCard: {
    border: "1px solid #8b5cf6",
    background: "#eef2ff",
    borderRadius: "20px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  candidateName: { margin: 0, color: "#0f172a", fontSize: "18px" },
  candidateRole: { margin: "6px 0 0 0", color: "#64748b", fontSize: "13px" },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  infoList: { display: "grid", gap: "10px" },
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
  selectedBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "18px",
  },
  selectedLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "6px",
  },
  selectedName: { margin: 0, color: "#0f172a", fontSize: "22px" },
  selectedRole: { margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" },
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
  },
  textareaWrap: { display: "grid", gap: "8px" },
  textarea: {
    minHeight: "130px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "10px 0" },
};

export default FeedbackDecision;
