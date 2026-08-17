import { Route, Routes } from "react-router-dom";
import "./App.css";
import Kanban from "./pages/kanban";
import Sobre from "./pages/sobre";
import Login from "./pages/login";
import Sidebar from "./componentes/sidebar";
import RotaPrivada from "./componentes/RotaPrivada";

function App() {
  return (
    <div className="app-layout">
      {/* Sidebar fica FORA do Routes — aparece em todas as páginas */}
      <Sidebar />

      {/* Conteúdo principal — muda conforme a URL */}
      <main className="app-conteudo">
        <Routes>
          <Route path="/" element={<RotaPrivada><Kanban/></RotaPrivada>} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;