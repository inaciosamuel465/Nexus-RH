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
        setError('Acesso negado: Credenciais inválidas.');
      }
    } catch (err) {
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter'] bg-white">
      {/* Coluna de Imagem Estilizada */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden border-r border-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          alt="Corporativo"
        />
        <div className="relative z-10 flex flex-col justify-end p-20 text-white">
          <div className="w-16 h-1 bg-blue-600 mb-10"></div>
          <h1 className="text-5xl font-bold tracking-tighter italic uppercase mb-4">Nexus Core</h1>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed italic">
            Sincronização estratégica de capital humano e inteligência corporativa de alta performance.
          </p>
        </div>
      </div>

      {/* Coluna do Formulário Minimalista */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-sm space-y-12 animate-fadeIn">
          <div>
            <div className="lg:hidden mb-12">
              <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tighter italic uppercase">Nexus</h1>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase italic">Autenticação</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] italic">Inicie sessão no ecosistema Nexus RH.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 italic">Vínculo Eletrônico</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-slate-200 py-3 bg-transparent text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors placeholder:text-slate-200"
                placeholder="nome@nexus.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 italic">Código de Acesso</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-slate-200 py-3 bg-transparent text-slate-900 font-bold outline-none focus:border-blue-600 transition-colors placeholder:text-slate-200"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[9px] font-bold text-red-600 animate-fadeIn uppercase tracking-widest italic">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.5rem] shadow-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 italic"
            >
              {loading ? 'Validando...' : 'Sincronizar'}
            </button>
          </form>

          <footer className="pt-10 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Nexus Management Suite v2.5</p>
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 bg-slate-100"></div>
               <div className="w-1.5 h-1.5 bg-slate-100"></div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
