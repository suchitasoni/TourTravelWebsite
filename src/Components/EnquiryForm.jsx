import { useState } from "react";
import { analytics, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logEvent } from "firebase/analytics";
import { getSessionId } from "../utils/session";
import { useRenderCount } from "../TourDataContext";

const EnquiryForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");
  useRenderCount("EnquiryForm");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Save to Firestore
    try {
      const sessionId = getSessionId();
      await addDoc(collection(db, "enquiries"), {
        name,
        phone,
        destination,
        message,
        status: "Pending",
        sessionId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        comments: "",
      });
    logEvent(analytics, "enquiry_submitted", { destination: destination });
      const text = `
        Hi! I just submitted a travel enquiry.
        Name: ${name}
        Phone: ${phone}
        Destination: ${destination}
        Message: ${message}
        `;
      const encoded = encodeURIComponent(text);

      const adminPhone = "919300304422"; // no plus sign
      window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank");
      alert("✅ Your enquiry has been submitted successfully!");
      await addDoc(collection(db, "visits"), {
        page: "Enquiry Submitted",
        sessionId,
        visitedAt: serverTimestamp(),
      });
      // 5. Clear form
      setName("");
      setPhone("");
      setDestination("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      alert("❌ Failed to submit. Please try again.");
    }
  };

  return (
    <div className="enquiry-container">
      <h2 className="enquiry-title">Contact Us</h2>

      <form onSubmit={handleSubmit} className="enquiry-form">
        <input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          id="phoneNumber"
          placeholder="Phone Number (WhatsApp)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="text"
          id="destination"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <textarea
          id="message"
          placeholder="Message / Number of People / Dates"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
        ></textarea>

        <button type="submit">Submit Enquiry</button>
      </form>
    </div>
  );
};

export default EnquiryForm;
