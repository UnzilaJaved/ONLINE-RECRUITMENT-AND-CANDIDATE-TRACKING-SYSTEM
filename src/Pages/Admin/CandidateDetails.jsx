import { useState } from "react";

function Applications() {
  const [searchTerm, setSearchTerm] = useState("");

  const applications = [
    {
      id: 1,
      name: "Areeba Khan",
      role: "Frontend Developer",
      email: "areeba@gmail.com",
      experience: "2 Years",
      status: "Under Review",
      date: "20 Apr 2026",
    },
    {
      id: 2,
      name: "Hamza Tariq",
      role: "Backend Developer",
      email: "hamza@gmail.com",
      experience: "3 Years",
      status: "Shortlisted",
      date: "20 Apr 2026",
    },
    {
      id: 3,
      name: "Maham Noor",
      role: "UI/UX Designer",
      email: "maham@gmail.com",
      experience: "1.5 Years",
      status: "Interview Scheduled",
      date: "19 Apr 2026",
    },
    {
      id: 4,
      name: "Adeel Ahmed",
      role: "HR Associate",
      email: "adeel@gmail.com",
      experience: "2 Years",
      status: "Rejected",
      date: "19 Apr 2026",
    },
    {
      id: 5,
      name: "Sana Imran",
      role: "QA Engineer",
      email: "sana@gmail.com",
      experience: "2.5 Years",
      status: "Pending",
      date: "18 Apr 2026",
    },
  ];

  const filteredApplications = applications.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.topSection}>
        <div>
          <p style={styles.smallText}>Recruitment Panel</p>
          <h1 style={styles.heading}>Applications Management</h1>
          <p style={styles.subText}>
            Review all submitted applications, monitor status, and take hiring
            actions from one premium workspace.
          </p>
        </div>

        <button style={styles.primaryButton}>Export Applications</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Applications</p>
          <h2 style={styles.statValue}>1,284</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Pending Review</p>
          <h2 style={styles.statValue}>324</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Shortlisted</p>
          <h2 style={styles.statValue}>186</h2>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Rejected</p>
          <h2 style={styles.statValue}>92</h2>
        </div>
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by candidate name, role, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.filterGroup}>
          <button style={styles.filterButton}>All Status</button>
          <button style={styles.filterButton}>All Roles</button>
          <button style={styles.filterButton}>Newest First</button>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <p style={styles.tableMini}>Live Records</p>
            <h3 style={styles.tableTitle}>Candidate Applications</h3>
          </div>
        </div>

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
              {filteredApplications.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p style={styles.userName}>{item.name}</p>
                        <p style={styles.userSub}>Candidate Profile</p>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{item.role}</td>
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
                      {item.status}
                    </span>
                  </td>
                  <td style={styles.td}>{item.date}</td>
                  <td style={styles.td}>
                    <div style={styles.actionRow}>
                      <button style={styles.viewButton}>View</button>
                      <button style={styles.editButton}>Update</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
  if (status === "Pending") {
    return { bg: "#fef3c7", text: "#92400e" };
  }
  return { bg: "#dbeafe", text: "#1d4ed8" };
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
  smallText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  heading: {
    margin: "8px 0 10px 0",
    fontSize: "36px",
    color: "#0f172a",
  },
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
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statValue: {
    margin: "12px 0 0 0",
    color: "#0f172a",
    fontSize: "30px",
  },
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
  filterGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#0f172a",
    padding: "12px 16px",
    borderRadius: "14px",
    fontWeight: "600",
    cursor: "pointer",
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
  tableMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  tableTitle: {
    margin: "6px 0 0 0",
    color: "#0f172a",
    fontSize: "24px",
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
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
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
  userName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },
  userSub: {
    margin: "4px 0 0 0",
    color: "#64748b",
    fontSize: "12px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  actionRow: {
    display: "flex",
    gap: "8px",
  },
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
};

export default Applications;