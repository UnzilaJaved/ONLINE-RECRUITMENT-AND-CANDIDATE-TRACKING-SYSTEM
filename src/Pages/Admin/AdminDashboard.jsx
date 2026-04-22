function AdminDashboard() {
  const topStats = [
    {
      label: "Total Applications",
      value: "1,284",
      change: "+12.4%",
      note: "vs last month",
    },
    {
      label: "Open Positions",
      value: "24",
      change: "+4",
      note: "new this week",
    },
    {
      label: "Shortlisted",
      value: "186",
      change: "+18.2%",
      note: "pipeline growth",
    },
    {
      label: "Interviews Scheduled",
      value: "63",
      change: "+9",
      note: "upcoming rounds",
    },
  ];

  const hiringPipeline = [
    { stage: "Applied", count: 1284, width: "100%" },
    { stage: "Under Review", count: 742, width: "78%" },
    { stage: "Shortlisted", count: 186, width: "52%" },
    { stage: "Interview", count: 63, width: "32%" },
    { stage: "Selected", count: 21, width: "18%" },
  ];

  const recentApplications = [
    {
      name: "Areeba Khan",
      role: "Frontend Developer",
      experience: "2 Years",
      status: "Under Review",
      date: "20 Apr 2026",
    },
    {
      name: "Hamza Tariq",
      role: "Backend Developer",
      experience: "3 Years",
      status: "Shortlisted",
      date: "20 Apr 2026",
    },
    {
      name: "Maham Noor",
      role: "UI/UX Designer",
      experience: "1.5 Years",
      status: "Interview Scheduled",
      date: "19 Apr 2026",
    },
    {
      name: "Adeel Ahmed",
      role: "HR Associate",
      experience: "2 Years",
      status: "Rejected",
      date: "19 Apr 2026",
    },
  ];

  const upcomingInterviews = [
    {
      candidate: "Zoya Ali",
      role: "Product Designer",
      time: "11:00 AM",
      mode: "Google Meet",
    },
    {
      candidate: "Ahmed Raza",
      role: "React Developer",
      time: "01:30 PM",
      mode: "On-site",
    },
    {
      candidate: "Sana Imran",
      role: "QA Engineer",
      time: "03:00 PM",
      mode: "Google Meet",
    },
  ];

  const quickActions = [
    { label: "Create Job Post" },
    { label: "View Applications" },
    { label: "Shortlist Candidates" },
    { label: "Schedule Interview" },
    { label: "Final Decisions" },
    { label: "Open Reports" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <p style={styles.topSmall}>Welcome back</p>
          <h1 style={styles.topHeading}>Admin Dashboard</h1>
          <p style={styles.topSub}>
            Monitor recruitment activity, hiring stages, interviews, and job
            performance from one premium command center.
          </p>
        </div>

        <div style={styles.topRight}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search candidates, jobs, reports..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.profileCard}>
            <div style={styles.profileAvatar}>U</div>
            <div>
              <p style={styles.profileName}>Unzila Admin</p>
              <p style={styles.profileRole}>HR Operations Manager</p>
            </div>
          </div>
        </div>
      </div>

      <section style={styles.statGrid}>
        {topStats.map((item, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statTop}>
              <p style={styles.statLabel}>{item.label}</p>
              <span style={styles.statBadge}>{item.change}</span>
            </div>
            <h2 style={styles.statValue}>{item.value}</h2>
            <p style={styles.statNote}>{item.note}</p>
          </div>
        ))}
      </section>

      <section style={styles.heroGrid}>
        <div style={styles.heroLeft}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Overview</p>
              <h3 style={styles.panelTitle}>Hiring Pipeline</h3>
            </div>
            <span style={styles.panelLink}>Detailed report</span>
          </div>

          <div style={styles.pipelineList}>
            {hiringPipeline.map((item, index) => (
              <div key={index} style={styles.pipelineRow}>
                <div style={styles.pipelineTop}>
                  <span style={styles.pipelineStage}>{item.stage}</span>
                  <span style={styles.pipelineCount}>{item.count}</span>
                </div>
                <div style={styles.pipelineBarBg}>
                  <div
                    style={{
                      ...styles.pipelineBarFill,
                      width: item.width,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Actions</p>
              <h3 style={styles.panelTitle}>Quick Access</h3>
            </div>
          </div>

          <div style={styles.quickGrid}>
            {quickActions.map((item, index) => (
              <button key={index} style={styles.quickAction}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.lowerGrid}>
        <div style={styles.largePanel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.panelMini}>Live Updates</p>
              <h3 style={styles.panelTitle}>Recent Applications</h3>
            </div>
            <span style={styles.panelLink}>View all</span>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Candidate</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Experience</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.role}</td>
                    <td style={styles.td}>{item.experience}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(item.status).bg,
                          color: getStatusColor(item.status).text,
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.smallPanel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelMini}>Today</p>
                <h3 style={styles.panelTitle}>Upcoming Interviews</h3>
              </div>
            </div>

            <div style={styles.interviewList}>
              {upcomingInterviews.map((item, index) => (
                <div key={index} style={styles.interviewCard}>
                  <div>
                    <h4 style={styles.interviewName}>{item.candidate}</h4>
                    <p style={styles.interviewRole}>{item.role}</p>
                  </div>
                  <div style={styles.interviewMeta}>
                    <span style={styles.interviewTime}>{item.time}</span>
                    <span style={styles.interviewMode}>{item.mode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.smallPanel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelMini}>Insights</p>
                <h3 style={styles.panelTitle}>Team Notes</h3>
              </div>
            </div>

            <div style={styles.notesList}>
              <div style={styles.noteItem}>
                Frontend Developer role has highest application volume this
                week.
              </div>
              <div style={styles.noteItem}>
                Shortlist conversion improved after updated screening criteria.
              </div>
              <div style={styles.noteItem}>
                Interview no-show rate dropped compared to last cycle.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Shortlisted") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  if (status === "Rejected") {
    return { bg: "#fee2e2", text: "#991b1b" };
  }
  if (status === "Interview Scheduled") {
    return { bg: "#ede9fe", text: "#5b21b6" };
  }
  return { bg: "#dbeafe", text: "#1d4ed8" };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "5px",
    fontFamily: "Arial, sans-serif",
    width: "100%",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  topSmall: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  topHeading: {
    margin: "8px 0 10px 0",
    fontSize: "38px",
    lineHeight: 1.1,
    color: "#0f172a",
  },
  topSub: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  searchBox: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.06)",
    padding: "8px 12px",
  },
  searchInput: {
    width: "280px",
    maxWidth: "100%",
    height: "42px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    padding: "10px 14px",
    borderRadius: "20px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.06)",
  },
  profileAvatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  profileName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },
  profileRole: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#64748b",
  },
  statGrid: {
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
    alignItems: "center",
    gap: "12px",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
  statBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#16a34a",
    background: "#dcfce7",
    padding: "7px 10px",
    borderRadius: "999px",
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
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  heroLeft: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  heroRight: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
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
  panelLink: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px",
  },
  pipelineList: {
    display: "grid",
    gap: "18px",
    marginTop: "8px",
  },
  pipelineRow: {
    display: "grid",
    gap: "10px",
  },
  pipelineTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pipelineStage: {
    fontWeight: "700",
    color: "#1e293b",
  },
  pipelineCount: {
    fontWeight: "700",
    color: "#64748b",
  },
  pipelineBarBg: {
    width: "100%",
    height: "14px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  pipelineBarFill: {
    height: "100%",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    borderRadius: "999px",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    marginTop: "10px",
  },
  quickAction: {
    border: "1px solid #e2e8f0",
    color: "#0f172a",
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "18px 16px",
    fontWeight: "700",
    textAlign: "center",
    cursor: "pointer",
  },
  lowerGrid: {
    display: "grid",
    gridTemplateColumns: "1.55fr 1fr",
    gap: "20px",
  },
  largePanel: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  rightColumn: {
    display: "grid",
    gap: "20px",
  },
  smallPanel: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 10px",
    color: "#64748b",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px 10px",
    color: "#0f172a",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  interviewList: {
    display: "grid",
    gap: "14px",
  },
  interviewCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  interviewName: {
    margin: 0,
    fontSize: "15px",
    color: "#0f172a",
  },
  interviewRole: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  interviewMeta: {
    display: "grid",
    justifyItems: "end",
    gap: "6px",
  },
  interviewTime: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "13px",
  },
  interviewMode: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "12px",
  },
  notesList: {
    display: "grid",
    gap: "12px",
  },
  noteItem: {
    padding: "15px 16px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};

export default AdminDashboard;