import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Company {
  id: string;
  name: string;
  location: string;
  price: number;
}

interface CourtUnit {
  id: string;
  name: string;
  price: number;
  sports: string[];
  image_url?: string;
}

export default function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [units, setUnits] = useState<CourtUnit[]>([]);

  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");
  const [newUnitSports, setNewUnitSports] = useState<string[]>([]);
  const [newUnitImage, setNewUnitImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingUnit, setAddingUnit] = useState(false);

  const SPORT_OPTIONS = ["Vôlei", "Futvôlei", "Beach Tennis"];

  /* ================= FETCH ================= */

  async function fetchCompany() {
    if (!id) return;

    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setCompany(data);
  }

  async function fetchUnits() {
    if (!id) return;

    const { data, error } = await supabase
      .from("court_units")
      .select("*")
      .eq("court_id", id);

    if (!error) setUnits(data || []);
  }

  useEffect(() => {
    if (!id) return;

    async function init() {
      setLoading(true);
      await Promise.all([fetchCompany(), fetchUnits()]);
      setLoading(false);
    }

    init();
  }, [id]);

  /* ================= UPDATE COMPANY ================= */

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
      return;
    }

    alert("Empresa atualizada com sucesso!");
    navigate("/");
  }

  /* ================= ADD UNIT ================= */

  async function handleAddUnit() {
    if (!id) return;
    if (!newUnitName || !newUnitPrice) {
      alert("Preencha nome e preço.");
      return;
    }

    setAddingUnit(true);

    const { error } = await supabase
      .from("court_units")
      .insert([
        {
          court_id: id,
          name: newUnitName,
          price: Number(newUnitPrice),
          sports: newUnitSports,
          image_url: newUnitImage || null,
        },
      ]);

    setAddingUnit(false);

    if (error) {
      alert("Erro ao criar quadra.");
      console.error(error);
      return;
    }

    setNewUnitName("");
    setNewUnitPrice("");
    setNewUnitSports([]);
    setNewUnitImage("");
    fetchUnits();
  }

  /* ================= DELETE UNIT ================= */

  async function handleDeleteUnit(unitId: string) {
    if (!window.confirm("Deseja excluir essa quadra?")) return;

    const { error } = await supabase
      .from("court_units")
      .delete()
      .eq("id", unitId);

    if (!error) fetchUnits();
  }

  /* ================= UI ================= */

  if (loading) return <p className="p-8">Carregando...</p>;
  if (!company) return <p className="p-8 text-red-500">Empresa não encontrada</p>;

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Editar Empresa</h1>

      {/* FORM EMPRESA */}
      <form
        onSubmit={handleUpdate}
        className="space-y-4 rounded-xl border p-6 shadow bg-white"
      >
        <input
          value={company.name}
          onChange={(e) =>
            setCompany({ ...company, name: e.target.value })
          }
          className="w-full rounded-md border p-2"
          placeholder="Nome"
        />

        <input
          value={company.location}
          onChange={(e) =>
            setCompany({ ...company, location: e.target.value })
          }
          className="w-full rounded-md border p-2"
          placeholder="Localização"
        />

        <input
          type="number"
          value={company.price}
          onChange={(e) =>
            setCompany({ ...company, price: Number(e.target.value) })
          }
          className="w-full rounded-md border p-2"
          placeholder="Preço base"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      {/* LISTA DE QUADRAS */}
      <div className="mt-10 border-t pt-6">
        <h2 className="mb-4 text-lg font-semibold">Quadras físicas</h2>

        {units.map((unit) => (
          <div key={unit.id} className="mb-4 rounded-lg border p-4">
            
            {unit.image_url && (
              <img
                src={unit.image_url}
                alt={unit.name}
                className="mb-3 h-40 w-full object-cover rounded-md"
              />
            )}

            <p className="font-medium">{unit.name}</p>
            <p className="text-sm text-gray-500">
              R$ {unit.price}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {unit.sports?.map((sport) => (
                <span
                  key={sport}
                  className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                >
                  {sport}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleDeleteUnit(unit.id)}
              className="mt-3 text-red-600 text-sm"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {/* ADICIONAR QUADRA */}
      <div className="mt-6 rounded-lg border p-4 bg-gray-50">
        <h3 className="mb-3 font-medium">Adicionar nova quadra</h3>

        <input
          value={newUnitName}
          onChange={(e) => setNewUnitName(e.target.value)}
          placeholder="Nome da quadra"
          className="mb-2 w-full rounded-md border p-2"
        />

        <input
          type="number"
          value={newUnitPrice}
          onChange={(e) => setNewUnitPrice(e.target.value)}
          placeholder="Preço"
          className="mb-2 w-full rounded-md border p-2"
        />

        <input
          value={newUnitImage}
          onChange={(e) => setNewUnitImage(e.target.value)}
          placeholder="URL da imagem da quadra"
          className="mb-2 w-full rounded-md border p-2"
        />

        <div className="flex flex-col gap-2 mb-3">
          {SPORT_OPTIONS.map((sport) => (
            <label key={sport} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newUnitSports.includes(sport)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewUnitSports([...newUnitSports, sport]);
                  } else {
                    setNewUnitSports(
                      newUnitSports.filter((s) => s !== sport)
                    );
                  }
                }}
              />
              {sport}
            </label>
          ))}
        </div>

        <button
          onClick={handleAddUnit}
          disabled={addingUnit}
          className="rounded-md bg-green-600 px-4 py-2 text-white"
        >
          {addingUnit ? "Adicionando..." : "Adicionar quadra"}
        </button>
      </div>
    </div>
  );
}