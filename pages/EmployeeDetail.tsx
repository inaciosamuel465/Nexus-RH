
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-slideIn my-8">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Gestão Completa de Perfil</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {[
            { id: 'general', label: 'Contratual' },
            { id: 'personal', label: 'Pessoal' },
            { id: 'bank', label: 'Financeiro' },
            { id: 'dependents', label: 'Dependentes' },
            { id: 'history', label: 'Histórico' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar" onSubmit={(e) => {
          e.preventDefault();
          onSave(employee.id, formData);
          onClose();
        }}>
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome Completo</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Corporativo</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargo Atual</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departamento</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Salário Base</label>
                  <input type="number" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.salary} onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestor Imediato</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.managerId || ''} onChange={e => setFormData({...formData, managerId: e.target.value || null})}>
                    <option value="">Nenhum / Diretor</option>
                    {employees.filter(emp => emp.id !== formData.id).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.cpf || ''} placeholder="000.000.000-00" onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RG</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.rg || ''} placeholder="00.000.000-0" onChange={e => setFormData({...formData, rg: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Admissão</label>
                <input type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})} />
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Banco</label>
                <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.bank.name} onChange={e => setFormData({...formData, bank: { ...formData.bank, name: e.target.value }})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agência</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.bank.agency} onChange={e => setFormData({...formData, bank: { ...formData.bank, agency: e.target.value }})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conta Corrente</label>
                  <input className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" value={formData.bank.account} onChange={e => setFormData({...formData, bank: { ...formData.bank, account: e.target.value }})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dependents' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listagem de Dependentes</h4>
                <button type="button" onClick={handleAddDependent} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100">
                  + Adicionar
                </button>
              </div>
              <div className="space-y-3">
                {formData.dependents.map((dep, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-4 items-end relative">
                    <button type="button" onClick={() => handleRemoveDependent(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
                    </button>
                    <div className="flex-1 space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase">Nome</label>
                      <input className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={dep.name} onChange={e => handleUpdateDependent(idx, 'name', e.target.value)} />
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase">Parentesco</label>
                      <select className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={dep.type} onChange={e => handleUpdateDependent(idx, 'type', e.target.value)}>
                        <option>Filho(a)</option>
                        <option>Cônjuge</option>
                        <option>Pai/Mãe</option>
                        <option>Outro</option>
                      </select>
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="text-[8px] font-black text-gray-400 uppercase">Nascimento</label>
                      <input type="date" className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={dep.dob} onChange={e => handleUpdateDependent(idx, 'dob', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Histórico de Eventos</h4>
                <button type="button" onClick={handleAddHistory} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100">
                  + Registrar Evento
                </button>
              </div>
              <div className="space-y-3">
                {formData.history.map((h, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                       <input className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" value={h.event} onChange={e => {
                         const history = [...formData.history];
                         history[idx].event = e.target.value;
                         setFormData({...formData, history});
                       }} />
                       <input type="date" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={h.date} onChange={e => {
                         const history = [...formData.history];
                         history[idx].date = e.target.value;
                         setFormData({...formData, history});
                       }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs" value={h.role} onChange={e => {
                         const history = [...formData.history];
                         history[idx].role = e.target.value;
                         setFormData({...formData, history});
                       }} />
                       <input type="number" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" value={h.salary} onChange={e => {
                         const history = [...formData.history];
                         history[idx].salary = parseFloat(e.target.value);
                         setFormData({...formData, history});
                       }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-8 flex gap-3 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">Sair sem salvar</button>
            <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const { employees, updateEmployee, removeEmployee } = useHR();
  const [activeTab, setActiveTab] = useState('contract');
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const employee = employees.find(e => e.id === id);

  if (!employee) return <div className="p-12 text-center text-gray-400 font-bold">Colaborador não encontrado ou registro removido.</div>;

  const handleUpdate = (empId: string, newData: any) => {
    updateEmployee(empId, newData);
  };

  const tabs = [
    { id: 'contract', label: 'Contratual' },
    { id: 'personal', label: 'Dados Pessoais' },
    { id: 'bank', label: 'Financeiro' },
    { id: 'history', label: 'Histórico' },
    { id: 'documents', label: 'Documentos' },
  ];

  const manager = employees.find(e => e.id === employee.managerId);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex items-center gap-4">
        <Link to="/employees" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{employee.name}</h2>
          <p className="text-sm text-gray-500 font-medium">{employee.role} • Matrícula: {employee.registration}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            Gestão de Perfil
          </button>
          <button 
            onClick={() => { if(confirm('Deseja realmente desligar este colaborador? Esta ação é irreversível.')) removeEmployee(employee.id); }}
            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all"
          >
            Desligar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl group-hover:scale-105 transition-transform">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${employee.status === 'Ativo' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              {employee.status}
            </span>
            <div className="mt-8 space-y-4 text-left">
              <div className="p-3 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Corporativo</p>
                <p className="text-xs font-bold text-gray-800 truncate">{employee.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Departamento</p>
                <p className="text-xs font-bold text-gray-800">{employee.department}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gestor Direto</p>
                <p className="text-xs font-bold text-gray-800">{manager?.name || 'Diretoria Executiva'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-50 bg-gray-50/30 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-10">
              {activeTab === 'contract' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b pb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Vínculo e Jornada
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipo Contrato</p>
                        <p className="text-sm font-bold text-gray-900">CLT Indeterminado</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jornada</p>
                        <p className="text-sm font-bold text-gray-900">44h Semanais</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 col-span-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Data Admissão</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(employee.hireDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b pb-4 flex items-center gap-2">
                       <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       Remuneração
                    </h3>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border border-green-100">
                      <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">Salário Bruto</p>
                      <p className="text-4xl font-black text-green-900">R$ {employee.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <div className="mt-4 flex items-center gap-2 text-green-700">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest">Base de cálculo FGTS/INSS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
                  <div className="space-y-6">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b pb-4">Identificação Civil</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase">CPF</span>
                        <span className="text-sm font-bold text-gray-900">{employee.cpf || '***.***.***-**'}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-400 uppercase">RG</span>
                        <span className="text-sm font-bold text-gray-900">{employee.rg || '**-*******'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                     </div>
                     <h4 className="font-black text-[10px] uppercase tracking-widest mb-4 text-blue-300">Compliance LGPD</h4>
                     <p className="text-sm text-blue-100 leading-relaxed font-medium">Os dados pessoais sensíveis estão criptografados em repouso seguindo a política de privacidade Nexus HR v2.4.</p>
                  </div>
                </div>
              )}

              {activeTab === 'bank' && (
                <div className="max-w-md bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <h3 className="font-black text-xs text-blue-400 uppercase tracking-widest mb-10">Cartão de Crédito Salarial</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Instituição Bancária</p>
                      <p className="text-xl font-bold">{employee.bank?.name || 'Não Informado'}</p>
                    </div>
                    <div className="flex gap-12">
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Agência</p>
                        <p className="text-lg font-mono">{employee.bank?.agency || '****'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Conta Corrente</p>
                        <p className="text-lg font-mono">{employee.bank?.account || '**********'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-400">Status Financeiro</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-500/20">Validado</span>
                  </div>
                </div>
              )}

              {activeTab === 'dependents' && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b pb-4">Membros da Família</h3>
                  {employee.dependents?.length === 0 ? (
                    <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 italic text-sm font-medium">Nenhum dependente cadastrado para fins de IRRF ou Plano de Saúde.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee.dependents?.map((dep, idx) => (
                        <div key={idx} className="flex justify-between items-center p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-blue-100 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                {dep.type[0]}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">{dep.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{dep.type}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-bold text-gray-500">{new Date(dep.dob).toLocaleDateString('pt-BR')}</p>
                             <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Ativo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-8 animate-fadeIn">
                  <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest border-b pb-4">Linha do Tempo Corporativa</h3>
                  <div className="space-y-6 pl-4">
                    {employee.history?.length > 0 ? (
                      employee.history.map((h, i) => (
                        <div key={i} className="flex gap-6 relative pb-10 last:pb-0">
                          {i < employee.history.length - 1 && <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-blue-200 to-transparent"></div>}
                          <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-lg z-10"></div>
                          <div className="flex-1 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-black text-gray-900 text-base">{h.event}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{h.role}</p>
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">{new Date(h.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Ajuste de Salário</span>
                               </div>
                               <p className="text-sm font-black text-gray-900">R$ {h.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 italic font-bold">Registro base de admissão não encontrado.</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                   {['Contrato_Trabalho_Assinado.pdf', 'Ficha_Registro_eSocial.pdf', 'ASO_Admissional_Vigente.pdf', 'Termo_HomeOffice.pdf'].map(doc => (
                     <div key={doc} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-between hover:border-blue-300 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                           </div>
                           <div>
                              <p className="text-xs font-black text-gray-900 leading-none mb-1">{doc}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Documento PDF • 2.4 MB</p>
                           </div>
                        </div>
                        <button className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-50 rounded-full">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                     </div>
                   ))}
                   <div className="p-6 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all cursor-pointer">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      <p className="text-[10px] font-black uppercase tracking-widest">Anexar Documento</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
