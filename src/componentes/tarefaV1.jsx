// import "./App.css";
// import Saudacao from './Saudacao'
import Header from "./Header";
import ListaTarefas from "./ListaTarefas";
import Contador from "./Contador";
import { useState, useEffect } from "react";

function TarefasV1() {
  const [proximaId, setProximaId] = useState(1);
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (!tarefasSalvas) {
      return [];
    }
    const tarefasConvertidas = JSON.parse(tarefasSalvas);
    setProximaId(
      tarefasConvertidas.length > 0
        ? tarefasConvertidas[tarefasConvertidas.length - 1].id + 1
        : 1,
    );
    return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  });

  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");

  // Armazena somente o filtro selecionado
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (texto.trim() === "") {
      // alert("O campo de tarefa não pode estar vazio!");
      return;
    }
    const novaTarefa = {
      id: proximaId,
      texto: texto,
      concluida: false,
      prioridade: prioridade,
    };
    setTarefas([...tarefas, novaTarefa]);
    setProximaId(proximaId + 1);
    setTexto(""); // Limpa o campo de input após adicionar a tarefa
    setPrioridade("media"); // Reseta a prioridade para o valor padrão

    // const pendentes = tarefas.filter((t) => !t.concluida).length;
    // if (pendentes > 0) {
    //   document.title = "(" + pendentes + ") TaskFlow";
    // } else {
    //   document.title = "TaskFlow";
    // }
  };

  const deletarTarefa = (id) => {
    const tarefasAtualizadas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(tarefasAtualizadas);
  };

  const alternarConcluida = (id) => {
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return { ...tarefa, concluida: !tarefa.concluida };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
  };

  const filtrarTarefas = (novoFiltro) => {
    setFiltro(novoFiltro);
  };

  // A lista filtrada é calculada com base nas tarefas originais
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "pendentes") {
      return !tarefa.concluida;
    }

    if (filtro === "concluidas") {
      return tarefa.concluida;
    }

    return true;
  });

  return (
    <>
      <Contador />
      <Header
        titulo="TaskFlow - Teste"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />
      <main className="container">
        {/* Formulário de adicionar tarefa */}
        <section id="formulario">
          <div className="campo-linha">
            <input
              id="input-tarefa"
              type="text"
              placeholder="Nova tarefa..."
              required
              autoComplete="off"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <select
              id="sel-prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>

            <button id="btn-adicionar" type="button" onClick={adicionarTarefa}>
              Adicionar
            </button>
          </div>
        </section>

        {/* Filtros */}
        <section id="controles">
          <div id="filtros">
            <button
              className={filtro === "todas" ? "btn-filtro ativo" : "btn-filtro"}
              data-filtro="todas"
              onClick={() => filtrarTarefas("todas")}
            >
              Todas
            </button>
            <button
              className={
                filtro === "pendentes" ? "btn-filtro ativo" : "btn-filtro"
              }
              data-filtro="pendentes"
              onClick={() => filtrarTarefas("pendentes")}
            >
              Pendentes
            </button>
            <button
              className={
                filtro === "concluidas" ? "btn-filtro ativo" : "btn-filtro"
              }
              data-filtro="concluidas"
              onClick={() => filtrarTarefas("concluidas")}
            >
              Concluídas
            </button>
          </div>
        </section>
        {/* Lista de tarefas */}
        <ListaTarefas
          tarefas={tarefasFiltradas}
          onDeletar={deletarTarefa}
          onConcluir={alternarConcluida}
        />
      </main>
      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default TarefasV1;
