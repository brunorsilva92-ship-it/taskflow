import { useState, useEffect } from 'react';
import styles from './ModalTarefa.module.css';
import axios from 'axios';

function ModalTarefa({ aberto, onFechar, onSalvar, tarefa = null, coluna = 'afazer' }) {
  const [texto, setTexto] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [prioridade, setPrioridade] = useState('media');

  useEffect(() => {
    if (tarefa) {
      setTexto(tarefa.texto || tarefa.titulo || '');
      setCep(tarefa.cep || '');
      setCidade(tarefa.cidade || '');
      setPrioridade(tarefa.prioridade || 'media');
    } else {
      setTexto('');
      setCep('');
      setCidade('');
      setPrioridade('media');
    }
  }, [tarefa, aberto]);


  useEffect(() => {
    if (!aberto) return;

    function handleEsc(e) {
      if (e.key === 'Escape') onFechar();
    }

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [aberto, onFechar]);

  // 3. Consulta ViaCEP refinada
  async function consultarCidade(cepDigitado) {
    const cepLimpo = cepDigitado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    try {
      const { data } = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (!data.erro) {
        setCidade(`${data.localidade}/${data.uf}`);
      }
    } catch (e) {
      console.error('Erro ao buscar CEP:', e);
    }
  }

  function handleSalvar() {
    if (texto.trim() === '') return;

    onSalvar({
      id: tarefa?.id,
      texto,
      cep,
      cidade,
      prioridade,
      coluna: tarefa?.coluna || coluna,
    });

    onFechar();
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <h2>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        <input 
          placeholder='Texto da tarefa' 
          value={texto}
          onChange={e => setTexto(e.target.value)} 
          autoFocus
        />

        <input 
          placeholder='CEP (opcional)' 
          value={cep}
          onChange={e => { 
            const valor = e.target.value;
            setCep(valor); 
            consultarCidade(valor); 
          }} 
          maxLength={9}
        />

        {cidade && <p className={styles.cidade}>{cidade}</p>}

        <select value={prioridade} onChange={e => setPrioridade(e.target.value)}>
          <option value='alta'>Alta</option>
          <option value='media'>Média</option>
          <option value='baixa'>Baixa</option>
        </select>

        <div className={styles.botoes}>
          <button type="button" onClick={onFechar}>Cancelar</button>
          <button type="button" onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;