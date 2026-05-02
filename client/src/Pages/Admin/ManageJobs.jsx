import { useState } from "react";

function ManageJobs() {
  const [searchTerm, setSearchTerm] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Karachi",
      type: "Full Time",
      applicants: 34,
      status: "Active",
      postedDate: "18 Apr 2026",
      salary: "PKR 120,000 - 160,000",
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore",
      type: "Full Time",
      applicants: 27,
      status: "Active",
      postedDate: "16 Apr 2026",
      salary: "PKR 140,000 - 190,000",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Islamabad",
      type: "Remote",
      applicants: 19,
      status: "Draft",
      postedDate: "14 Apr 2026",
      salary: "PKR 100,000 - 135,000",
    },
    {
      id: 4,
      title: "HR Associate",
      department: "Human Resources",
      location: "Karachi",
      type: "Part Time",
      applicants: 11,
      status: "Closed",
      postedDate: "12 Apr 2026",
      salary: "PKR 70,000 - 95,000",
    },
    {
      id: 5,
      title: "QA Engineer",
      department: "Quality Assurance",
      location: "Remote",
      type: "Full Time",
      applicants: 21,
      status: "Active",
      postedDate: "10 Apr 2026",
      salary: "PKR 110,000 - 150,000",
    },
    {
      id: 6,
      title: "Project Coordinator",
      department: "Operations",
      location: "Karachi",
      type: "Full Time",
      applicants: 15,
      status: "Draft",
      postedDate: "08 Apr 2026",
      salary: "PKR 90,000 - 120,000",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button style={styles.secondaryTopButton}>Import Jobs</button>
          <button style={styles.primaryTopButton}>+ Create New Job</button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Jobs</p>
          <h2 style={styles.statValue}>24</h2>
          <p style={styles.statNote}>All created openings</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Active Jobs</p>
          <h2 style={styles.statValue}>16</h2>
          <p style={styles.statNote}>Currently accepting applications</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Draft Jobs</p>
          <h2 style={styles.statValue}>5</h2>
          <p style={styles.statNote}>Pending publishing</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Closed Jobs</p>
          <h2 style={styles.statValue}>3</h2>
          <p style={styles.statNote}>Hiring cycle completed</p>
        </div>
      </div>

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
          <button style={styles.filterButton}>All Status</button>
          <button style={styles.filterButton}>All Departments</button>
          <button style={styles.filterButton}>Newest First</button>
        </div>
      </div>

      <div style={styles.cardGrid}>
        {filteredJobs.map((job) => (
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
                {job.status}
              </span>
            </div>

            <div style={styles.metaRow}>
              <span style={styles.metaChip}>📍 {job.location}</span>
              <span style={styles.metaChip}>💼 {job.type}</span>
              <span style={styles.metaChip}>👥 {job.applicants} Applicants</span>
            </div>

            <div style={styles.infoBox}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Posted Date</span>
                <span style={styles.infoValue}>{job.postedDate}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Salary Range</span>
                <span style={styles.infoValue}>{job.salary}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Stage</span>
                <span style={styles.infoValue}>Application Collection</span>
              </div>
            </div>

            <div style={styles.actionRow}>
              <button style={styles.viewButton}>View</button>
              <button style={styles.editButton}>Edit</button>
              <button style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Active") {
    return { bg: "#dcfce7", text: "#166534" };
  }
  if (status === "Draft") {
    return { bg: "#fef3c7", text: "#92400e" };
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
    fontSize: "38px",
    color: "#0f172a",
  },
  subText: {
    margin: 0,
    maxWidth: "760px",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  topActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
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
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  statValue: {
    margin: "12px 0 8px 0",
    color: "#0f172a",
    fontSize: "32px",
  },
  statNote: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },
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
  searchWrap: {
    flex: 1,
    minWidth: "280px",
  },
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
  filterWrap: {
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
  jobDept: {
    margin: 0,
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700",
  },
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
};

export default ManageJobs;