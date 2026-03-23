import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { Benefit, BenefitType, Employee } from '../types';

const BenefitModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void;
  initialData?: Benefit;
}> = ({ isOpen, onClose, onSave, initialData }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600"></div>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">
            {initialData ? 'Otimizar' : 'Provisionar'} Plano
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-10 space-y-8" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            name: fd.get('name'),
            provider: fd.get('provider'),
            type: fd.get('type') as BenefitType,
            baseCost: Number(fd.get('cost')),
            eligibility: fd.get('eligibility'),
            description: fd.get('description')
          });
          onClose();
        }}>
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Nomenclatura do Plano</label>
               <input name="name" required defaultValue={initialData?.name} placeholder="Ex: Nexus Health Platinum" className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Operadora Parceira</label>
                  <input name="provider" required defaultValue={initialData?.provider} placeholder="Ex: Unimed, Bradesco..." className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Categoria Estratégica</label>
                  <select name="type" defaultValue={initialData?.type} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic">
                    <option value="Saúde" className="dark:bg-slate-900">Saúde</option>
                    <option value="Alimentação" className="dark:bg-slate-900">Alimentação</option>
                    <option value="Seguro" className="dark:bg-slate-900">Seguro</option>
                    <option value="Transporte" className="dark:bg-slate-900">Transporte</option>
                    <option value="Educação" className="dark:bg-slate-900">Educação</option>
                    <option value="Lazer" className="dark:bg-slate-900">Lazer</option>
                  </select>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Custoverso (R$)</label>
                  <input name="cost" type="number" step="0.01" required defaultValue={initialData?.baseCost} placeholder="0.00" className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-lg text-blue-600 font-black outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic ml-1">Elegibilidade Nexus</label>
                  <select name="eligibility" defaultValue={initialData?.eligibility} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic">
                    <option value="Todos" className="dark:bg-slate-900">Global</option>
                    <option value="CLT" className="dark:bg-slate-900">Apenas CLT</option>
                    <option value="Liderança" className="dark:bg-slate-900">Liderança</option>
                  </select>
               </div>
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.3)] italic">
            {initialData ? 'Validar Alterações' : 'Provisionar Novo Benefício'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ManageUsersModal: React.FC<{ 
  benefit: Benefit; 
  onClose: () => void; 
}> = ({ benefit, onClose }) => {
  const { employees, employeeBenefits, enrollEmployeeInBenefit, cancelEmployeeBenefit, updateEmployeeBenefit } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [employees, searchTerm]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl animate-slideIn flex flex-col max-h-[85vh] relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Gestão de Adesão Nexus</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] italic">{benefit.name} &bull; {benefit.provider}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 italic">
           <input 
             type="text" 
             placeholder="Filtrar por nome do talento..." 
             className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent placeholder:text-slate-300 dark:placeholder:text-slate-700 italic"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-950">
          {filteredEmployees.map(emp => {
            const enrollment = employeeBenefits.find(eb => eb.employeeId === emp.id && eb.benefitId === benefit.id && eb.status === 'Ativo');
            return (
              <div key={emp.id} className={`p-6 border transition-all flex items-center justify-between group overflow-hidden relative ${enrollment ? 'bg-white dark:bg-slate-900 border-blue-600/30 shadow-xl' : 'bg-transparent border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}>
                {enrollment && <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>}
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-none flex items-center justify-center font-bold text-[11px] italic transition-all ${enrollment ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {emp.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm uppercase italic tracking-tight mb-1">{emp.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest">{emp.registration} &bull; {emp.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                   {enrollment ? (
                      <>
                        <div className="text-right">
                           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 italic">Ativo desde {new Date(enrollment.enrollmentDate).toLocaleDateString('pt-BR')}</p>
                           {editingCardId === enrollment.id ? (
                             <input 
                               className="w-40 px-3 py-2 border-b border-blue-600 dark:border-blue-400 text-[11px] font-bold text-slate-900 dark:text-white outline-none bg-blue-50/50 dark:bg-blue-900/20 italic"
                               placeholder="Cód. Identificador"
                               autoFocus
                               onBlur={(e) => {
                                 updateEmployeeBenefit(enrollment.id, { cardNumber: e.target.value });
                                 setEditingCardId(null);
                               }}
                             />
                           ) : (
                             <button 
                                onClick={() => setEditingCardId(enrollment.id)}
                                className="text-[10px] font-bold text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-[0.2em] italic border-b border-transparent hover:border-blue-600 transition-all font-mono"
                             >
                               ID: {enrollment.cardNumber || 'EMITIR TOKEN'}
                             </button>
                           )}
                        </div>
                        <button 
                          onClick={() => cancelEmployeeBenefit(enrollment.id)}
                          className="w-10 h-10 flex items-center justify-center text-slate-200 dark:text-slate-800 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </>
                   ) : (
                      <button 
                        onClick={() => enrollEmployeeInBenefit(emp.id, benefit.id)}
                        className="px-10 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-800 dark:hover:bg-blue-500 transition-all italic shadow-2xl"
                      >
                        Vincular
                      </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Benefits: React.FC = () => {
  const { benefits, employeeBenefits, addBenefit, updateBenefit, removeBenefit, toggleBenefitStatus } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | undefined>(undefined);
  const [managingBenefit, setManagingBenefit] = useState<Benefit | null>(null);

  const stats = useMemo(() => {
    const activeEnrollments = employeeBenefits.filter(eb => eb.status === 'Ativo').length;
    const totalMonthlyCost = employeeBenefits
      .filter(eb => eb.status === 'Ativo')
      .reduce((acc, eb) => {
        const benefit = benefits.find(b => b.id === eb.benefitId);
        return acc + (benefit?.baseCost || 0);
      }, 0);
    return { activeEnrollments, totalMonthlyCost };
  }, [benefits, employeeBenefits]);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Benefits"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8 animate-slideDown">
            <div>
               <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Engenharia de Incentivos</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-lg font-medium italic leading-relaxed">Maximizando a retenção de talentos através de protocolos de bem-estar de alta performance.</p>
            </div>
            
            <button 
              onClick={() => { setEditingBenefit(undefined); setIsModalOpen(true); }}
              className="px-12 py-5 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 italic"
            >
              Criar Novo Protocolo
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="nexus-card p-10 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform"></div>
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-4">Investimento Nexus / Mês</p>
           <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter italic">R$ {stats.totalMonthlyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-none bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">{stats.activeEnrollments} Pontos de Adesão</span>
           </div>
        </div>
        
        <div className="nexus-card p-10 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform"></div>
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-4">Parceiros Estratégicos</p>
           <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter italic">{Array.from(new Set(benefits.map(b => b.provider))).length}</p>
           <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-none bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic">{benefits.length} Protocolos Ativos</span>
           </div>
        </div>

        <div className="nexus-card p-10 group relative overflow-hidden">
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-6 text-center">Matriz de Distribuição</p>
           <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group/item hover:border-blue-600 transition-colors">
                 <p className="text-xl font-bold text-slate-900 dark:text-white italic tracking-tighter group-item/item:text-blue-600">{benefits.filter(b => b.type === 'Saúde').length}</p>
                 <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest mt-1">Life</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group/item hover:border-blue-600 transition-colors">
                 <p className="text-xl font-bold text-slate-900 dark:text-white italic tracking-tighter group-item/item:text-blue-600">{benefits.filter(b => b.type === 'Alimentação').length}</p>
                 <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest mt-1">Food</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group/item hover:border-blue-600 transition-colors">
                 <p className="text-xl font-bold text-slate-900 dark:text-white italic tracking-tighter group-item/item:text-blue-600">{benefits.filter(b => b.type !== 'Saúde' && b.type !== 'Alimentação').length}</p>
                 <p className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase italic tracking-widest mt-1">Extra</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit) => {
           const userCount = employeeBenefits.filter(eb => eb.benefitId === benefit.id && eb.status === 'Ativo').length;
           return (
             <div 
                key={benefit.id} 
                className={`nexus-card p-10 group flex flex-col justify-between transition-all duration-700 relative overflow-hidden ${!benefit.active ? 'opacity-30 grayscale saturate-0' : 'hover:border-blue-600 shadow-xl hover:shadow-blue-600/10'}`}
              >
                {!benefit.active && <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center font-black text-slate-400 uppercase tracking-[0.5em] -rotate-12 italic">DESATIVADO</div>}
                <div className="relative z-0">
                  <div className="flex justify-between items-start mb-10">
                    <div className={`w-16 h-16 rounded-none flex items-center justify-center border-2 transition-transform duration-700 group-hover:rotate-12 ${
                      benefit.type === 'Saúde' ? 'bg-red-500 dark:bg-red-950/20 border-red-500/20 text-white dark:text-red-500' :
                      benefit.type === 'Alimentação' ? 'bg-emerald-500 dark:bg-emerald-950/20 border-emerald-500/20 text-white dark:text-emerald-500' : 'bg-blue-600 dark:bg-blue-950/20 border-blue-600/20 text-white dark:text-blue-600'
                    }`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => { setEditingBenefit(benefit); setIsModalOpen(true); }}
                        className="w-10 h-10 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-slate-800 transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => removeBenefit(benefit.id)}
                        className="w-10 h-10 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-100 dark:border-slate-800 transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tighter uppercase italic">{benefit.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-10">{benefit.provider} &bull; {benefit.eligibility}</p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mb-2 italic">Fee Nexus</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white italic tracking-tighter">R$ {benefit.baseCost.toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest mb-2 italic">Adesões</p>
                        <p className="text-xl font-bold text-blue-600 italic tracking-tighter">{userCount}</p>
                      </div>
                  </div>
                </div>

                <div className="flex gap-4 relative z-0">
                   <button 
                      onClick={() => toggleBenefitStatus(benefit.id)}
                      className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-[0.2em] italic transition-all border ${benefit.active ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 text-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                    >
                      {benefit.active ? 'Suspender' : 'Ativar'}
                    </button>
                    <button 
                      onClick={() => setManagingBenefit(benefit)}
                      className="flex-[2] py-4 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-white dark:hover:bg-blue-500 hover:text-slate-900 transition-all italic shadow-2xl"
                    >
                      Gerenciar Rede
                    </button>
                </div>
              </div>
           );
        })}
      </div>

      <BenefitModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBenefit(undefined); }} 
        onSave={(data) => {
          if (editingBenefit) {
            updateBenefit(editingBenefit.id, data);
          } else {
            addBenefit(data);
          }
        }} 
        initialData={editingBenefit}
      />

      {managingBenefit && (
        <ManageUsersModal 
          benefit={managingBenefit} 
          onClose={() => setManagingBenefit(null)} 
        />
      )}
    </div>
  );
};

export default Benefits;
