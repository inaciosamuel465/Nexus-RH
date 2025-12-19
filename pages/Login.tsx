
import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useHR();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-sm relative z-10 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter mb-1">
              NEXUS HR
            </h1>
            <p className="text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-widest">Portal Integrado</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase px-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:border-blue-400 outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-500 uppercase px-1">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:border-indigo-400 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-[10px] font-black uppercase text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all"
            >
              {loading ? 'Validando...' : 'Acessar Sistema'}
            </button>
          </form>
          
          <footer className="mt-8 text-center">
             <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">© 2024 Nexus Technology Group</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
