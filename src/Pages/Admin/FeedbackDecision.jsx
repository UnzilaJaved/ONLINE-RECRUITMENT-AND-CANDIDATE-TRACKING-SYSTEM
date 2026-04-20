import { useState } from "react";

function FeedbackDecision() {
  const [selectedCandidate, setSelectedCandidate] = useState("Areeba Khan");
  const [formData, setFormData] = useState({
    technicalScore: "8",
    communicationScore: "9",
    confidenceScore: "8",
    cultureFit: "Strong",
    finalDecision: "Selected",
    feedback:
      "Candidate performed well in technical discussion and showed strong communication skills.",
  });

  const candidates = [
    {
      name: "Areeba Khan",
      role: "Frontend Developer",
      interviewStage: "Final Interview",
      interviewer: "Sarah Ahmed",
      date: "24 Apr 2026",
      status: "Pending Decision",
    },
    {
      name: "Hamza Tariq",
      role: "Backend Developer",
      interviewStage: "Technical Interview",
      interviewer: "Ali Raza",
      date: "24 Apr 2026",
      status: "Pending Decision",
    },
    {
      name: "Maham Noor",
      role: "UI/UX Designer",
      interviewStage: "Final Interview",
      interviewer: "Hina Shah",
      date: "25 Apr 2026",
      status: "Selected",
    },
  ];

  const decisionStats = [
    { label: "Pending Decisions", value: "12", note: "Awaiting review" },
    { label: "Selected", value: "21", note: "Offer ready" },
    { label: "Rejected", value: "15", note: "Closed profiles" },
    { label: "Final Round", value: "8", note: "Under evaluation" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Decision saved successfully!");
    console.log({ selectedCandidate, ...formData });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Final Evaluation</p>
          <h1 style={styles.heading}>Feedback & Decision</h1>
          <p style={styles.subheading}>
            Review interview performance, record evaluator remarks, and mark the
            final hiring decision for each candidate.
          </p>
        </div>

        <button style={styles.primaryButton}>Export Decisions</button>
      </div>

      <div style={styles.statsGrid}>
        {decisionStats.map((item, index) => (
          <div key={index} style={styles.statCard}>
            <p style={styles.statLabel}>{item.label}</p>
            <h2 style={styles.statValue}>{item.value}</h2>
            <p style={styles.statNote}>{item.note}</p>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={styles.leftColumn}>
          <div style={styles.panel}>
            <p style={styles.panelMini}>Interviewed Candidates</p>
            <h3 style={styles.panelTitle}>Decision Queue</h3>

            <div style={styles.candidateList}>
              {candidates.map((candidate, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCandidate(candidate.name)}
                  style={
                    selectedCandidate === candidate.name
                      ? styles.activeCandidateCard
                      : styles.candidateCard
                  }
                >
                  <div style={styles.cardTop}>
                    <div>
                      <h4 style={styles.candidateName}>{candidate.name}</h4>
                      <p style={styles.candidateRole}>{candidate.role}</p>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: getDecisionStyle(candidate.status).bg,
                        color: getDecisionStyle(candidate.status).text,
                      }}
                    >
                      {candidate.status}
                    </span>
                  </div>

                  <div style={styles.infoList}>
                    <InfoRow label="Stage" value={candidate.interviewStage} />
                    <InfoRow label="Interviewer" value={candidate.interviewer} />
                    <InfoRow label="Date" value={candidate.date} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.panel}>
            <p style={styles.panelMini}>Evaluation Form</p>
            <h3 style={styles.panelTitle}>Candidate Decision</h3>

            <div style={styles.selectedBox}>
              <span style={styles.selectedLabel}>Selected Candidate</span>
              <h4 style={styles.selectedName}>{selectedCandidate}</h4>
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
                />
              </div>

              <div style={styles.actionRow}>
                <button type="button" style={styles.secondaryButton}>
                  Save Draft
                </button>
                <button type="submit" style={styles.primaryButtonLarge}>
                  Save Final Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <select name={name} value={value} onChange={onChange} style={styles.input}>
        {options.map((option, index) => (
          <option key={index}>{option}</option>
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

function getDecisionStyle(status) {
  if (status === "Selected") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  return { bg: "#fef3c7", text: "#92400e" };
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
  eyebrow: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  heading: {
    margin: "8px 0 10px 0",
    fontSize: "38px",
    color: "#0f172a",
  },
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
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statValue: {
    margin: "12px 0 8px 0",
    fontSize: "34px",
    color: "#0f172a",
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "20px",
  },
  leftColumn: {
    display: "grid",
  },
  rightColumn: {
    display: "grid",
  },
  panel: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  panelTitle: {
    margin: "6px 0 18px 0",
    color: "#0f172a",
    fontSize: "24px",
  },
  candidateList: {
    display: "grid",
    gap: "14px",
  },
  candidateCard: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "20px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
  },
  activeCandidateCard: {
    border: "1px solid #8b5cf6",
    background: "#eef2ff",
    borderRadius: "20px",
    padding: "16px",
    cursor: "pointer",
    textAlign: "left",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "12px",
  },
  candidateName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },
  candidateRole: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  infoList: {
    display: "grid",
    gap: "10px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #edf2f7",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },
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
    marginBottom: "8px",
  },
  selectedName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "22px",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  fieldWrap: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "700",
  },
  input: {
    height: "52px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "0 14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
  },
  textareaWrap: {
    display: "grid",
    gap: "8px",
  },
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
};

export default FeedbackDecision;