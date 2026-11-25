import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      prioridadeId: 1,
      usuario_id: 2,
      projeto_id: 20,
    };

    abrirModal({ tarefa });

    expect(screen.getByRole('heading', { name: 'Editar tarefa' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tarefa')).toHaveValue('Revisar a API');
    expect(screen.getByLabelText('Responsável')).toHaveValue('2');
  });

  test('o que a pessoa digita aparece no campo', async () => {
    const user = userEvent.setup();
    abrirModal();

    const campo = screen.getByLabelText('Tarefa');
    await user.type(campo, 'Nova tarefa de teste');
    expect(campo).toHaveValue('Nova tarefa de teste');
  });

  test('Cancelar e Esc chamam onFechar', async () => {
    const user = userEvent.setup();
    const onFechar = vi.fn();
    abrirModal({ onFechar });

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.keyboard('{Escape}');

    expect(onFechar).toHaveBeenCalledTimes(2);
  });

  test('Salvar envia os dados e fecha o modal', async () => {
    const user = userEvent.setup();
    const onSalvar = vi.fn().mockResolvedValue();
    const onFechar = vi.fn();
    abrirModal({ onSalvar, onFechar, coluna: 'afazer' });

    await user.type(screen.getByLabelText('Tarefa'), 'Nova tarefa de teste');
    await user.selectOptions(screen.getByLabelText('Prioridade'), 'Alto');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onSalvar).toHaveBeenCalledWith({
      texto: 'Nova tarefa de teste',
      coluna: 'afazer',
      prioridadeId: 1,
      usuarioId: 1,
      projetoId: 10,
    });
    expect(onFechar).toHaveBeenCalledTimes(1);
  });
});