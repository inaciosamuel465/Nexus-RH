
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ICONS } from './constants';
import { HRProvider, useHR } from './context/HRContext';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Recruitment from './pages/Recruitment';
import TimeTracking from './pages/TimeTracking';
import Payroll from './pages/Payroll';
import AIServices from './pages/AIServices';
import OrgChart from './pages/OrgChart';
import Training from './pages/Training';
import Performance from './pages/Performance';
import Vacation from './pages/Vacation';
import Benefits from './pages/Benefits';
import Lifecycle from './pages/Lifecycle';
import Safety from './pages/Safety';
import MySpace from './pages/MySpace';
import Login from './pages/Login';

const SidebarItem: React.FC<{ to: string; label: string; icon: React.ReactNode; onClick?: () => void }> = ({ to, label, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname === '/' && to === '/dashboard');

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      }`}
    >
      <span className={isActive ? 'text-white' : 'text-gray-500'}>{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticatedUser, logout } = useHR();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdmin = authenticatedUser?.userRole === 'ADMIN';

  // Fecha sidebar ao mudar de rota no mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  if (!authenticatedUser) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-gray-950 text-white p-4 flex items-center justify-between sticky top-0 z-[60] border-b border-gray-800">
        <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic tracking-tighter">
          NEXUS HR
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-gray-900 rounded-lg text-blue-400"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          )}
        </button>
      </div>

      {/* Sidebar / Drawer */}
      <aside className={`
        w-64 bg-gray-950 text-white flex flex-col fixed h-full shadow-2xl z-50 border-r border-gray-800 no-print transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter">
            NEXUS HR
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Governança</p>
          <SidebarItem to="/dashboard" label="Dashboard" icon={<ICONS.Dashboard />} />
          <SidebarItem to="/employees" label="Colaboradores" icon={<ICONS.Employees />} />
          <SidebarItem to="/org-chart" label="Organograma" icon={<ICONS.OrgChart />} />
          
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2">Operacional</p>
          <SidebarItem to="/lifecycle" label="Lifecycle" icon={<ICONS.Lifecycle />} />
          <SidebarItem to="/recruitment" label="Recrutamento" icon={<ICONS.Recruitment />} />
          <SidebarItem to="/time" label="Ponto" icon={<ICONS.Time />} />
          <SidebarItem to="/vacation" label="Férias" icon={<ICONS.Vacation />} />
          <SidebarItem to="/benefits" label="Benefícios" icon={<ICONS.Benefits />} />
          <SidebarItem to="/payroll" label="Folha de Pagto" icon={<ICONS.Payroll />} />
          
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2">Estratégia</p>
          <SidebarItem to="/training" label="T&D" icon={<ICONS.Training />} />
          <SidebarItem to="/performance" label="Desempenho" icon={<ICONS.Performance />} />
          <SidebarItem to="/safety" label="Saúde e Segurança" icon={<ICONS.Safety />} />
          <SidebarItem to="/ai-insights" label="Nexus AI" icon={<ICONS.AI />} />

          {!isAdmin && (
            <>
              <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2">Autoatendimento</p>
              <SidebarItem to="/my-space" label="Meu Espaço" icon={<ICONS.SelfService />} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-900 bg-black/20">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs">
                {authenticatedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate max-w-[100px]">{authenticatedUser.name.split(' ')[0]}</p>
                <p className="text-[9px] text-indigo-400 uppercase font-black">{authenticatedUser.userRole}</p>
              </div>
            </div>
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Backdrop Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authenticatedUser } = useHR();
  if (!authenticatedUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HRProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
            <Route path="/org-chart" element={<ProtectedRoute><OrgChart /></ProtectedRoute>} />
            <Route path="/lifecycle" element={<ProtectedRoute><Lifecycle /></ProtectedRoute>} />
            <Route path="/recruitment" element={<ProtectedRoute><Recruitment /></ProtectedRoute>} />
            <Route path="/time" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
            <Route path="/vacation" element={<ProtectedRoute><Vacation /></ProtectedRoute>} />
            <Route path="/benefits" element={<ProtectedRoute><Benefits /></ProtectedRoute>} />
            <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
            <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AIServices /></ProtectedRoute>} />
            <Route path="/my-space" element={<ProtectedRoute><MySpace /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </HRProvider>
  );
};

export default App;
