// 1. Import do Navigate — vem do react-router
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";

function RotaPrivada({ children }) {
  // 2. Verificamos a condição NO RENDER (não em um evento)
  //    Se logado for false, entramos no if
  const { logado } = useAuth();
  if (!logado) {
    // 3. Retornamos o componente Navigate
    //    React o renderiza → Router intercepta → muda URL
    //    to='/login': destino do redirecionamento
    //    replace={true}: não adiciona ao histórico do navegador
    //    sem replace: botão Voltar levaria de volta ao Dashboard
    return <Navigate to="/login" replace={true} />;
  }

  // 4. Se chegou aqui, logado é true
  //    Renderizamos o que foi passado entre as tags:
  //    <RotaPrivada logado={logado}><Dashboard /></RotaPrivada>
  //    children = <Dashboard />
  return children;
}

export default RotaPrivada;