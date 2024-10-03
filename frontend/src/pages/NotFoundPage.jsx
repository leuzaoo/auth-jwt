import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona após 2 segundos
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);

    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [navigate]);

  return (
    <div>
      <h1>404 - Página não encontrada</h1>
      <p>Você será redirecionado para a página inicial em alguns segundos...</p>
    </div>
  );
};

export default NotFoundPage;
