import { Link, NavLink } from "react-router-dom";

function CandidateDashboard() {
  const stats = [
    {
      label: "Applications Submitted",
      value: "3",
      note: "Across active roles",
      trend: "+1 this week",
    },
    {
      label: "Under Review",
      value: "1",
      note: "Waiting on recruiter review",
      trend: "In progress",
    },
    {
      label: "Shortlisted",
      value: "1",
      note: "Moved to next stage",
      trend: "Strong profile",
    },
    {
      label: "Interviews",
      value: "1",
      note: "Upcoming interview round",
      trend: "Scheduled",
    },
  ];

  const applications = [
    {
      id: "APP-101",
      role: "Frontend Developer",
      company: "JAPS Tech",
      date: "20 Apr 2026",
      status: "Under Review",
      progress: 45,
    },
    {
      id: "APP-102",
      role: "UI/UX Designer",
      company: "JAPS Design",
      date: "18 Apr 2026",
      status: "Shortlisted",
      progress: 72,
    },
    {
      id: "APP-103",
      role: "Backend Developer",
      company: "JAPS Engineering",
      date: "16 Apr 2026",
      status: "Interview Scheduled",
      progress: 90,
    },
  ];

  const updates = [
    {
      title: "Frontend Developer",
      text: "Your application is under initial review by the hiring team.",
    },
    {
      title: "UI/UX Designer",
      text: "Congratulations — you have been shortlisted for the next stage.",
    },
    {
      title: "Backend Developer",
      text: "Your interview is scheduled for 25 Apr 2026 at 11:00 AM.",
    },
  ];

  const timeline = [
    { step: "Application Submitted", active: true },
    { step: "Initial Review", active: true },
    { step: "Shortlisting", active: true },
    { step: "Interview", active: true },
    { step: "Final Decision", active: false },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>JA</div>
          <div>
            <h2 style={styles.logoTitle}>JAPS</h2>
            <p style={styles.logoSub}>Candidate Dashboard</p>
          </div>
        </div>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/jobs" style={styles.navLink}>
            Jobs
          </Link>
          <Link to="/application-status" style={styles.activeNavLink}>
            Status
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <section style={styles.heroSection}>
          <div style={styles.heroLeft}>
            <p style={styles.heroMini}>Welcome back</p>
            <h1 style={styles.heroTitle}>Your hiring journey, all in one place</h1>
            <p style={styles.heroText}>
              Track applications, monitor progress, follow interview updates,
              and stay informed with a polished candidate experience.
            </p>

            <div style={styles.heroButtons}>
              <Link to="/application-status" style={styles.primaryButton}>
                View Full Status
              </Link>
              <Link to="/jobs" style={styles.secondaryButton}>
                Explore More Jobs
              </Link>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.profileCard}>
              <div style={styles.profileTop}>
                <div style={styles.profileAvatar}>A</div>
                <div>
                  <p style={styles.profileName}>Hassan</p>
                  <p style={styles.profileRole}>Candidate Portal</p>
                </div>
              </div>

              <div style={styles.profileDivider}></div>

              <div style={styles.profileInfoList}>
                <InfoRow label="Candidate ID" value="C-2026-041" />
                <InfoRow label="Active Applications" value="3" />
                <InfoRow label="Interview Stage" value="1 Ongoing" />
              </div>
            </div>
          </div>
        </section>

        <section style={styles.statsGrid}>
          {stats.map((item, index) => (
            <div key={index} style={styles.statCard}>
              <div style={styles.statTop}>
                <p style={styles.statLabel}>{item.label}</p>
                <span style={styles.statTrend}>{item.trend}</span>
              </div>
              <h2 style={styles.statValue}>{item.value}</h2>
              <p style={styles.statNote}>{item.note}</p>
            </div>
          ))}
        </section>

        <section style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelMini}>My Applications</p>
                  <h3 style={styles.panelTitle}>Application Overview</h3>
                </div>
              </div>

              <div style={styles.applicationGrid}>
                {applications.map((item, index) => (
                  <div key={index} style={styles.applicationCard}>
                    <div style={styles.applicationTop}>
                      <div>
                        <p style={styles.appId}>{item.id}</p>
                        <h4 style={styles.appRole}>{item.role}</h4>
                        <p style={styles.appCompany}>{item.company}</p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusStyle(item.status).bg,
                          color: getStatusStyle(item.status).text,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div style={styles.appMetaRow}>
                      <span style={styles.metaPill}>Submitted: {item.date}</span>
                    </div>

                    <div style={styles.progressWrap}>
                      <div style={styles.progressTop}>
                        <span style={styles.progressLabel}>Progress</span>
                        <span style={styles.progressValue}>{item.progress}%</span>
                      </div>
                      <div style={styles.progressBarBg}>
                        <div
                          style={{
                            ...styles.progressBarFill,
                            width: `${item.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelMini}>Latest Activity</p>
                  <h3 style={styles.panelTitle}>Recent Updates</h3>
                </div>
              </div>

              <div style={styles.updateList}>
                {updates.map((item, index) => (
                  <div key={index} style={styles.updateItem}>
                    <h4 style={styles.updateTitle}>{item.title}</h4>
                    <p style={styles.updateText}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelMini}>Current Progress</p>
                  <h3 style={styles.panelTitle}>Hiring Timeline</h3>
                </div>
              </div>

              <div style={styles.timelineList}>
                {timeline.map((item, index) => (
                  <div key={index} style={styles.timelineItem}>
                    <div
                      style={{
                        ...styles.timelineDot,
                        background: item.active ? "#2563eb" : "#cbd5e1",
                        color: "#fff",
                      }}
                    >
                      {index + 1}
                    </div>
                    <p
                      style={{
                        ...styles.timelineText,
                        color: item.active ? "#0f172a" : "#94a3b8",
                      }}
                    >
                      {item.step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelMini}>Upcoming</p>
                  <h3 style={styles.panelTitle}>Interview Highlight</h3>
                </div>
              </div>

              <div style={styles.interviewCard}>
                <p style={styles.interviewRole}>Backend Developer</p>
                <h4 style={styles.interviewHeading}>Technical Interview</h4>
                <p style={styles.interviewDetail}>25 Apr 2026 • 11:00 AM</p>
                <p style={styles.interviewDetail}>Mode: Google Meet</p>
                <Link to="/application-status" style={styles.primaryButtonFull}>
                  Open Status Page
                </Link>
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelMini}>Quick Actions</p>
                  <h3 style={styles.panelTitle}>Candidate Tools</h3>
                </div>
              </div>

              <div style={styles.actionList}>
                <Link to="/application-status" style={styles.actionButton}>
                  View Full Status
                </Link>
                <Link to="/jobs" style={styles.actionButton}>
                  Browse Jobs
                </Link>
                <Link to="/" style={styles.actionButton}>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
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

function getStatusStyle(status) {
  if (status === "Shortlisted") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  if (status === "Interview Scheduled") {
    return { bg: "#ede9fe", text: "#5b21b6" };
  }
  return { bg: "#dbeafe", text: "#1d4ed8" };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 36px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  logoTitle: {
    margin: 0,
    fontSize: "20px",
  },
  logoSub: {
    margin: "4px 0 0 0",
    fontSize: "12px",
    color: "#64748b",
  },
  navLinks: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#334155",
    fontWeight: "600",
    padding: "10px 14px",
  },
  activeNavLink: {
    textDecoration: "none",
    color: "#1d4ed8",
    background: "#eff6ff",
    fontWeight: "700",
    padding: "10px 14px",
    borderRadius: "12px",
  },
  container: {
    padding: "28px 36px 36px 36px",
  },
  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "20px",
    marginBottom: "24px",
  },
  heroLeft: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "30px",
    padding: "34px",
  },
  heroMini: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  heroTitle: {
    margin: "14px 0 14px 0",
    fontSize: "44px",
    lineHeight: 1.08,
  },
  heroText: {
    margin: 0,
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "680px",
  },
  heroButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  primaryButton: {
    textDecoration: "none",
    display: "inline-block",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700",
  },
  secondaryButton: {
    textDecoration: "none",
    display: "inline-block",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    border: "1px solid #dbe2ea",
  },
  heroRight: {
    display: "grid",
  },
  profileCard: {
    background: "#ffffff",
    borderRadius: "30px",
    padding: "28px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  profileAvatar: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "22px",
  },
  profileName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "18px",
  },
  profileRole: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  profileDivider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "18px 0",
  },
  profileInfoList: {
    display: "grid",
    gap: "12px",
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
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statTrend: {
    padding: "7px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  statValue: {
    margin: "14px 0 8px 0",
    fontSize: "34px",
    color: "#0f172a",
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.65fr",
    gap: "20px",
  },
  leftColumn: {
    display: "grid",
    gap: "20px",
  },
  rightColumn: {
    display: "grid",
    gap: "20px",
    alignContent: "start",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelHeader: {
    marginBottom: "18px",
  },
  panelMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  panelTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "24px",
  },
  applicationGrid: {
    display: "grid",
    gap: "16px",
  },
  applicationCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
  },
  applicationTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
    marginBottom: "14px",
  },
  appId: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "12px",
  },
  appRole: {
    margin: "8px 0 6px 0",
    fontSize: "22px",
    color: "#0f172a",
  },
  appCompany: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  appMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  metaPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
  },
  progressWrap: {
    display: "grid",
    gap: "10px",
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
  },
  progressValue: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  progressBarBg: {
    width: "100%",
    height: "12px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
  },
  updateList: {
    display: "grid",
    gap: "12px",
  },
  updateItem: {
    padding: "16px",
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  updateTitle: {
    margin: 0,
    fontSize: "17px",
    color: "#0f172a",
  },
  updateText: {
    margin: "8px 0 0 0",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  timelineList: {
    display: "grid",
    gap: "14px",
  },
  timelineItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "14px",
  },
  timelineDot: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },
  timelineText: {
    margin: 0,
    fontWeight: "700",
  },
  interviewCard: {
    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
    borderRadius: "22px",
    padding: "18px",
  },
  interviewRole: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "13px",
  },
  interviewHeading: {
    margin: "8px 0 10px 0",
    fontSize: "24px",
    color: "#0f172a",
  },
  interviewDetail: {
    margin: "0 0 8px 0",
    color: "#475569",
    lineHeight: 1.7,
  },
  primaryButtonFull: {
    textDecoration: "none",
    display: "inline-block",
    marginTop: "14px",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "13px 16px",
    borderRadius: "14px",
    fontWeight: "700",
  },
  actionList: {
    display: "grid",
    gap: "12px",
  },
  actionButton: {
    textDecoration: "none",
    color: "#0f172a",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "15px 16px",
    fontWeight: "700",
    textAlign: "center",
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
};

export default CandidateDashboard;