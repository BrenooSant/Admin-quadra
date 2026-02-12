import { useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

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

    if (!supabase) {
      alert("Configure o Supabase no arquivo .env para cadastrar.");
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
      className="mx-auto flex w-full max-w-xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {!hasSupabaseConfig && (
        <p className="rounded-md bg-amber-50 p-2 text-sm text-amber-900">
          Configure o Supabase no <code>.env</code> para salvar os dados.
        </p>
      )}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Endereço"
        className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Preço"
        className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL da imagem"
        className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
      />

      <button
        type="submit"
        disabled={loading || !hasSupabaseConfig}
        className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}
