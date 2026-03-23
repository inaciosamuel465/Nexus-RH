import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHR } from '../context/HRContext';
import { Employee, Dependent, HistoryEntry } from '../types';

const EditModal: React.FC<{ isOpen: boolean; onClose: () => void; employee: Employee; onSave: (id: string, data: any) => void }> = ({ isOpen, onClose, employee, onSave }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Employee>({ ...employee });
  const { employees } = useHR();

  if (!isOpen) return null;

  const handleAddDependent = () => {
    const newDep: Dependent = { name: '', type: 'Filho(a)', dob: '' };
    setFormData({ ...formData, dependents: [...(formData.dependents || []), newDep] });
  };

  const handleRemoveDependent = (index: number) => {
    const deps = [...formData.dependents];
    deps.splice(index, 1);
    setFormData({ ...formData, dependents: deps });
  };

  const handleUpdateDependent = (index: number, field: keyof Dependent, value: string) => {
    const deps = [...formData.dependents];
    deps[index] = { ...deps[index], [field]: value };
    setFormData({ ...formData, dependents: deps });
  };

  const handleAddHistory = () => {
    const newEntry: HistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      event: 'Alteração Manual',
      role: formData.role,
      salary: formData.salary
    };
    setFormData({ ...formData, history: [...(formData.history || []), newEntry] });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Gestão de Registro</h3>
             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Edição de Dados Estratégicos Ativa</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <div className="flex bg-slate-50 border-b border-slate-100 overflow-x-auto">
          {[
            { id: 'general', label: 'Contratual' },
            { id: 'personal', label: 'Pessoal' },
            { id: 'bank', label: 'Bancário' },
            { id: 'dependents', label: 'Dependentes' },
            { id: 'history', label: 'Histórico' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-slate-900 bg-white border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="p-8 space-y-8 overflow-y-auto custom-scrollbar" onSubmit={(e) => {
          e.preventDefault();
          onSave(employee.id, formData);
          onClose();
        }}>
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cargo</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Departamento</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Salário Base</label>
                  <input type="number" className="w-full border-b border-slate-200 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.salary} onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Gestor Direto</label>
                  <select className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.managerId || ''} onChange={e => setFormData({...formData, managerId: e.target.value || null})}>
                    <option value="">Nenhum</option>
                    {employees.filter(emp => emp.id !== formData.id).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">CPF</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.cpf || ''} placeholder="000.000.000-00" onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">RG</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.rg || ''} placeholder="00.000.000-0" onChange={e => setFormData({...formData, rg: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Data de Admissão</label>
                <input type="date" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Instituição Bancária</label>
                <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.bank.name} onChange={e => setFormData({...formData, bank: { ...formData.bank, name: e.target.value }})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Agência</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.bank.agency} onChange={e => setFormData({...formData, bank: { ...formData.bank, agency: e.target.value }})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Conta Corrente</label>
                  <input className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" value={formData.bank.account} onChange={e => setFormData({...formData, bank: { ...formData.bank, account: e.target.value }})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dependents' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100">
                <h4 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Nós Dependentes</h4>
                <button type="button" onClick={handleAddDependent} className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-all">+ Membro</button>
              </div>
              <div className="space-y-4">
                {formData.dependents.map((dep, idx) => (
                  <div key={idx} className="p-6 border border-slate-200 bg-white shadow-sm flex flex-wrap gap-4 items-end relative group">
                    <button type="button" onClick={() => handleRemoveDependent(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
                    </button>
                    <div className="flex-1 min-w-[150px] space-y-1.5">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome</label>
                      <input className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-600" value={dep.name} onChange={e => handleUpdateDependent(idx, 'name', e.target.value)} />
                    </div>
                    <div className="w-28 space-y-1.5">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Parentesco</label>
                      <select className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none" value={dep.type} onChange={e => handleUpdateDependent(idx, 'type', e.target.value)}>
                        <option>Filho(a)</option>
                        <option>Cônjuge</option>
                        <option>Pai/Mãe</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <div className="w-32 space-y-1.5">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nascimento</label>
                      <input type="date" className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-900 outline-none" value={dep.dob} onChange={e => handleUpdateDependent(idx, 'dob', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100">
                <h4 className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Timeline de Eventos</h4>
                <button type="button" onClick={handleAddHistory} className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-all">+ Log</button>
              </div>
              <div className="space-y-4">
                {formData.history.map((h, idx) => (
                  <div key={idx} className="p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <input className="w-full border-b border-slate-200 py-1.5 text-xs font-bold text-slate-900 outline-none" value={h.event} onChange={e => {
                         const history = [...formData.history];
                         history[idx].event = e.target.value;
                         setFormData({...formData, history});
                       }} />
                       <input type="date" className="w-full border-b border-slate-200 py-1.5 text-xs text-slate-400 outline-none" value={h.date} onChange={e => {
                         const history = [...formData.history];
                         history[idx].date = e.target.value;
                         setFormData({...formData, history});
                       }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-8 gap-4 flex sticky bottom-0 bg-white pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-all">Cancelar</button>
            <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Sincronizar Bio-Matriz</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, updateEmployee, removeEmployee } = useHR();
  const [activeTab, setActiveTab] = useState('contract');
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const employee = employees.find(e => e.id === id);

  if (!employee) return <div className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest italic animate-pulse">Unidade não identificada no Database.</div>;

  const handleUpdate = (empId: string, newData: any) => {
    updateEmployee(empId, newData);
  };

  const tabs = [
    { id: 'contract', label: 'Matriz Contratual' },
    { id: 'personal', label: 'Córtex Pessoal' },
    { id: 'bank', label: 'Protocolo Bancário' },
    { id: 'history', label: 'Linha do Tempo' },
    { id: 'documents', label: 'Repositório' },
  ];

  const manager = employees.find(e => e.id === employee.managerId);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Header Estilizado */}
      <header className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <button onClick={() => navigate('/employees')} className="p-3 bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        
        <div className="w-24 h-24 bg-slate-900 text-white flex items-center justify-center text-3xl font-bold border-4 border-slate-50 shadow-xl">
           {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-1 italic">ID: {employee.registration}</p>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight leading-none mb-2">{employee.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-4">{employee.role}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employee.department}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="px-8 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
          >
            Editar Registro
          </button>
          <button 
            onClick={() => { if(confirm('Efetivar Offboarding desta unidade?')) { removeEmployee(employee.id); navigate('/employees'); } }}
            className="p-3 text-slate-300 hover:text-red-500 transition-colors border border-slate-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-8">
           <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-50 pb-4 italic">Monitoria Ativa</p>
              <div className="space-y-6">
                 <div>
                    <label className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Status</label>
                    <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-tighter">{employee.status}</p>
                 </div>
                 <div>
                    <label className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Entidade de Comando</label>
                    <p className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-tighter">{manager?.name || 'Diretoria Geral'}</p>
                 </div>
                 <div>
                    <label className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Início Ciclo</label>
                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono">{new Date(employee.hireDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 p-8 text-white shadow-lg">
              <p className="text-[32px] font-bold tracking-tighter leading-none mb-1">R$ {employee.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic mt-2">Remuneração Base Mensal</p>
           </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <nav className="flex bg-slate-50 border-b border-slate-100">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-10 animate-fadeIn">
              {activeTab === 'contract' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 italic">Estrutura CLT</h4>
                      <div className="p-6 bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-slate-900 hover:text-white transition-all">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500">Tipo Contrato</span>
                         <span className="text-xs font-bold">Indeterminado</span>
                      </div>
                      <div className="p-6 bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-slate-900 hover:text-white transition-all">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500">Jornada</span>
                         <span className="text-xs font-bold">44h Semanais</span>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 italic">Sincronia eSocial</h4>
                      <div className="p-10 border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                         </div>
                         <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1">Status de Conformidade</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase italic">Dados Sincronizados em tempo real</p>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="space-y-10">
                   <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 italic">Informações Civis</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-slate-900 text-white flex flex-col justify-between min-h-[140px]">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Registry Key (CPF)</span>
                         <span className="text-2xl font-bold tracking-widest italic">{employee.cpf || '***.***.***-**'}</span>
                      </div>
                      <div className="p-8 border border-slate-200 flex flex-col justify-between min-h-[140px]">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">RG / Identity</span>
                         <span className="text-2xl font-bold tracking-widest text-slate-900 italic">{employee.rg || '**.***.***-*'}</span>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'bank' && (
                <div className="max-w-xl mx-auto space-y-12 py-10">
                   <div className="border border-slate-200 p-10 bg-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-20">
                         <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                      </div>
                      <div className="space-y-10 relative z-10">
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Entidade Bancária</p>
                            <p className="text-4xl font-bold text-slate-900 tracking-tight leading-none uppercase">{employee.bank?.name || 'Vazio'}</p>
                         </div>
                         <div className="flex gap-16">
                            <div>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Agência</p>
                               <p className="text-xl font-bold font-mono text-slate-900 tracking-widest">{employee.bank?.agency || '****'}</p>
                            </div>
                            <div>
                               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conta Flow</p>
                               <p className="text-xl font-bold font-mono text-slate-900 tracking-widest">{employee.bank?.account || '*******'}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-10">
                   <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest border-l-2 border-slate-900 pl-4 italic">Timeline Profissional</h4>
                   <div className="space-y-8 relative pl-6">
                      <div className="absolute left-[3px] top-4 bottom-4 w-px bg-slate-100"></div>
                      {employee.history?.map((h, i) => (
                        <div key={i} className="relative group">
                           <div className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-slate-900 group-hover:scale-125 transition-all"></div>
                           <div className="p-8 bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-2">{h.event}</p>
                                 <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest italic">{h.role}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">R$ {h.salary.toLocaleString('pt-BR')}</p>
                                 <p className="text-[10px] font-bold text-slate-900 font-mono">{new Date(h.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {['Contrato.pdf', 'Termos.doc', 'ASO.pdf', 'NDA.xml'].map(doc => (
                     <div key={doc} className="p-8 border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                           <div className="p-3 bg-slate-50 text-slate-300 group-hover:bg-white/10 group-hover:text-blue-500">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                           </div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest mb-1">{doc}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic group-hover:text-slate-500">Arquivado v1.0 • 24 KB</p>
                           </div>
                        </div>
                        <button className="text-slate-200 hover:text-blue-500 group-hover:text-white transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <EditModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        employee={employee} 
        onSave={handleUpdate} 
      />
    </div>
  );
};

export default EmployeeDetail;
