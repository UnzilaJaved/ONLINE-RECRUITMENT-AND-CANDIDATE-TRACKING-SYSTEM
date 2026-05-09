import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarInner}>
          <div style={styles.brandWrap}>
            <div style={styles.brandIcon}>JA</div>
            <div>
              <h2 style={styles.brandTitle}>JAPS Admin</h2>
              <p style={styles.brandSub}>Hiring Intelligence Panel</p>
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <p style={styles.sidebarLabel}>Main Menu</p>
            <Link to="/admin/dashboard" style={styles.navItem}>Dashboard</Link>
            <Link to="/admin/jobs" style={styles.navItem}>Manage Jobs</Link>
            <Link to="/admin/applications" style={styles.navItem}>Applications</Link>
            <Link to="/admin/shortlist" style={styles.navItem}>Shortlisting</Link>
            <Link to="/admin/interview" style={styles.navItem}>Interviews</Link>
            <Link to="/admin/feedback" style={styles.navItem}>Decisions</Link>
            <Link to="/admin/reports" style={styles.navItem}>Reports</Link>
            <Link to="/admin/signup" style={styles.navItem}>Admin Registration</Link>
          </div>

          <Link to="/admin-login" style={styles.logout}>Logout</Link>
        </div>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  // ── Outer wrapper: just a flex row, no min-height needed here ──────────────
  page: {
    display: "flex",
    alignItems: "flex-start",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
  },

  // ── Sidebar: sticky so it stays in place while main scrolls ───────────────
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    width: "290px",
    flexShrink: 0,                // never squish the sidebar
    overflowY: "auto",            // sidebar itself scrolls if nav is very long
    background: "linear-gradient(180deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
    color: "#fff",
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },

  // ── Inner wrapper handles padding and flex layout inside the sidebar ───────
  sidebarInner: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",           // stretch so logout stays at the bottom
    padding: "24px 18px",
  },

  // ── Main content: grows to fill remaining width, page scroll lives here ────
  main: {
    flex: 1,
    minWidth: 0,
    minHeight: "100vh",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px",
  },
  brandIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "20px",
  },
  brandSub: {
    margin: "4px 0 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },
  sidebarSection: {
    display: "grid",
    gap: "10px",
    flex: 1,                      // push logout to the bottom
  },
  sidebarLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 8px 4px",
  },
  navItem: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "14px 16px",
    borderRadius: "16px",
    fontWeight: "600",
    display: "block",
    background: "rgba(255,255,255,0.03)",
  },
  logout: {
    textDecoration: "none",
    color: "#dc2626",
    background: "#fee2e2",
    padding: "15px 14px",
    borderRadius: "17px",
    marginTop: "24px",
    fontWeight: "700",
    display: "block",
    textAlign: "center",
  },
};

export default AdminLayout;