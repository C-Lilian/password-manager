import api from "./axios";

/**
 * =========================
 *        INTERFACES
 * =========================
 * 
 * Les interfaces reflètent exactement
 * les schémas renvoyés par le backend.
 * 
 * On sépare les types :
 * - List (affichage tableau)
 * - Read (détail complet avec password)
 * - Create (payload création)
 * - Update (payload modification partielle)
 */

/**
 * Représentation d'un secret dans une liste.
 * Utilisé pour l'affichage tableau / pagination.
 * 
 * Le password n'est volontairement PAS inclus ici
 * pour éviter toute exposition accidentelle.
 */
export interface SecretList {
  id: string;
  title: string;
  username: string;
  url?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Représentation complète d'un secret.
 * Utilisé pour la page détail / modal.
 */
export interface SecretRead extends SecretList {
  password: string; // seulement pour détail
}

/**
 * Payload envoyé lors de la création d’un secret.
 * Tous les champs obligatoires sont requis.
 */
export interface SecretCreate {
  title: string;
  username: string;
  password: string;
  url?: string;
}

/**
 * Payload pour mise à jour partielle (PATCH).
 * Tous les champs sont optionnels.
 */
export interface SecretUpdate {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
}


/**
 * =========================
 *        API FUNCTIONS
 * =========================
 * 
 * Toutes les fonctions :
 * - Utilisent l'instance axios configurée (token injecté via interceptor)
 * - Retourne directement response.data
 * - Sont typées pour garantir la cohérence frontend/backend
 */

/**
 * Récupère la liste paginée des secrets.
 * 
 * @param params.skip   Nombre d’éléments à ignorer (pagination offset)
 * @param params.limit  Nombre d’éléments par page
 * @param params.search Recherche par titre / username côté backend
 */
export const getSecrets = async (params: {
  skip?: number;
  limit?: number;
  search?: string;
}): Promise<SecretList[]> => {
  const response = await api.get("/secrets", { params });
  return response.data;
};

/**
 * Récupère un secret spécifique (avec password).
 * Utilisé pour la vue détail ou l'édition.
 */
export const getSecret = async (
  id: string
): Promise<SecretRead> => {
  const response = await api.get<SecretRead>(`/secrets/${id}`);
  return response.data;
};

/**
 * Crée un nouveau secret.
 * Retourne le secret complet créé.
 */
export const createSecret = async (
  data: SecretCreate
): Promise<SecretRead> => {
  const response = await api.post<SecretRead>("/secrets/", data);
  return response.data;
};

/**
 * Met à jour partiellement un secret existant (PATCH).
 * Retourne la version mise à jour.
 */
export const updateSecret = async (
  id: string,
  data: SecretUpdate
): Promise<SecretRead> => {
  const response = await api.patch<SecretRead>(`/secrets/${id}`, data);
  return response.data;
};

/**
 * Supprime un secret.
 * Ne retourne rien si succès.
 */
export const deleteSecret = async (
  id: string
): Promise<void> => {
  await api.delete(`/secrets/${id}`);
};