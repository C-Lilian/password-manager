import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./styles/Login.scss";
import PMLogoNobg from "../assets/pm_logo_nobg.png";
import ErrorIcon from '@mui/icons-material/Error';

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
    <section className="Login">
      <div className="LoginContent">
        <div className="LoginContentHeader">
          <div className="LoginContentHeaderLogo">
            <img src={PMLogoNobg} alt="Logo Password Manager" width={150} loading="lazy"/>
          </div>
          <p className="LoginContentHeaderTitle">
            Inscription<br />
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
          
          <button type="submit" className="LoginContentFormButton">S&apos;inscrire</button>
        </form>
        
        {error && <p className="LoginContentError"><ErrorIcon fontSize="small" />&nbsp;{error}</p>}
        
        <p className="LoginContentLink">
          Vous avez d&eacute;j&agrave; un compte ? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
