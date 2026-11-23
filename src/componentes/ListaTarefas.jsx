import TarefaItem from './TarefaItem';

function ListaTarefas({
  tarefas,
  prioridades = [],
  onDeletar,
  onEditar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  return (
    <section id="lista-section">
      {tarefas.length === 0 && (
        <p className="msg-vazia">
          Nenhuma tarefa aqui ainda.
        </p>
      )}

      {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map(tarefa => {
            const prioridadeId = tarefa.prioridadeId || tarefa.prioridade_id;
            const prioridadeObj = prioridades.find(p => p.id === Number(prioridadeId));

            return (
              <TarefaItem
                key={tarefa.id}
                texto={tarefa.texto}
                concluida={tarefa.concluida}
                corPrioridade={prioridadeObj?.cor || '#94a3b8'}
                rotuloPrioridade={prioridadeObj?.descricao || 'Média'}
                onDeletar={() => onDeletar(tarefa.id)}
                onEditar={() => onEditar(tarefa)}
                onMover={onMover ? (novaColuna) => onMover(tarefa.id, novaColuna) : null}
                colunaAnterior={colunaAnterior}
                colunaProxima={colunaProxima}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;