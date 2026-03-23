import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useHR } from './context/HRContext';
import NotificationCenter from './components/NotificationCenter';
import FloatingAIBtn from './components/FloatingAIBtn';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all italic ${
        isActive 
          ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl' 
          : 'text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
      }`
    }
  >
    <div className="shrink-0">{icon}</div>
    <span>{label}</span>
  </NavLink>
);

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-6 mt-10 mb-4 text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] italic border-b border-slate-50 dark:border-slate-800 pb-2">
    {label}
  </div>
);

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticatedUser, logout } = useHR();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('nexus_theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    localStorage.setItem('nexus_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (isLoginPage) return <div className={isDark ? 'dark' : ''}>{children}</div>;

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`flex h-screen bg-transparent font-['Inter'] transition-colors duration-500 overflow-hidden ${isDark ? 'dark text-white' : 'text-slate-900'}`}>
      {/* Overlay para fechar sidebar no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Corporativo Premium */}
      <aside className={`
        fixed inset-y-0 left-0 lg:static lg:translate-x-0 z-50
        w-72 border-r border-slate-100 dark:border-slate-800/50 flex flex-col 
        bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl overflow-hidden shadow-2xl 
        transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-slate-50/50 dark:border-slate-800/50 bg-transparent">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter flex items-center gap-4 italic group cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 shadow-lg shadow-blue-600/20 transition-all duration-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="tracking-[0.2em] uppercase">Nexus</span>
            </h1>
            <button onClick={() => setIsDark(!isDark)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto no-scrollbar">
          <SidebarLink to="/dashboard" label="Métricas Centrais" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
          
          <SectionHeader label="Inteligência & Core" />
          <SidebarLink to="/nexus-ai" label="Centro Nexus AI" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <SidebarLink to="/org-chart" label="Arquitetura Humana" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 014.438-4.321M12 7a3 3 0 110-6 3 3 0 010 6zm7 2a3 3 0 110-6 3 3 0 010 6zm-14 0a3 3 0 110-6 3 3 0 010 6z" /></svg>} />
          <SidebarLink to="/employees" label="Diretório Neural" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
          
          <SectionHeader label="Ciclos Operacionais" />
          <SidebarLink to="/payroll" label="Fluxo Financeiro" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SidebarLink to="/time-tracking" label="Controle de Ponto" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
          <SidebarLink to="/vacation" label="Gestão de Férias" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <SidebarLink to="/performance" label="Audit de Performance" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
          <SidebarLink to="/recruitment" label="Filtro de Talentos" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
          <SidebarLink to="/safety" label="Saúde & Compliance" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
          <SidebarLink to="/lifecycle" label="Lifecycle Manager" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} />
          
          <SectionHeader label="Pessoas & Cultura" />
          <SidebarLink to="/communication" label="Central de Comunicação" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>} />
          <SidebarLink to="/hr-insights" label="Insights de RH + IA" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} />
          <SidebarLink to="/hr-assistant" label="Assistente IA" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          <SidebarLink to="/org-climate" label="Clima Organizacional" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>} />
          <SidebarLink to="/academy" label="Academia Corporativa" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} />
          <SidebarLink to="/recognition" label="Reconhecimentos" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
          <SidebarLink to="/competency-matrix" label="Matriz Competências" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
          <SidebarLink to="/people-analytics" label="People Analytics" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <SidebarLink to="/automations" label="Automações IA" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
          
          <SectionHeader label="Utilidades Master" />

          <SidebarLink to="/reports" label="Extração de Reports" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
          <SidebarLink to="/audit-log" label="Audit Gateway" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
          <SidebarLink to="/settings" label="Parametrização" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        </nav>

        <div className="p-8 border-t border-slate-50/50 dark:border-slate-800/50 bg-transparent">
          <div className="flex items-center gap-4 px-4 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100/50 dark:border-slate-800/50 mb-6 group cursor-pointer hover:border-blue-600/30 dark:hover:border-blue-500/30 transition-all shadow-sm" onClick={() => navigate('/my-space')}>
             <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white text-xs font-bold italic shrink-0 group-hover:scale-110 shadow-lg shadow-blue-600/20 transition-all duration-300">
                {authenticatedUser?.name[0]}
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-900 dark:text-white truncate uppercase italic tracking-tighter leading-none mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{authenticatedUser?.name}</p>
                <p className="text-[8px] font-bold text-blue-500 truncate uppercase tracking-widest">{authenticatedUser?.userRole}</p>
             </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] hover:text-red-600 transition-all italic"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Finalizar Sessão
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent transition-colors duration-500 relative z-0">
        <header className="h-16 md:h-20 border-b border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between px-4 md:px-10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl z-20 shadow-sm">
          <div className="flex items-center gap-3 md:gap-6">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 lg:hidden text-slate-500 hover:text-blue-600 transition-colors"
                aria-label="Abrir Menu"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
             </button>
             <div className="hidden md:block w-1 h-8 bg-blue-600 dark:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
             <h2 className="text-[10px] md:text-xs font-bold text-slate-950 dark:text-white uppercase tracking-[0.2em] md:tracking-[0.4rem] leading-none italic truncate">
                {location.pathname.replace('/', '').replace(/-/g, ' ') || 'Dashboard'}
             </h2>
          </div>
          <div className="flex items-center gap-8 relative z-50">
             <NotificationCenter />
             <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-950 dark:text-white uppercase tracking-widest leading-none mb-1">{new Date().toLocaleDateString('pt-BR')}</span>
                <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Nexus Titanium v4.0</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 animate-fadeIn bg-transparent transition-colors duration-500">
          <div className="max-w-[1500px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      <FloatingAIBtn />
    </div>
  );
};

export default App;
