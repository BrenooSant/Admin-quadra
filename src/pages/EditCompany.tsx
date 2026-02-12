import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Company {
  id: string;
  name: string;
  location: string;
  price: number;
}

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchCompany() {
    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    } else {
      setCompany(data);
    }

    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;

    setSaving(true);

    const { error } = await supabase
      .from("courts")
      .update({
        name: company.name,
        location: company.location,
        price: company.price,
      })
      .eq("id", company.id);

    setSaving(false);

    if (error) {
      alert("Erro ao atualizar empresa");
      console.error(error);
      return;
    }

    alert("Empresa atualizada com sucesso!");
    navigate("/");
  }

  useEffect(() => {
    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (!company) {
    return <p className="p-8 text-red-500">Empresa não encontrada</p>;
  }

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Editar Empresa</h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-4 rounded-xl border p-6 shadow bg-white"
      >
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            value={company.name}
            onChange={(e) =>
              setCompany({ ...company, name: e.target.value })
            }
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Localização</label>
          <input
            type="text"
            value={company.location}
            onChange={(e) =>
              setCompany({ ...company, location: e.target.value })
            }
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Preço</label>
          <input
            type="number"
            value={company.price}
            onChange={(e) =>
              setCompany({ ...company, price: Number(e.target.value) })
            }
            className="mt-1 w-full rounded-md border p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}