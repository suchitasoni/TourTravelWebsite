import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { formatDistanceToNow } from "date-fns";

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Fetch enquiries
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter by status
  const handleFilter = (status) => {
    setFilter(status);
    if (status === "All") setFilteredEnquiries(enquiries);
    else setFilteredEnquiries(enquiries.filter((e) => e.status === status));
  };

  // Sort enquiries
  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = [...filteredEnquiries].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return order === "newest"
        ? b.createdAt.seconds - a.createdAt.seconds
        : a.createdAt.seconds - b.createdAt.seconds;
    });
    setFilteredEnquiries(sorted);
  };

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const ref = doc(db, "enquiries", id);
      await updateDoc(ref, {
        status: newStatus,
        updatedAt: new Date(),
      });
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("❌ Failed to update status.");
    }
  };

  // Update comment
  const updateComment = async (id, comment) => {
    try {
      const ref = doc(db, "enquiries", id);
      await updateDoc(ref, {
        comments: comment,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("❌ Failed to update comment.");
    }
  };

  if (loading) return <p>Loading enquiries...</p>;

  return (
    <div className="enquiries-container">
      <h3>Customer Enquiries</h3>

      {/* Filters + Sorting Controls */}
      <div className="filter-bar">
        <div>
          <label>Status: </label>
          <select value={filter} onChange={(e) => handleFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Contacted</option>
            <option>In Progress</option>
            <option>Booked</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div>
          <label>Sort: </label>
          <select value={sortOrder} onChange={(e) => handleSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredEnquiries.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Destination</th>
              <th>Message</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Created</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map((enq) => (
              <tr key={enq.id}>
                <td>{enq.name}</td>
                <td>{enq.phone}</td>
                <td>{enq.destination}</td>
                <td>{enq.message}</td>
                <td>
                  <span className={`status ${enq.status.toLowerCase()}`}>
                    {enq.status}
                  </span>
                </td>
                <td>
                  <textarea
                    className="comment-box"
                    defaultValue={enq.comments || ""}
                    onBlur={(e) => updateComment(enq.id, e.target.value)}
                    placeholder="Add a note..."
                  />
                </td>
                <td>
                  {enq.createdAt?.seconds ? (
                    <span className="timestamp">
                      {formatDistanceToNow(new Date(enq.createdAt.seconds * 1000), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <select
                    value={enq.status}
                    onChange={(e) => updateStatus(enq.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Contacted</option>
                    <option>In Progress</option>
                    <option>Booked</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
