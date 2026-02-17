import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { SecretsTable } from "../components/SecretsTable";
import "./styles/Dashboard.scss";

interface User {
  id: string;
  email: string;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error: any) {
        console.error("Failed to fetch user:", error);
        setError("Impossible de charger les informations utilisateur");
        
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [logout, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  if (loading) {
    return (
      <div className="Loading">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center" 
      }}>
        <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
        <button onClick={() => navigate("/login")}>Retour &agrave; la connexion</button>
      </div>
    );
  }

  return (
    <div className="Dashboard">
      {/* Header avec infos utilisateur et logout */}
      <div className="DashboardHeader">
        <div>
          <h2 className="DashboardHeaderTitle">Dashboard</h2>
          {user && (
            <p className="DashboardHeaderUser">
              Connect&eacute; en tant que <strong>{user.email}</strong>
            </p>
          )}
        </div>
        
        <button onClick={handleLogout} className="DashboardHeaderDeconnect">
          <span><ExitToAppIcon fontSize="small"/> D&eacute;connexion</span>
        </button>
      </div>
      
      {/* Table des secrets */}
      <div className="DashboardSecrets">
        <SecretsTable />
      </div>
    </div>
  );
}