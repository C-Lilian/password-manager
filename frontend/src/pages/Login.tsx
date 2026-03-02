import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import "./styles/Login.scss";
import PMLogoNobg from "../assets/pm_logo_nobg.png";
import ErrorIcon from '@mui/icons-material/Error';

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
    <section className="Login">
      <div className="LoginContent">
        <div className="LoginContentHeader">
          <div className="LoginContentHeaderLogo">
            <img src={PMLogoNobg} alt="Logo Password Manager" width={150} loading="lazy"/>
          </div>
          <p className="LoginContentHeaderTitle">
            Connexion <br />
            <span className="LoginContentHeaderTitleInfo">* champs obligatoires</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="LoginContentForm">
          <div className="LoginContentFormField">
            <span className="LoginContentFormFieldName">Email *</span>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="LoginContentFormFieldsInput"
              required
            />
          </div>
          
          <div className="LoginContentFormField">
            <span className="LoginContentFormFieldName">Mot de passe *</span>
            <input
              type="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="LoginContentFormFieldsInput"
              required
            />
          </div>
          
          <button type="submit" className="LoginContentFormButton">Se connecter</button>
        </form>
        
        {error && <p className="LoginContentError"><ErrorIcon fontSize="small" />&nbsp;{error}</p>}
        
        <p className="LoginContentLink">
          Pas encore de compte ? <Link to="/register">S&apos;enregistrer</Link>
        </p>
      </div>
    </section>
  );
}
