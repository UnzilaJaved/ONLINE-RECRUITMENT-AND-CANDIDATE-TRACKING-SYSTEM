import { useState } from "react";

function InterviewSchedule() {
  const [formData, setFormData] = useState({
    candidate: "Areeba Khan",
    role: "Frontend Developer",
    interviewer: "Sarah Ahmed",
    date: "2026-04-24",
    time: "11:00",
    mode: "Google Meet",
    duration: "45 Minutes",
    stage: "Technical Interview",
    notes: "",
  });

  const interviews = [
    {
      candidate: "Zoya Ali",
      role: "Product Designer",
      interviewer: "Ali Raza",
      date: "24 Apr 2026",
      time: "10:00 AM",
      mode: "Google Meet",
      stage: "HR Screening",
      status: "Scheduled",
    },
    {
      candidate: "Ahmed Tariq",
      role: "Backend Developer",
      interviewer: "Sana Khan",
      date: "24 Apr 2026",
      time: "01:30 PM",
      mode: "On-site",
      stage: "Technical Interview",
      status: "Confirmed",
    },
    {
      candidate: "Maham Noor",
      role: "UI/UX Designer",
      interviewer: "Hina Shah",
      date: "25 Apr 2026",
      time: "03:00 PM",
      mode: "Google Meet",
      stage: "Final Interview",
      status: "Pending",
    },
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
    console.log("Interview Scheduled:", formData);
    alert("Interview scheduled successfully!");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Interview Management</p>
          <h1 style={styles.heading}>Interview Schedule</h1>
          <p style={styles.subheading}>
            Plan interviews, assign interviewers, and manage upcoming sessions
            from one premium scheduling workspace.
          </p>
        </div>

        <button style={styles.primaryButton}>Sync Calendar</button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Today’s Interviews" value="8" note="Scheduled today" />
        <StatCard label="This Week" value="26" note="Upcoming sessions" />
        <StatCard label="Confirmed" value="18" note="Attendance locked" />
        <StatCard label="Pending" value="5" note="Awaiting response" />
      </div>

      <div style={styles.grid}>
        <div style={styles.leftColumn}>
          <div style={styles.formCard}>
            <p style={styles.cardMini}>Create Schedule</p>
            <h3 style={styles.cardTitle}>Book New Interview</h3>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <InputField
                  label="Candidate Name"
                  name="candidate"
                  value={formData.candidate}
                  onChange={handleChange}
                />
                <InputField
                  label="Applied Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
                <InputField
                  label="Interviewer"
                  name="interviewer"
                  value={formData.interviewer}
                  onChange={handleChange}
                />
                <SelectField
                  label="Interview Mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  options={["Google Meet", "Zoom", "On-site", "Phone Call"]}
                />
                <InputField
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                <InputField
                  label="Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
                <SelectField
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  options={["30 Minutes", "45 Minutes", "60 Minutes", "90 Minutes"]}
                />
                <SelectField
                  label="Interview Stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  options={[
                    "HR Screening",
                    "Technical Interview",
                    "Managerial Interview",
                    "Final Interview",
                  ]}
                />
              </div>

              <div style={styles.textareaWrap}>
                <label style={styles.label}>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add special instructions, meeting link notes, or preparation details"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.actionRow}>
                <button type="button" style={styles.secondaryButton}>
                  Save Draft
                </button>
                <button type="submit" style={styles.primaryButtonLarge}>
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.listCard}>
            <div style={styles.listHeader}>
              <div>
                <p style={styles.cardMini}>Upcoming Sessions</p>
                <h3 style={styles.cardTitle}>Interview Queue</h3>
              </div>
            </div>

            <div style={styles.interviewList}>
              {interviews.map((item, index) => (
                <div key={index} style={styles.interviewCard}>
                  <div style={styles.interviewTop}>
                    <div>
                      <h4 style={styles.interviewName}>{item.candidate}</h4>
                      <p style={styles.interviewRole}>{item.role}</p>
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

                  <div style={styles.infoList}>
                    <InfoRow label="Interviewer" value={item.interviewer} />
                    <InfoRow label="Date" value={item.date} />
                    <InfoRow label="Time" value={item.time} />
                    <InfoRow label="Mode" value={item.mode} />
                    <InfoRow label="Stage" value={item.stage} />
                  </div>

                  <div style={styles.cardButtons}>
                    <button style={styles.smallSecondary}>Edit</button>
                    <button style={styles.smallPrimary}>Send Invite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
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

function getStatusStyle(status) {
  if (status === "Scheduled") {
    return { bg: "#dbeafe", text: "#1d4ed8" };
  }
  if (status === "Confirmed") {
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
    boxShadow: "0 15px 30px rgba(59,130,246,0.20)",
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
    gridTemplateColumns: "1.35fr 1fr",
    gap: "20px",
  },
  leftColumn: {
    display: "grid",
  },
  rightColumn: {
    display: "grid",
  },
  formCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  listCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 14px 35px rgba(15,23,42,0.06)",
    border: "1px solid #eef2f7",
  },
  cardMini: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  cardTitle: {
    margin: "6px 0 18px 0",
    color: "#0f172a",
    fontSize: "24px",
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
    boxSizing: "border-box",
  },
  textareaWrap: {
    display: "grid",
    gap: "8px",
  },
  textarea: {
    minHeight: "120px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    padding: "14px",
    fontSize: "14px",
    outline: "none",
    background: "#f8fafc",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  listHeader: {
    marginBottom: "8px",
  },
  interviewList: {
    display: "grid",
    gap: "16px",
  },
  interviewCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px",
  },
  interviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "16px",
  },
  interviewName: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },
  interviewRole: {
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
  infoList: {
    display: "grid",
    gap: "10px",
    marginBottom: "16px",
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
  cardButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  smallSecondary: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  smallPrimary: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default InterviewSchedule;