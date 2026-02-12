import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompanyForm from "./components/CompanyForm";
import Login from "./pages/Login";
import { supabase } from "./lib/supabase";

const allowedEmails = import.meta.env.VITE_ALLOWED_ADMINS
  ?.split(",")
  .map((email: string) => email.trim()) ?? [];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = "../Login";
  }

  useEffect(() => {
  if (session && !allowedEmails.includes(session.user.email ?? "")) {
    setUnauthorized(true);

    setTimeout(() => {
      setUnauthorized(false);
    }, 4000);

    supabase.auth.signOut();
  }
}, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return (
      <div className="p-8 text-center text-slate-700">
        Carregando...
      </div>
    );
  }

const isAuthenticated =
  session && allowedEmails.includes(session.user.email ?? "");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        {isAuthenticated && (
          <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-4xl items-center gap-4 px-8 py-4">
              <Link to="/" className="font-medium text-slate-700 hover:text-slate-900">
                Dashboard
              </Link>
              <Link to="/add" className="font-medium text-slate-700 hover:text-slate-900">
                Nova empresa
              </Link>
            </nav>
            <button
            onClick={handleLogout}
            className="ml-auto rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
            >
            Sair
            </button>
          </header>
        )}
        {unauthorized && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-red-600 px-5 py-3 text-white shadow-lg animate-slide-in">
          ⚠️ Acesso negado. Você não deveria estar aqui feladaputa da o fora.
        </div>
        )}

        <main>
          <Routes>
            <Route
              path="/login"
              element={
                session ? <Navigate to="/" replace /> : <Login />
              }
            />

            <Route
              path="/"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/add"
              element={
                isAuthenticated ? <CompanyForm /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/login"} replace />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;