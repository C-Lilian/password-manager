import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSecret,
  updateSecret,
  getSecret,
  type SecretCreate,
  type SecretUpdate,
} from "../api/secrets";
import SecretForm from "./SecretForm";
import "./styles/SecretFormModal.scss";

interface Props {
  secretId?: string; // Si présent = mode édition
  onClose: () => void;
}

const SecretFormModal: React.FC<Props> = ({ secretId, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!secretId;

  // Charge le secret si on édite
  const { data: secret, isLoading } = useQuery({
    queryKey: ["secret", secretId],
    queryFn: () => getSecret(secretId!),
    enabled: isEditing,
  });

  // Mutation pour créer
  const createMutation = useMutation({
    mutationFn: (data: SecretCreate) => createSecret(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets"] });
      onClose();
    },
  });

  // Mutation pour modifier
  const updateMutation = useMutation({
    mutationFn: (data: SecretUpdate) => updateSecret(secretId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets"] });
      queryClient.invalidateQueries({ queryKey: ["secret", secretId] });
      onClose();
    },
  });

  const handleSubmit = async (data: SecretCreate | SecretUpdate) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data as SecretCreate);
    }
  };

  if (isEditing && isLoading) {
    return (
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        Chargement...
      </div>
    );
  }

  return (
    <>
      <div onClick={onClose} className="ModalBackground" />
      
      <div className="ModalContent" >
        <h3 className="ModalContentTitle">{isEditing ? "Modifier le secret" : "Nouveau secret"}</h3>
        
        <SecretForm
          initialData={secret}
          onSubmit={handleSubmit}
        />
        
        <button className="ModalContentButton" onClick={onClose}>
          Annuler
        </button>
      </div>
    </>
  );
};

export default SecretFormModal;