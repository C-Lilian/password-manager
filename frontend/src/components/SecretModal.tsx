import React, { useState } from "react";
import { type SecretRead } from "../api/secrets";
import "./styles/SecretModal.scss";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
  secret: SecretRead;
  onClose: () => void;
}

const SecretModal: React.FC<Props> = ({ secret, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(secret.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div onClick={onClose} className="ModalBackground" />
      
      <div className="ModalContent">
        <h3>Détails du secret</h3>
        
        <div className="ModalContentChamp">
          <strong>Titre:</strong>&nbsp;{secret.title}
        </div>
        
        <div className="ModalContentChamp">
          <strong>Utilisateur:</strong>&nbsp;{secret.username}
        </div>
        
        <div className="ModalContentChamp">
          <strong>Mot de passe:</strong>&nbsp;
          <input
            type={showPassword ? "text" : "password"}
            value={secret.password}
            readOnly
            className="ModalContentChampMdp"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="ModalContentChampButton">
            {showPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
          </button>
          <button onClick={copyPassword} className="ModalContentChampButton">
            {copied ? <CheckBoxIcon fontSize="small" color="success"/> : <ContentCopyIcon fontSize="small"/>}
          </button>
        </div>
        
        {secret.url && (
          <div className="ModalContentChamp">
            <strong>URL:</strong>&nbsp;
            <a href={secret.url} target="_blank" rel="noopener noreferrer">
              {secret.url}
            </a>
          </div>
        )}
        
        <div className="ModalContentButton">
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </>
  );
};

export default SecretModal;