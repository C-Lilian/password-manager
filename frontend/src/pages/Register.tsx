import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">S&apos;enregistrer</button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <p>
        Vous avez d&eacute;j&agrave; un compte ? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
