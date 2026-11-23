import styles from './TarefaItem.module.css';

function TarefaItem({ texto, concluida = false, prioridade = 'media', onDeletar, onConcluir }) {
  // Classe do li muda conforme o estado concluida
   const classeItem = (concluida ? styles.tarefa + ' ' + styles.concluida : styles.tarefa) + ' ' + styles[prioridade];
  
  // Classe do texto tambem muda
  const classeTexto = concluida ? styles.textoTarefa + ' ' + styles['texto-tarefa'] : styles.textoTarefa;

  // Classe da badge de prioridade muda conforme a prioridade
  const classePrioridade = styles['badge-prioridade'] + ' ' + styles['badge-' + prioridade];

  return (
    // <li className={classeItem} onClick={onConcluir}>
    // <span className={classeTexto}>{texto}</span>
    <li className={classeItem}>     
      <span className={classeTexto} onDoubleClick={onConcluir}>{texto}</span>
      <span className={classePrioridade}>{prioridade}</span>
      <button className={styles.btnDeletar} onClick={onDeletar}>
        X
      </button>

      {/* <button className={styles.btnDeletar} onClick={e => { e.stopPropagation(); onDeletar(); }}>
        X
      </button> */}


    </li>
  );
}

export default TarefaItem;
