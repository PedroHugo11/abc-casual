import { useState } from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";


interface RegisterFormProps {
  onClose: () => void;
}

export interface RegisterData {
  cpf: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const getErrorMessage = (err: any): string => {
  if (!err?.response?.data) return "Erro ao criar conta.";

  const data = err.response.data;

  // 🔥 CASO 1: array direto de erros do Identity
  if (Array.isArray(data)) {
    return data.map((e) => e.description).join(" ");
  }

  // Caso 2: errors é array
  if (Array.isArray(data.errors)) {
    return data.errors.join(" ");
  }

  // Caso 3: errors é objeto { campo: [msgs] }
  if (typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    return data.errors[firstKey]?.[0] ?? "Erro ao criar conta.";
  }

  // Caso 4: string direta
  if (typeof data === "string") return data;

  return "Erro ao criar conta.";
};


const translateError = (msg: string): string => {
  const translations: Record<string, string> = {
    "Passwords must be at least 6 characters.":
      "A senha deve ter pelo menos 6 caracteres.",

    "Passwords must have at least one non alphanumeric character.":
      "A senha deve conter pelo menos um caractere especial.",

    "Passwords must have at least one digit":
      "A senha deve conter pelo menos um número.",

    "Passwords must have at least one uppercase":
      "A senha deve conter pelo menos uma letra maiúscula.",
  };

  for (const key in translations) {
    if (msg.includes(key)) {
      return translations[key];
    }
  }

  return msg;
};

const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const [form, setForm] = useState<RegisterData>({
    cpf: "",
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [cpfError, setCpfError] = useState("");
  //const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cpfRegex.test(form.cpf)) {
      setCpfError("CPF inválido");
      return;
    }

    setCpfError("");
    setError("");
    setLoading(true);

    /*try {
      await register(form); // 🔥 backend real
      onClose(); // 🔥 fecha modal
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(translateError(message));
    } finally {
      setLoading(false);
    }*/
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBInput
        label="CPF"
        className="bg-transparent mb-0"
        value={form.cpf}
        onChange={(e) => handleChange("cpf", e.target.value)}
        required
      />
      {cpfError && <small className="text-danger">{cpfError}</small>}

      <MDBInput
        label="Celular"
        className="bg-transparent mb-3 mt-2"
        value={form.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        required
      />

      <MDBInput
        label="Nome"
        className="bg-transparent mb-3 mt-2"
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        required
      />

      <MDBInput
        label="Sobrenome"
        className="bg-transparent mb-3 mt-2"
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        required
      />

      <MDBInput
        label="Email"
        type="email"
        className="bg-transparent mb-3 mt-2"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
      />

      <MDBInput
        label="Senha"
        type="password"
        className="bg-transparent mt-3 mb-4"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
      />

      {error && <small className="text-danger">{error}</small>}

      <MDBBtn color="warning" type="submit" block disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </MDBBtn>
    </form>
  );
};

export default RegisterForm;
