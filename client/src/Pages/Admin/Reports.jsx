import { useState, useEffect } from "react";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [byDept, setByDept] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary || null);
        setByDept(data.byDept || []);
        setPipeline(data.pipeline || []);
        setInsights(data.insights || []);
      })
      .catch((err) => console.error("Reports fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryCards = [
    {
      label: "Applications Received",
      value: summary?.totalApps,
      note: "Total this cycle",
    },
    {
      label: "Shortlisted",
      value: summary?.shortlisted,
      note: "Moved forward",
    },
    {
      label: "Interviews Conducted",
      value: summary?.interviews,
      note: "Completed sessions",
    },
    {
      label: "Offers Released",
      value: summary?.offered,
      note: "Final selections",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Analytics Overview</p>
          <h1 style={styles.heading}>Recruitment Reports</h1>
          <p style={styles.subheading}>
            Track hiring performance, evaluate department-wise progress, and
            monitor overall recruitment outcomes.
          </p>
        </div>
        <button style={styles.primaryButton} onClick={fetchData}>
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div style={styles.statsGrid}>
        {summaryCards.map((item, i) => (
          <div key={i} style={styles.statCard}>
            <p style={styles.statLabel}>{item.label}</p>
            <h2 style={styles.statValue}>
              {loading ? "…" : (item.value ?? 0)}
            </h2>
            <p style={styles.statNote}>{item.note}</p>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        {/* Department table */}
        <div style={styles.leftColumn}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelMini}>Department Summary</p>
                <h3 style={styles.panelTitle}>Hiring Performance Table</h3>
              </div>
            </div>

            {loading ? (
              <p style={styles.emptyMsg}>Loading…</p>
            ) : byDept.length === 0 ? (
              <p style={styles.emptyMsg}>No data yet.</p>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Department</th>
                      <th style={styles.th}>Applications</th>
                      <th style={styles.th}>Shortlisted</th>
                      <th style={styles.th}>Interviews</th>
                      <th style={styles.th}>Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byDept.map((row, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{row.department}</td>
                        <td style={styles.td}>{row.applications}</td>
                        <td style={styles.td}>{row.shortlisted}</td>
                        <td style={styles.td}>{row.interviews}</td>
                        <td style={styles.td}>{row.selected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div style={styles.rightColumn}>
          {/* Pipeline chart */}
          <div style={styles.panel}>
            <p style={styles.panelMini}>Visual Overview</p>
            <h3 style={styles.panelTitle}>Pipeline Snapshot</h3>

            {loading ? (
              <p style={styles.emptyMsg}>Loading…</p>
            ) : (
              <div style={styles.chartList}>
                {pipeline.map((item, i) => (
                  <ChartRow key={i} label={item.label} value={item.value} />
                ))}
              </div>
            )}
          </div>

          {/* Insights */}
          <div style={styles.panel}>
            <p style={styles.panelMini}>Management Notes</p>
            <h3 style={styles.panelTitle}>Key Insights</h3>

            {loading ? (
              <p style={styles.emptyMsg}>Loading…</p>
            ) : (
              <div style={styles.insightList}>
                {insights.map((item, i) => (
                  <div key={i} style={styles.insightItem}>
                    {item}
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

function ChartRow({ label, value }) {
  return (
    <div style={styles.chartRow}>
      <div style={styles.chartTop}>
        <span style={styles.chartLabel}>{label}</span>
        <span style={styles.chartValue}>{value}</span>
      </div>
      <div style={styles.chartBarBg}>
        <div style={{ ...styles.chartBarFill, width: value }} />
      </div>
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
  statValue: { margin: "12px 0 8px 0", fontSize: "34px", color: "#0f172a" },
  statNote: { margin: 0, color: "#94a3b8", fontSize: "13px" },
  grid: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "20px" },
  leftColumn: { display: "grid" },
  rightColumn: { display: "grid", gap: "20px" },
  panel: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  panelHeader: { marginBottom: "18px" },
  panelMini: { margin: 0, color: "#64748b", fontSize: "13px" },
  panelTitle: { margin: "6px 0 0 0", color: "#0f172a", fontSize: "24px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
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
  chartList: { display: "grid", gap: "18px", marginTop: "6px" },
  chartRow: { display: "grid", gap: "10px" },
  chartTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartLabel: { color: "#1e293b", fontWeight: "700" },
  chartValue: { color: "#64748b", fontWeight: "700" },
  chartBarBg: {
    width: "100%",
    height: "14px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  chartBarFill: {
    height: "100%",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    borderRadius: "999px",
  },
  insightList: { display: "grid", gap: "12px" },
  insightItem: {
    padding: "15px 16px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  emptyMsg: { color: "#94a3b8", fontSize: "14px", padding: "10px 0" },
};

export default Reports;
