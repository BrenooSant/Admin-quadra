import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!supabase) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Não foi possível fazer login. Verifique seu email e senha.");
      return;
    }

    navigate("/");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-4 text-2xl font-bold text-slate-900">Login</h1>

        <label className="mb-2 block text-sm text-slate-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
        />

        <label className="mb-2 block text-sm text-slate-700">Senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring"
        />

        <button
          type="submit"
          disabled={loading }
          className="w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}