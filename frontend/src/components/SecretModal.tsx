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
        <p className="ModalContentTitle">Détails du secret</p>
        
        <div className="ModalContentChamp">
          <span className="ModalContentChampName">Titre :</span>&nbsp;
          <span className="ModalContentChampField">{secret.title}</span>
        </div>
        
        <div className="ModalContentChamp">
          <span className="ModalContentChampName">Utilisateur :</span>&nbsp;
          <span className="ModalContentChampField">{secret.username}</span>
        </div>
        
        <div className="ModalContentChamp">
          <span className="ModalContentChampName">Mot de passe :</span>&nbsp;
          <input
            type={showPassword ? "text" : "password"}
            value={secret.password}
            readOnly
            className="ModalContentChampInput"
          />&nbsp;
          <button onClick={() => setShowPassword(!showPassword)} className="ModalContentChampButton">
            {showPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
          </button>&nbsp;
          <button onClick={copyPassword} className="ModalContentChampButton">
            {copied ? <CheckBoxIcon fontSize="small" color="success"/> : <ContentCopyIcon fontSize="small"/>}
          </button>
        </div>
        
        {secret.url && (
          <div className="ModalContentChamp">
            <span className="ModalContentChampName">URL :</span>&nbsp;
            <a className="ModalContentChampUrl" href={secret.url} target="_blank" rel="noopener noreferrer">
              {secret.url}
            </a>
          </div>
        )}
        
        <button className="ModalContentButton" onClick={onClose}>Fermer</button>
        
      </div>
    </>
  );
};

export default SecretModal;