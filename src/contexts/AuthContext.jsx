import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const logado = !!token;

  function login(dadosUsuario, tokenRecebido) {
    setUsuario(dadosUsuario);
    setToken(tokenRecebido);
    localStorage.setItem('token', tokenRecebido);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  }

  function logout() {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  return (
    <AuthContext.Provider value={{ token, usuario, logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}