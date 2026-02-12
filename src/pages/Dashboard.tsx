import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  location: string;
  price: number;
}

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();

  async function fetchCompanies() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCompanies((data as Company[]) || []);
  }

  function handleEdit(company: Company) {
  navigate(`/edit/${company.id}`);
}

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Empresas cadastradas
      </h1>

      <div className="space-y-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {/* Botão de editar */}
            <button
              onClick={() => handleEdit(company)}
              className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Pencil size={18} />
            </button>

            <h3 className="text-lg font-semibold text-slate-900">
              {company.name}
            </h3>
            <p className="text-slate-600">{company.location}</p>
            <p className="mt-1 font-medium text-emerald-700">
              R$ {company.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}