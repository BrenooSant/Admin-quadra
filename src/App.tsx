import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompanyForm from "./components/CompanyForm";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-4 px-8 py-4">
            <Link to="/" className="font-medium text-slate-700 hover:text-slate-900">
              Dashboard
            </Link>
            <Link to="/add" className="font-medium text-slate-700 hover:text-slate-900">
              Nova empresa
            </Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<CompanyForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
