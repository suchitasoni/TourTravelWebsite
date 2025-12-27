import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

export default function MetricsAdmin() {
  const [visits, setVisits] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionVisits, setSessionVisits] = useState([]);
  const [loadingSession, setLoadingSession] = useState(false);
const [allSessions, setAllSessions] = useState([]);

  // Fetch data
useEffect(() => {
  const fetchData = async () => {
    try {
      const visitsSnap = await getDocs(collection(db, "visits"));
      const enquiriesSnap = await getDocs(collection(db, "enquiries"));

      const visitsData = visitsSnap.docs.map((doc) => doc.data());
      const enquiriesData = enquiriesSnap.docs.map((doc) => doc.data());

      setVisits(visitsData);
      setEnquiries(enquiriesData);

      // ✅ Combine all sessions
      const visitSessions = [...new Set(visitsData.map((v) => v.sessionId))];
      const enquirySessions = [...new Set(enquiriesData.map((e) => e.sessionId))];

      // Create combined list with flags
      const combinedSessions = visitSessions.map((sid) => ({
        sessionId: sid,
        hasEnquiry: enquirySessions.includes(sid),
      }));

      setAllSessions(combinedSessions);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) return <p>Loading metrics...</p>;

  const totalVisits = visits.length;
  const totalEnquiries = enquiries.length;

  // Chart data
  const pageCounts = visits.reduce((acc, v) => {
    acc[v.page] = (acc[v.page] || 0) + 1;
    return acc;
  }, {});
  const destinationCounts = enquiries.reduce((acc, e) => {
    if (e.destination) acc[e.destination] = (acc[e.destination] || 0) + 1;
    return acc;
  }, {});

  const pageData = Object.entries(pageCounts).map(([page, count]) => ({
    page,
    count,
  }));
  const destinationData = Object.entries(destinationCounts).map(
    ([destination, count]) => ({ destination, count })
  );

  // Fetch session details
  const viewSessionDetails = async (sessionId) => {
    setLoadingSession(true);
    setSelectedSession(sessionId);
    try {
      const q = query(
        collection(db, "visits"),
        where("sessionId", "==", sessionId),
        orderBy("visitedAt", "asc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setSessionVisits(data);
    } catch (err) {
      console.error("Error fetching session details:", err);
    } finally {
      setLoadingSession(false);
    }
  };

  const closeModal = () => {
    setSelectedSession(null);
    setSessionVisits([]);
  };

  return (
    <div className="metrics-container">
      <h3>Website Metrics</h3>

      {/* Summary Cards */}
      <div className="metrics-summary">
        <div className="metric-card">
          <h4>Total Visits</h4>
          <p>{totalVisits}</p>
        </div>
        <div className="metric-card">
          <h4>Total Enquiries</h4>
          <p>{totalEnquiries}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-section">
        <h4>Top Pages</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0b2c46" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h4>Top Enquiry Destinations</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={destinationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="destination" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2b7a78" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Enquiries */}
      <div className="metrics-section">
        <h4>Recent Enquiries</h4>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Time</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {enquiries
              .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
              .slice(0, 5)
              .map((e, i) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.destination}</td>
                  <td>{e.status}</td>
                  <td>
                    {e.createdAt?.seconds
                      ? formatDistanceToNow(
                          new Date(e.createdAt.seconds * 1000),
                          { addSuffix: true }
                        )
                      : "—"}
                  </td>
                  <td>
                    <button
                      className="session-link"
                      onClick={() => viewSessionDetails(e.sessionId)}
                    >
                      {e.sessionId}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
{/* All Sessions */}
<div className="metrics-section">
  <h4>All Sessions</h4>
  <table className="metrics-table">
    <thead>
      <tr>
        <th>Session ID</th>
        <th>Type</th>
        <th>Last Active</th>
      </tr>
    </thead>
    <tbody>
      {allSessions
        .filter((s) => s.sessionId) // skip undefined
        .slice(-20) // show last 20 sessions
        .reverse()
        .map((s, i) => {
          const sessionVisitsForId = visits.filter(
            (v) => v.sessionId === s.sessionId
          );
          const lastVisit =
            sessionVisitsForId.length > 0
              ? sessionVisitsForId[sessionVisitsForId.length - 1].visitedAt
              : null;

          return (
            <tr key={i}>
              <td>
                <button
                  className="session-link"
                  onClick={() => viewSessionDetails(s.sessionId)}
                >
                  {s.sessionId}
                </button>
              </td>
              <td>
                {s.hasEnquiry ? (
                  <span style={{ color: "green", fontWeight: "600" }}>
                    Enquiry Made
                  </span>
                ) : (
                  <span style={{ color: "#666" }}>Visitor Only</span>
                )}
              </td>
              <td>
                {lastVisit?.seconds
                  ? formatDistanceToNow(
                      new Date(lastVisit.seconds * 1000),
                      { addSuffix: true }
                    )
                  : "—"}
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
</div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Session Details</h4>
            <p><strong>Session ID:</strong> {selectedSession}</p>

            {loadingSession ? (
              <p>Loading session data...</p>
            ) : sessionVisits.length > 0 ? (
              <ul className="session-list">
                {sessionVisits.map((v, idx) => (
                  <li key={idx}>
                    <span className="step">{idx + 1}.</span>{" "}
                    <strong>{v.page}</strong> —{" "}
                    {v.visitedAt?.seconds
                      ? formatDistanceToNow(
                          new Date(v.visitedAt.seconds * 1000),
                          { addSuffix: true }
                        )
                      : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data for this session.</p>
            )}

            <button className="close-modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
