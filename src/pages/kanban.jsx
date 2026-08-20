import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas";
import ModalTarefa from "../componentes/ModalTarefa";

const URL_API = 'https://6a85aab49c451dc67a63ebbb.mockapi.io/api/tarefas';

function Kanban() {
  const [tarefas, setTarefas] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar tarefas da API:", erro);
      }
    }

    carregarTarefas();
  }, []);

  useEffect(() => {
    const pendentes = tarefas.filter((t) => t.coluna === "afazer").length;

    if (pendentes > 0) {
      document.title = `(${pendentes}) TaskFlow`;
    } else {
      document.title = "TaskFlow";
    }
  }, [tarefas]);

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  function salvarTarefa(dados) {
    if (dados.id) {
      setTarefas(
        tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t))
      );
    } else {
      setTarefas([...tarefas, { ...dados, id: Date.now(), concluida: false }]);
    }
  }

  const deletarTarefa = (id) => {
    const confirmado = window.confirm("Tem certeza que deseja excluir essa tarefa?");
    if (confirmado) {
      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    }
  };

  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, coluna: novaColuna } : tarefa
      )
    );
  };

  return (
    <>
      <Header
        titulo="TaskFlow testando"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        <div className="kanban-quadro">
          {/* ── COLUNA 1: A FAZER ────────────────────────────────────────── */}
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "afazer").length}
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("afazer")}
                >
                  +
                </button>
              </div>
            </div>

            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "andamento").length}
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("andamento")}
                >
                  +
                </button>
              </div>
            </div>

            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="kanban-contador">
                  {tarefas.filter((t) => t.coluna === "concluido").length}
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("concluido")}
                >
                  +
                </button>
              </div>
            </div>

            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
      </main>

      <ModalTarefa
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={salvarTarefa}
        tarefa={tarefaEditando}
        coluna={colunaAtiva}
      />

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;