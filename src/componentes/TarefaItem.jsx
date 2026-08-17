// ─────────────────────────────────────────────────────────────────────────────
// TarefaItem.jsx — MODIFICADO (Semana 5, Dia 2)
//
// MUDANÇAS em relação à versão anterior:
//   • 3 props opcionais adicionadas para o modo Kanban:
//       - onMover        → função que recebe a nova coluna e chama o App
//       - colunaAnterior → string da coluna anterior (null = primeira coluna)
//       - colunaProxima  → string da próxima coluna  (null = última coluna)
//   • .acoes adicionado para agrupar os botões de ação
//
// REUSO: quando as props de Kanban NÃO são passadas (modo lista normal),
// o componente se comporta exatamente como antes.
// Um único componente, dois contextos de uso — isso é componentização.
//
// FLUXO DAS PROPS:
//   App.jsx → ListaTarefas → TarefaItem
//   onMover chega já com o tarefa.id injetado pelo ListaTarefas,
//   por isso o TarefaItem só precisa passar a novaColuna.
// ─────────────────────────────────────────────────────────────────────────────

import styles from "./TarefaItem.module.css";

function TarefaItem({
  // Props existentes — sem alteração
  texto,
  concluida = false,
  prioridade = "media",
  cidade = "",
  onDeletar,
  onEditar = null,

  // Props novas — opcionais, com valor padrão null
  // Recebidas via ListaTarefas, que injeta o tarefa.id no onMover
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  // ── Classes CSS — sem alteração ──────────────────────────────────────────
  const classeItem =
    (concluida ? styles.tarefa + " " + styles.concluida : styles.tarefa) +
    " " +
    styles[prioridade];

  const classeTexto = concluida
    ? styles.textoTarefa + " " + styles["texto-tarefa"]
    : styles.textoTarefa;

  const classePrioridade =
    styles["badge-prioridade"] + " " + styles["badge-" + prioridade];

  // ── Modo Kanban: detectado pela presença da prop onMover ─────────────────
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
        {cidade && <span className={styles.cidade}>{cidade}</span>}
      </div>

      <span className={classePrioridade}>{prioridade}</span>

      {/*
        ── Container de ações ────────────────────────────────────────────────
        Modo lista:  só o botão X aparece
        Modo Kanban: botões ← → e X aparecem juntos
      */}
      <div className={styles.acoes}>
        {/* Botão ← só aparece no modo Kanban E se há coluna anterior */}
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {/* Botão → só aparece no modo Kanban E se há próxima coluna */}
        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        {/* Botão X — deletar — presente nos dois modos */}
        <button className={styles.btnDeletar} onClick={onDeletar}>
          X
        </button>
      </div>
    </li>
  );
}

export default TarefaItem;
