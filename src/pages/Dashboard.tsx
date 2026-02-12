import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

interface Company {
  id: string;
  name: string;
  location: string;
  price: number;
}

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);

  async function fetchCompanies() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCompanies((data as Company[]) || []);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Empresas cadastradas</h1>

      {!hasSupabaseConfig && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>
          no arquivo <code>.env</code> para carregar os dados.
        </div>
      )}

      <div className="space-y-4">
        {companies.map((company) => (
          <div key={company.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
            <p className="text-slate-600">{company.location}</p>
            <p className="mt-1 font-medium text-emerald-700">R$ {company.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
