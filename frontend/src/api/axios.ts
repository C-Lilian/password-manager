import axios from "axios";

/**
 * Instance Axios centralisée.
 * 
 * - baseURL : configurable via variable d'environnement (Vite)
 * - withCredentials : permet d'envoyer cookies si backend en utilise
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true
});

/**
 * ==============================
 *     REQUEST INTERCEPTOR
 * ==============================
 * 
 * Ajoute automatiquement le JWT à chaque requête sortante.
 * 
 * Évite de devoir passer le token manuellement
 * dans chaque appel API.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ==============================
 *     RESPONSE INTERCEPTOR
 * ==============================
 * 
 * Centralise la gestion des erreurs HTTP.
 * 
 * Cas géré ici :
 * - 401 → token expiré ou invalide
 *   → suppression du token
 *   → redirection vers login
 * 
 * Évite de dupliquer cette logique
 * dans chaque composant.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;