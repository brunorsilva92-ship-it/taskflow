import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas";
import ModalTarefa from "../componentes/ModalTarefa";
import { OrbitProgress } from "react-loading-indicators";

function Kanban() {

  const URL_API = 'https://6a85aab49c451dc67a63ebbb.mockapi.io/api/tarefas';
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarTarefas( ) {
      try {
        setCarregando(true);
        setErro('');
        
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data);

      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique a conexao.');
        console.error(e);
    } finally {
      setCarregando(false);
    }
  }
  carregarTarefas();
}, []);

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        const { data: tarefaEditada } = await axios.put(URL_API + '/' + dados.id,
        {
          texto:      dados.texto,
          prioridade: dados.prioridade,
          cidade:     dados.cidade,
          coluna:     dados.coluna,
        }
      );
      setTarefas(tarefasAtuais => tarefasAtuais.map(t => t.id === dados.id ? tarefaEditada : t));

      } else {
      const { data: novaTarefa } = await axios.post(URL_API, dados);
      setTarefas(tarefasAtuais => [...tarefasAtuais, novaTarefa]);
    }
  } catch (e) {
    setErro('Erro ao salvar tarefa. Tente novamente.');
    console.error(e);
  }
}

async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;

  try {
    await axios.delete(URL_API + '/' + id);

    setTarefas(tarefasAtuais =>
      tarefasAtuais.filter(t => t.id !== id)
    );

  } catch (e) {
    setErro('Erro ao deletar tarefa. Tente novamente.');
    console.error(e);
  }
}

  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

async function moverTarefa (id, novaColuna) {
  try {
    const { data: tarefaMovida } = await axios.put(URL_API + '/' + id, { coluna: novaColuna });

    setTarefas(tarefasAtuais =>
      tarefasAtuais.map(t =>
        t.id === id ? tarefaMovida : t
      )
    );

  } catch (e) {
    setErro('Erro ao mover tarefa. Tente novamente.');
    console.error(e);
  }
}

  return (
    <>
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        {carregando && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <OrbitProgress color="#0098ff" size="medium" text="" textColor="" />
          </div>)}
        {erro && (<p style={{ textAlign:'center', color:'#EF4444' }}>{erro}</p>)}
        {!carregando && !erro && (
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
        )}
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