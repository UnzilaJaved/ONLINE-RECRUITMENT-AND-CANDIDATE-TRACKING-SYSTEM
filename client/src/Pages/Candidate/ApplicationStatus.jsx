import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ApplicationStatus() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/api/candidate/dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  return (
    <div style={styles.page}>
      <h1>Application Status</h1>

      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        applications.map((app, i) => (
          <div key={i} style={styles.card}>
            <h3>{app.jobs?.title}</h3>
            <p>Status: {app.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 36px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.6,
  },
  card: {
    maxWidth: "700px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  cardText: {
    margin: "14px 0 20px",
    color: "#64748b",
    lineHeight: 1.7,
  },
  button: {
    display: "inline-block",
    textDecoration: "none",
    color: "#fff",
    background: "#2563eb",
    borderRadius: "16px",
    padding: "12px 22px",
    fontWeight: 700,
  },
};

export default ApplicationStatus;
