import { useState } from "react";
import { type SecretRead, type SecretCreate } from "../api/secrets";
import "./styles/SecretForm.scss";

interface Props {
  initialData?: Partial<SecretRead>;
  onSubmit: (data: SecretCreate) => Promise<void>;
}

const SecretForm = ({ initialData = {}, onSubmit }: Props) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    username: initialData.username || "",
    password: initialData.password || "",
    url: initialData.url || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formSecret">
      <div className="formSecretDiv">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Titre *"
          className="formSecretDivInput"
        />
      </div>

      <div className="formSecretDiv">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="Username *"
          className="formSecretDivInput"
        />
      </div>

      <div className="formSecretDiv">
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password *"
          className="formSecretDivInput"
        />
      </div>

      <div className="formSecretDiv">
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="URL (optionnel)"
          className="formSecretDivInput"
        />
      </div>

      <button type="submit" disabled={loading} className="formSecretButton">
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
};

export default SecretForm;