import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      login(response.data.access_token);
      navigate("/");
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      
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
        
        <button type="submit">Login</button>
      </form>
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <p>
        Pas encore de compte ? <Link to="/register">S&apos;enregistrer</Link>
      </p>
    </div>
  );
}
