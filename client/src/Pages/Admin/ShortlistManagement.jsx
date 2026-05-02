import { useState } from "react";

function ShortlistManagement() {
  const [selectedTab, setSelectedTab] = useState("All");

  const candidates = [
    {
      id: 1,
      name: "Areeba Khan",
      role: "Frontend Developer",
      score: "89%",
      status: "Shortlisted",
      experience: "2 Years",
      education: "BS Computer Science",
      skills: ["React", "JavaScript", "CSS"],
      note: "Strong UI skills and good portfolio quality.",
    },
    {
      id: 2,
      name: "Hamza Tariq",
      role: "Backend Developer",
      score: "84%",
      status: "Under Review",
      experience: "3 Years",
      education: "BS Software Engineering",
      skills: ["Node.js", "Express", "SQL"],
      note: "Good technical background, needs final review.",
    },
    {
      id: 3,
      name: "Maham Noor",
      role: "UI/UX Designer",
      score: "91%",
      status: "Interview Ready",
      experience: "1.5 Years",
      education: "BDes",
      skills: ["Figma", "Wireframing", "Prototyping"],
      note: "Excellent design sense and strong case study work.",
    },
    {
      id: 4,
      name: "Adeel Ahmed",
      role: "HR Associate",
      score: "68%",
      status: "Rejected",
      experience: "2 Years",
      education: "BBA",
      skills: ["Recruitment", "Communication", "HR Support"],
      note: "Average profile, not aligned with current needs.",
    },
  ];

  const filteredCandidates =
    selectedTab === "All"
      ? candidates
      : candidates.filter((item) => item.status === selectedTab);

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

        <button style={styles.primaryButton}>Create Final Shortlist</button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Total Reviewed" value="246" note="Profiles screened" />
        <StatCard label="Shortlisted" value="54" note="Ready for next step" />
        <StatCard label="Interview Ready" value="21" note="Prepared candidates" />
        <StatCard label="Rejected" value="37" note="Not selected" />
      </div>

      <div style={styles.filterBar}>
        <div style={styles.tabWrap}>
          {["All", "Shortlisted", "Under Review", "Interview Ready", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={selectedTab === tab ? styles.activeTab : styles.tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.cardGrid}>
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.profileRow}>
                <div style={styles.avatar}>{candidate.name.charAt(0)}</div>
                <div>
                  <h3 style={styles.name}>{candidate.name}</h3>
                  <p style={styles.role}>{candidate.role}</p>
                </div>
              </div>

              <span
                style={{
                  ...styles.statusBadge,
                  background: getStatusStyle(candidate.status).bg,
                  color: getStatusStyle(candidate.status).text,
                }}
              >
                {candidate.status}
              </span>
            </div>

            <div style={styles.scoreBox}>
              <div>
                <p style={styles.scoreLabel}>Evaluation Score</p>
                <h2 style={styles.scoreValue}>{candidate.score}</h2>
              </div>
              <div style={styles.scoreRing}>✓</div>
            </div>

            <div style={styles.infoGrid}>
              <InfoItem label="Experience" value={candidate.experience} />
              <InfoItem label="Education" value={candidate.education} />
            </div>

            <div style={styles.skillWrap}>
              {candidate.skills.map((skill, index) => (
                <span key={index} style={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteLabel}>Admin Note</p>
              <p style={styles.noteText}>{candidate.note}</p>
            </div>

            <div style={styles.actionRow}>
              <button style={styles.secondaryButton}>View Profile</button>
              <button style={styles.primarySmallButton}>Move to Interview</button>
              <button style={styles.rejectButton}>Reject</button>
            </div>
          </div>
        ))}
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

function InfoItem({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "Shortlisted") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  if (status === "Under Review") {
    return { bg: "#dbeafe", text: "#1d4ed8" };
  }
  if (status === "Interview Ready") {
    return { bg: "#ede9fe", text: "#5b21b6" };
  }
  return { bg: "#fee2e2", text: "#991b1b" };
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
    boxShadow: "0 15px 30px rgba(59,130,246,0.20)",
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
  filterBar: {
    background: "#fff",
    borderRadius: "24px",
    padding: "16px",
    marginBottom: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  tabWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
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
  profileRow: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
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
  name: {
    margin: 0,
    color: "#0f172a",
    fontSize: "22px",
  },
  role: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  scoreBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  scoreLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  scoreValue: {
    margin: "8px 0 0 0",
    color: "#0f172a",
    fontSize: "30px",
  },
  scoreRing: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },
  infoGrid: {
    display: "grid",
    gap: "12px",
    marginBottom: "16px",
  },
  infoItem: {
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
  skillWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "18px",
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
  },
  secondaryButton: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  primarySmallButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  rejectButton: {
    border: "none",
    background: "#ef4444",
    color: "#fff",
    padding: "11px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default ShortlistManagement;