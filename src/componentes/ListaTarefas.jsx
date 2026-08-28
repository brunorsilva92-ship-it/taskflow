// ─────────────────────────────────────────────────────────────────────────────
// ListaTarefas.jsx — MODIFICADO (Semana 5, Dia 2)
//
// MUDANÇAS em relação à versão anterior:
//   • 3 props opcionais adicionadas para o modo Kanban:
//       - onMover        → função que move a tarefa entre colunas
//       - colunaAnterior → passada diretamente para o TarefaItem
//       - colunaProxima  → passada diretamente para o TarefaItem
//
// REUSO: quando as props de Kanban NÃO são passadas (modo lista normal),
// o componente se comporta exatamente como antes — nenhuma linha do
// comportamento original foi alterada.
//
// O ListaTarefas continua sendo o único lugar que sabe como renderizar
// uma lista de TarefaItem — o App.jsx não precisa mais fazer isso diretamente.
// ─────────────────────────────────────────────────────────────────────────────

import TarefaItem from './TarefaItem';

function ListaTarefas({
  tarefas,
  onDeletar,
  onEditar,

  // Props novas — opcionais, com valor padrão null
  // Só são passadas quando usado dentro de uma coluna do quadro Kanban
  onMover          = null,
  colunaAnterior   = null,
  colunaProxima    = null,
}) {
  return (
    <section id="lista-section">

      {/* Mensagem quando não há tarefas — sem alteração */}
      {tarefas.length === 0 && (
        <p className="msg-vazia">
          Nenhuma tarefa aqui ainda.
        </p>
      )}

      {/* Lista renderizada dinamicamente — sem alteração na estrutura */}
      {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map(tarefa => (
            <TarefaItem
              key={tarefa.id}
              texto={tarefa.texto}
              cidade={tarefa.cidade}
              concluida={tarefa.concluida}
              prioridade={tarefa.prioridade}
              onDeletar={() => onDeletar(tarefa.id)}
              onEditar={() => onEditar(tarefa)}


              onMover={onMover ? (novaColuna) => onMover(tarefa.id, novaColuna) : null}
              colunaAnterior={colunaAnterior}
              colunaProxima={colunaProxima}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;