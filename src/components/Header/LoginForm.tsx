import { useState } from "react";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/features/auth/authSlice";
import { selectAuthLoading } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onClose: () => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onClose,
  onCreateAccount,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const router = useRouter();

  //const { login } = useAuth();

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      onClose();
    } catch (error) {
      console.error("Erro no login", error);
      alert("Email ou senha inválidos");
    }
  };*/

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        onClose(); // fecha modal primeiro

        if (redirect === "checkout") {
          router.push("/checkout");
        }
      })
      .catch(() => {
        setErrorMessage("Email ou senha inválidos");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="alert alert-danger py-2 text-center">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <MDBInput
          className="bg-transparent"
          type="email"
          label="Email"
          color="body"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrorMessage("");
          }}
          required
        />
      </div>

      <div className="mb-4">
        <MDBInput
          className="bg-transparent"
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrorMessage("");
          }}
          required
        />
      </div>

      <MDBBtn type="submit" color="warning" disabled={loading} block>
        {loading ? "Entrando..." : "Entrar"}
      </MDBBtn>

      <div className="row mt-4">
        <div className="col">
          <button
            type="button"
            className="btn btn-link link-dark p-0"
            onClick={onCreateAccount}
          >
            Criar uma conta
          </button>
        </div>

        <div className="col text-end">
          <button
            type="button"
            className="btn btn-link link-dark p-0"
            onClick={onForgotPassword}
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
