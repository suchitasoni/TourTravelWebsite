import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from "@mui/material";

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Firebase Auth sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Check Firestore for admin record
      const adminRef = doc(db, "admins", user.email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        // ✅ Authorized admin — proceed
        localStorage.setItem("isAdmin", "true");
        navigate("/adminDashboard");
      } else {
        // ❌ Not admin — sign out and show error
        await signOut(auth);
        setError("Access denied. You are not authorized to access the admin panel.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  const handleToggle = () => {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
    // Change the button text
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <form onSubmit={handleLogin} style={{ width: "100%", position: 'relative' }}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <Button style={{position: 'absolute',right: '10px',bottom: '61px',color: 'black',border: 'none',backgroundColor: 'transparent'}} type="button" id="togglePassword" onClick={handleToggle}>
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </Button>
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: '90%',
    padding: '12px',
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid rgb(204, 204, 204)'
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};
