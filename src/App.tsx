import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CompanyForm from "../src/components/CompanyForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<CompanyForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;