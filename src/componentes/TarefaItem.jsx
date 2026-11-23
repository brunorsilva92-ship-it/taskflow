import styles from "./TarefaItem.module.css";

function TarefaItem({
  texto,
  concluida = false,
  corPrioridade = "#94a3b8",
  rotuloPrioridade = "",
  onDeletar,
  onEditar = null,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  const classeItem = concluida
    ? `${styles.tarefa} ${styles.concluida}`
    : styles.tarefa;

  const classeTexto = concluida
    ? `${styles.textoTarefa} ${styles["texto-tarefa"]}`
    : styles.textoTarefa;

  const modoKanban = onMover !== null;

  return (
    <li className={classeItem}>
      <div className={styles.conteudo}>
        <span 
          className={classeTexto} 
          onDoubleClick={onEditar}
          title="Clique duas vezes para editar"
          style={{ cursor: 'pointer' }}
        >
          {texto}
        </span>
      </div>

      <span 
        className={styles["badge-prioridade"]}
        style={{ backgroundColor: corPrioridade }}
      >
        {rotuloPrioridade || "Média"}
      </span>

      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        <button className={styles.btnDeletar} onClick={onDeletar}>
          X
        </button>
      </div>
    </li>
  );
}

export default TarefaItem;