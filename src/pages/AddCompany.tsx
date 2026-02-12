import CompanyForm from "../components/CompanyForm";
import { useNavigate } from "react-router-dom";

export default function AddCompany() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>Adicionar Empresa</h1>

      <CompanyForm
        onSuccess={() => {
          navigate("/");
        }}
      />
    </div>
  );
}