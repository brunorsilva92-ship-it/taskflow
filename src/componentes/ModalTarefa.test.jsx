import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ModalTarefa from './ModalTarefa';
import { AuthProvider } from '../contexts/AuthContext';

const prioridades = [
  { id: 1, descricao: 'Alto' },
  { id: 2, descricao: 'Médio' },
  { id: 3, descricao: 'Baixo' },
];

const usuarios = [
  { id: 1, nome: 'Ana Lima' },
  { id: 2, nome: 'Bruno Melo' },
];

const projetos = [
  { id: 10, nome: 'Projeto A' },
  { id: 20, nome: 'Projeto B' },
];

function abrirModal(props = {}) {
  render(
    <AuthProvider>
      <ModalTarefa
        aberto={true}
        onFechar={vi.fn()}
        onSalvar={vi.fn()}
        prioridades={prioridades}
        usuarios={usuarios}
        projetos={projetos}
        {...props}
      />
    </AuthProvider>
  );
}

describe('ModalTarefa', () => {
  test('fechado, não mostra nada', () => {
    abrirModal({ aberto: false });

    expect(screen.queryByText('Nova tarefa')).not.toBeInTheDocument();
  });

  test('aberto para criar, mostra o título e os campos', () => {
    abrirModal();

    expect(screen.getByRole('heading', { name: 'Nova tarefa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('');
    expect(screen.getByLabelText('Responsável')).toHaveValue('1');
    expect(screen.getByLabelText('Projeto')).toHaveValue('10');
    expect(screen.getByLabelText('Prioridade')).toHaveValue('2');
  });

  test('aberto para editar, vem preenchido', () => {
    const tarefa = {
      id: 7,
      texto: 'Revisar a API',
      coluna: 'andamento',
      idprioridade: 1,
      usuario_id: 2,
      projeto_id: 20,
    };

    abrirModal({ tarefa });

    expect(screen.getByRole('heading', { name: 'Editar tarefa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('Revisar a API');
    expect(screen.getByLabelText('Responsável')).toHaveValue('2');
  });
});