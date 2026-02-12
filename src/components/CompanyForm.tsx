import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Props {
  onSuccess?: () => void;
}

export default function CompanyForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !location || !price) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("courts").insert([
      {
        name,
        location,
        price: Number(price),
        image_url: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erro ao cadastrar empresa.");
      return;
    }

    alert("Empresa cadastrada com sucesso!");
    onSuccess?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 400,
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Endereço"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Preço"
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL da imagem"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}