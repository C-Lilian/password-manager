import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSecrets, getSecret, deleteSecret, type SecretList, type SecretRead } from "../api/secrets";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SecretModal from "./SecretModal";
import SecretFormModal from "./SecretFormModal";
import "./styles/SecretsTable.scss";

/**
 * Hook personnalisé qui retarde la mise à jour d'une valeur
 * Utile pour éviter des appels API à chaque frappe dans la recherche
 * 
 * @param value - Valeur à debouncer
 * @param delay - Délai en millisecondes
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

type SortField = "title" | "username" | "url" | "created_at";
type SortDirection = "asc" | "desc";

/**
 * Composant principal affichant la liste des secrets avec recherche, tri et pagination
 * Gère également l'ouverture des modals pour consulter, créer, modifier et supprimer
 */
export const SecretsTable: React.FC = () => {
  const queryClient = useQueryClient();
  
  // États locaux pour la recherche, pagination et modals
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedSecretId, setSelectedSecretId] = useState<string | null>(null);
  const [editingSecretId, setEditingSecretId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // État du tri (par défaut : date de création décroissante)
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const limit = 5;
  const debouncedSearch = useDebounce(search, 400);
  
  // Récupération de la liste des secrets avec React Query (cache + auto-refetch)
  const { data: secrets = [], isLoading, isFetching } = useQuery<SecretList[]>({
    queryKey: ["secrets", page, debouncedSearch],
    queryFn: () => getSecrets({ skip: page * limit, limit, search: debouncedSearch }),
  });
  
  // Récupération d'un secret spécifique (mot de passe déchiffré)
  const { data: selectedSecret } = useQuery<SecretRead>({
    queryKey: ["secret", selectedSecretId],
    queryFn: () => getSecret(selectedSecretId!),
    enabled: !!selectedSecretId, // Ne fetch que si un secret est sélectionné
  });
  
  /**
   * Tri des secrets côté client avec useMemo pour optimisation
   * Ne recalcule que si secrets, sortField ou sortDirection changent
   */
  const sortedSecrets = useMemo(() => {
    return [...secrets].sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";
      
      const comparison = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,       // Tri numérique pour les dates
        sensitivity: "base", // Insensible à la casse
      });
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [secrets, sortField, sortDirection]);
  
  /**
   * Change la colonne de tri ou inverse la direction si même colonne
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  /**
   * Retourne l'icône de tri appropriée selon l'état
   */
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <SwapVertIcon fontSize="small"/>;
    return sortDirection === "asc" ? <VerticalAlignTopIcon fontSize="small"/> : <VerticalAlignBottomIcon fontSize="small"/>;
  };
  
  // Mutation pour la suppression avec invalidation du cache
  const deleteMutation = useMutation({
    mutationFn: deleteSecret,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets"] });
    },
  });
  
  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce secret ?")) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <div className="Secrets">
      {/* Header avec titre et bouton de création */}
      <div className="SecretsHeader">
        <h3>Mes Secrets</h3>
        <button onClick={() => setIsCreating(true)}>+ Nouveau Secret</button>
      </div>
      
      {/* Barre de recherche avec debounce et indicateur de chargement */}
      <div className="SecretsSearchBar">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // Reset à la page 1 lors d'une recherche
          }}
          className="SecretsSearchBarInput"
        />
        {isFetching && (<span className="SecretsSearchBarLoading"><HourglassTopIcon fontSize="small"/></span>)}
      </div>
      
      {/* Affichage conditionnel : loading / vide / tableau */}
      {isLoading ? (
        <div className="SecretsTableLoading">Chargement...</div>
      ) : secrets.length === 0 ? (
        <p>
          {debouncedSearch
            ? `Aucun résultat pour "${debouncedSearch}"`
            : "Aucun secret trouvé. Créez-en un !"}
        </p>
      ) : (
        <div className="SecretsTableContent" style={{ opacity: isFetching ? 0.6 : 1}}>
          <table className="SecretsTableContentTable" border={1}>
            <thead>
              <tr className="SecretsTableContentTableTheadTr">
                {/* Headers cliquables pour le tri */}
                <th
                  className="SecretsTableContentTableTheadTrTitle"
                  onClick={() => handleSort("title")}
                >
                  Titre&nbsp;{getSortIcon("title")}
                </th>
                
                <th
                  className="SecretsTableContentTableTheadTrTitle"
                  onClick={() => handleSort("username")}
                >
                  Utilisateur&nbsp;{getSortIcon("username")}
                </th>
                
                <th
                  className="SecretsTableContentTableTheadTrTitle"
                  onClick={() => handleSort("url")}
                >
                  URL&nbsp;{getSortIcon("url")}
                </th>
                
                <th
                  className="SecretsTableContentTableTheadTrTitle"
                  onClick={() => handleSort("created_at")}
                >
                  Créé&nbsp;le&nbsp;{getSortIcon("created_at")}
                </th>
                
                <th className="SecretsTableContentTableTheadTrActions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedSecrets.map((secret) => (
                <tr
                  key={secret.id}
                  className="SecretsTableContentTableTbodyTr"
                >
                  <td className="SecretsTableContentTableTbodyTrTd">{secret.title}</td>
                  <td className="SecretsTableContentTableTbodyTrTd">{secret.username}</td>
                  <td className="SecretsTableContentTableTbodyTrTd">{secret.url || "-"}</td>
                  <td className="SecretsTableContentTableTbodyTrTd">
                    {new Date(secret.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="SecretsTableContentTableTbodyTrTd">
                    <button onClick={() => setSelectedSecretId(secret.id)}>
                      <RemoveRedEyeIcon fontSize="small" />&nbsp;Voir
                    </button>
                    <button
                      onClick={() => setEditingSecretId(secret.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <ModeEditIcon fontSize="small" />&nbsp;Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(secret.id)}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <DeleteIcon fontSize="small" />&nbsp;Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      <div className="SecretsPagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
          ← Précédent
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={secrets.length < limit}>
          Suivant →
        </button>
      </div>
      
      {/* Modals conditionnelles selon l'action de l'utilisateur */}
      {selectedSecretId && selectedSecret && (
        <SecretModal
          secret={selectedSecret}
          onClose={() => setSelectedSecretId(null)}
        />
      )}
      
      {editingSecretId && (
        <SecretFormModal
          secretId={editingSecretId}
          onClose={() => setEditingSecretId(null)}
        />
      )}
      
      {isCreating && (
        <SecretFormModal onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
};