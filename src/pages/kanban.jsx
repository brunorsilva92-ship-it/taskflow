import { useState, useEffect } from "react";
import api from "../api";
import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas";
import ModalTarefa from "../componentes/ModalTarefa";
import { OrbitProgress } from "react-loading-indicators";
import { useAuth } from '../contexts/AuthContext';

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const { usuario } = useAuth();

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro('');

        const [respPrioridades, respTarefas, respUsuarios, respProjetos] =
          await Promise.all([
            api.get("/prioridades"),
            api.get("/tarefas"),
            api.get("/usuarios"),
            api.get("/projetos"),
          ]);

        const tarefasComEstado = respTarefas.data.map(t => ({
          ...t,
          concluida: t.coluna === 'concluido',
        }));

        setListaPrioridades(respPrioridades.data);
        setTarefas(tarefasComEstado);
        setListaUsuarios(respUsuarios.data);
        setListaProjetos(respProjetos.data);

      } catch (e) {
        setErro('Erro ao carregar dados do Kanban. Verifique a conexão.');
        console.error('Erro no carregamento:', e);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
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
  if (dados.id) {
    const resposta = await api.put(`/tarefas/${dados.id}`, dados);
    setTarefas(tarefas.map(t => (t.id === dados.id ? resposta.data : t)));
  } else {
    const resposta = await api.post('/tarefas', dados);
    setTarefas([...tarefas, resposta.data]);
  }
}

async function deletarTarefa(id) {
  try {
    await api.delete(`/tarefas/${id}`);

    setTarefas(
      tarefas.filter(t => t.id !== id)
    );

  } catch (e) {
    setErro(e.response?.data?.erro || 'Erro ao deletar tarefa. Tente novamente.');
    console.error(e);
  }
}

async function moverTarefa(id, novaColuna) {
  try {
    const tarefaAtual = tarefas.find(t => t.id === id);
    if (!tarefaAtual) return;

    const resposta = await api.put(`/tarefas/${id}`, {
      ...tarefaAtual,
      coluna: novaColuna,
      usuarioId: usuario.id,
    });

    const tarefaAtualizada = { ...resposta.data, concluida: novaColuna === 'concluido' };
    setTarefas(tarefasAtuais =>
      tarefasAtuais.map(t => (t.id === id ? tarefaAtualizada : t))
    );

  } catch (e) {
    setErro(e.response?.data?.erro || 'Erro ao mover tarefa. Tente novamente.');
    console.error(e);
  }
}

async function alternarConcluida(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const novaColuna = tarefa.coluna === 'concluido' ? 'andamento' : 'concluido';
  await moverTarefa(id, novaColuna);
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
              prioridades={listaPrioridades}
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
              prioridades={listaPrioridades}
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
              prioridades={listaPrioridades}
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
        prioridades={listaPrioridades}
        usuarios={listaUsuarios}
        projetos={listaProjetos}
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