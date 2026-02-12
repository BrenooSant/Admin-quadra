import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [companies, setCompanies] = useState<any[]>([]);

  async function fetchCompanies() {
    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCompanies(data || []);
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Empresas cadastradas</h1>

      {companies.map((company) => (
        <div key={company.id} style={{ marginBottom: 20 }}>
          <h3>{company.name}</h3>
          <p>{company.location}</p>
          <p>R$ {company.price}</p>
        </div>
      ))}
    </div>
  );
}