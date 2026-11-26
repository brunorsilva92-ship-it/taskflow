import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Kanban from './kanban';
import { AuthProvider } from '../contexts/AuthContext';
import api from '../api';

vi.mock('../api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  mensagensDeErro: vi.fn(() => ['erro']),
}));

const respostas = {
  '/prioridades': [
    { id: 1, descricao: 'Alto' },
    { id: 2, descricao: 'Médio' },
  ],
  '/tarefas': [
    {
      id: 1,
      texto: 'Modelar o banco',
      coluna: 'afazer',
      prioridade: 'Alto',
      prioridade_cor: '#EF4444',
    },
    {
      id: 2,
      texto: 'Criar a API',
      coluna: 'andamento',
      prioridade: 'Médio',
      prioridade_cor: '#F59E0B',
    },
  ],
  '/usuarios': [{ id: 1, nome: 'Ana Lima' }],
  '/projetos': [{ id: 10, nome: 'TaskFlow' }],
};

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation(url => {
    return Promise.resolve({ data: respostas[url] });
  });
});

function desenharKanban() {
  render(
    <AuthProvider>
      <Kanban />
    </AuthProvider>
  );
}

describe('Kanban', () => {
  test('mostra Carregando enquanto a API não responde', () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    desenharKanban();

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  test('Depois da resposta, as tarefas aparecem', async () => {
    desenharKanban();

    expect(await screen.findByText('Modelar o banco')).toBeInTheDocument();
    expect(screen.getByText('Criar a API')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith('/tarefas');
  });

  test('se a API falha, mostra a mensagem de erro', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValue(new Error('Network Error'));
    desenharKanban();

    expect(
      await screen.findByText('Erro ao carregar dados do Kanban. Verifique a conexão.')
    ).toBeInTheDocument();
  });

  test('criar: o + abre o modal e a tarefa aparece', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({
      data: {
        id: 3,
        texto: 'Testar o Kanban',
        coluna: 'afazer',
        prioridade: 'Médio',
        prioridade_cor: '#F59E0B',
      },
    });
    desenharKanban();

    await user.click(await screen.findByTitle('Nova tarefa em A Fazer'));
    await user.type(screen.getByLabelText('Tarefa'), 'Testar o Kanban');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(api.post).toHaveBeenCalledWith(
      '/tarefas',
      expect.objectContaining({
        texto: 'Testar o Kanban',
        coluna: 'afazer',
      })
    );
    expect(await screen.findByText('Testar o Kanban')).toBeInTheDocument();
  });

  test('clicar no X da primeira tarefa chama api.delete com /tarefas/1 e a tarefa some', async () => {
    const user = userEvent.setup();
    api.delete.mockResolvedValue({});
    desenharKanban();

    await screen.findByText('Modelar o banco');
    const botoesDeletar = screen.getAllByRole('button', { name: 'X' });
    await user.click(botoesDeletar[0]);

    expect(api.delete).toHaveBeenCalledWith('/tarefas/1');
    expect(screen.queryByText('Modelar o banco')).not.toBeInTheDocument();
  });
});