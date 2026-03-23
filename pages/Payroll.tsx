import React, { useMemo, useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, MonthlyPayroll, PayrollEventType } from '../types';

// Modal de Relatório Geral Otimizado para Impressão
const GeneralReportModal: React.FC<{ isOpen: boolean; onClose: () => void; payrollData: { employee: Employee; calculation: MonthlyPayroll }[]; month: string }> = ({ isOpen, onClose, payrollData, month }) => {
  if (!isOpen) return null;

  const totals = payrollData.reduce((acc, item) => ({
    gross: acc.gross + item.calculation.totalEarnings,
    deductions: acc.deductions + item.calculation.totalDeductions,
    net: acc.net + item.calculation.netSalary,
    fgts: acc.fgts + item.calculation.fgtsValue
  }), { gross: 0, deductions: 0, net: 0, fgts: 0 });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Master Audit Payroll</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] leading-none italic">Competência Financeira: {month}</p>
          </div>
          <div className="flex gap-6">
             <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 transition-all flex items-center gap-3 italic">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Exportar Protocolo
             </button>
             <button onClick={onClose} className="p-2 transition-colors text-slate-400 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-white dark:bg-slate-950 printable-area custom-scrollbar">
           <div className="space-y-12">
              <header className="flex justify-between items-start border-b-2 border-slate-900 dark:border-white pb-10">
                 <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Nexus Global RH</h1>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] mt-3 italic font-mono">FINANCIAL AUDIT v4.0.ALPHA</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 italic">Emissão Certificada</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1 italic tracking-tight">{new Date().toLocaleDateString('pt-BR')}</p>
                 </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: 'Custódia Bruta', val: totals.gross, color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-slate-900' },
                   { label: 'Retenções Fiscais', val: totals.deductions, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
                   { label: 'Fluxo Líquido', val: totals.net, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                   { label: 'Encargos / FGTS', val: totals.fgts, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' }
                 ].map((s, i) => (
                   <div key={i} className={`p-8 border border-slate-100 dark:border-slate-800 ${s.bg} flex flex-col justify-between h-32`}>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] italic">{s.label}</p>
                      <p className={`text-2xl font-black italic tracking-tighter ${s.color}`}>R$ {s.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                   </div>
                 ))}
              </div>

              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b-2 border-slate-900 dark:border-white text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 italic">
                       <th className="py-5 px-4">Entidade / Matrícula</th>
                       <th className="py-5 px-4">Depto</th>
                       <th className="py-5 px-4 text-right">Proventos</th>
                       <th className="py-5 px-4 text-right">Descontos</th>
                       <th className="py-5 px-4 text-right text-slate-900 dark:text-white">Crédito Final</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold uppercase italic tracking-tighter">
                    {payrollData.map(({ employee, calculation }) => (
                       <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="py-6 px-4 text-slate-900 dark:text-white">{employee.name} <span className="text-slate-300 dark:text-slate-800 ml-4 font-mono font-normal">#{employee.registration}</span></td>
                          <td className="py-6 px-4 text-slate-400 dark:text-slate-700 text-[10px] tracking-widest">{employee.department}</td>
                          <td className="py-6 px-4 text-right tabular-nums">R$ {calculation.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-6 px-4 text-right text-red-500 dark:text-red-400 tabular-nums">- R$ {calculation.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-6 px-4 text-right font-black text-slate-900 dark:text-white tabular-nums">R$ {calculation.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       </tr>
                    ))}
                 </tbody>
                 <tfoot>
                    <tr className="border-t-2 border-slate-900 dark:border-white font-black bg-slate-50 dark:bg-slate-900 italic">
                       <td colSpan={2} className="py-8 px-4 uppercase text-[10px] tracking-[0.3em] text-slate-400 dark:text-white">Consolidação de Lote</td>
                       <td className="py-8 px-4 text-right tabular-nums">R$ {totals.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       <td className="py-8 px-4 text-right text-red-600 dark:text-red-400 tabular-nums">R$ {totals.deductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       <td className="py-8 px-4 text-right text-blue-700 dark:text-blue-400 tabular-nums bg-blue-50/50 dark:bg-blue-900/20">R$ {totals.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    </tr>
                 </tfoot>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Lançamento Manual Variável
const ManualEntryModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: Employee[]; onSave: (data: any) => void; month: string }> = ({ isOpen, onClose, employees, onSave, month }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl relative overflow-hidden animate-slideIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Evento Ad-Hoc</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] leading-none italic">Injeção Variável na Matriz Financeira</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="p-10 space-y-8" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            employeeId: fd.get('employeeId'),
            name: fd.get('name'),
            type: fd.get('type') as PayrollEventType,
            value: Number(fd.get('value')),
            month
          });
          onClose();
        }}>
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Entidade Alvo</label>
               <select name="employeeId" required className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic">
                  <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Selecione o Colaborador...</option>
                  {employees.map(e => <option key={e.id} value={e.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{e.name} (#{e.registration})</option>)}
               </select>
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Rótulo do Evento</label>
               <input name="name" required placeholder="Ex: Bônus de Performance Nexus" className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic" />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Natureza Fiscal</label>
                  <select name="type" className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors bg-transparent italic">
                    <option value="Provento" className="bg-white dark:bg-slate-900">Provento (+)</option>
                    <option value="Desconto" className="bg-white dark:bg-slate-900">Desconto (-)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 italic">Impacto (R$)</label>
                  <input name="value" type="number" step="0.01" required placeholder="0.00" className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-black outline-none focus:border-blue-600 transition-colors bg-transparent italic tabular-nums" />
               </div>
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 shadow-xl transition-all duration-500 italic">Sincronizar Protocolo Financeiro</button>
        </form>
      </div>
    </div>
  );
};

// Modal de Holerite Individual
const HoleriteModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  payroll: MonthlyPayroll; 
  employee: Employee 
}> = ({ isOpen, onClose, payroll, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[95vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Digital Pay-Cert</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] leading-none italic">Ciclo Financeiro: {payroll.month}</p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 shadow-lg italic">Certificar Documento</button>
            <button onClick={onClose} className="p-2 transition-colors text-slate-400 dark:text-slate-700 hover:text-slate-900 dark:hover:text-white">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 bg-white dark:bg-slate-950 printable-area custom-scrollbar">
          <div className="border-4 border-slate-900 dark:border-white p-12 space-y-10 text-slate-900 dark:text-white font-sans relative">
            <div className="absolute top-0 right-0 w-32 h-32 border-l-4 border-b-4 border-slate-900 dark:border-white opacity-10"></div>
            <div className="flex justify-between border-b-4 border-slate-900 dark:border-white pb-10">
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Nexus Tecnologia</h1>
                <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-[0.3em] italic">Bio-Financial Protocol v2.5</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Holerite Digital</p>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase mt-2 tracking-widest leading-none">Status: Consolidado</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 text-[10px] font-bold uppercase tracking-[0.4em] italic border-b border-slate-100 dark:border-slate-800 pb-10">
              <div className="space-y-4">
                <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-700">Entidade Alvo:</span> <span>{employee.name}</span></p>
                <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-700">Protocolo Matriz:</span> <span>{employee.role}</span></p>
              </div>
              <div className="space-y-4 text-right">
                <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-700">Matrícula:</span> <span className="font-mono tracking-normal">#{employee.registration}</span></p>
                <p className="flex justify-between"><span className="text-slate-400 dark:text-slate-700">Cluster/Depto:</span> <span>{employee.department}</span></p>
              </div>
            </div>

            <table className="w-full border-collapse text-[10px] font-bold uppercase italic">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b-4 border-slate-900 dark:border-white text-slate-400 dark:text-slate-600">
                  <th className="p-5 text-left uppercase tracking-[0.3em]">Descrição do Lançamento</th>
                  <th className="p-5 text-center uppercase tracking-[0.3em]">Ref.</th>
                  <th className="p-5 text-right uppercase tracking-[0.3em] text-slate-900 dark:text-white">Proventos</th>
                  <th className="p-5 text-right uppercase tracking-[0.3em] text-slate-900 dark:text-white">Descontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-bold">
                {payroll.events.map(event => (
                  <tr key={event.id}>
                    <td className="p-4 text-slate-900 dark:text-white">{event.name}</td>
                    <td className="p-4 text-center font-mono text-slate-400 dark:text-slate-700">{event.reference || '---'}</td>
                    <td className="p-4 text-right tabular-nums">
                      {event.type === 'Provento' ? `R$ ${event.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                    </td>
                    <td className="p-4 text-right text-red-600 dark:text-red-400 tabular-nums">
                      {event.type === 'Desconto' ? `- R$ ${event.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                    </td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 8 - payroll.events.length))].map((_, i) => (
                  <tr key={`filler-${i}`} className="opacity-0">
                    <td className="p-4 h-8">BLANK NODE</td>
                    <td className="p-4"></td>
                    <td className="p-4"></td>
                    <td className="p-4"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-900 border-t-4 border-slate-900 dark:border-white font-black">
                  <td colSpan={2} className="p-6 text-right uppercase text-[9px] tracking-[0.4em] text-slate-400 dark:text-white">Subtotais Técnicos:</td>
                  <td className="p-6 text-right tabular-nums">R$ {payroll.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-6 text-right text-red-600 dark:text-red-400 tabular-nums">R$ {payroll.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end pt-8">
               <div className="bg-slate-900 dark:bg-blue-600 p-10 w-96 text-right text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white opacity-5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-white opacity-60 mb-3 italic">Disponibilidade Líquida</p>
                  <p className="text-5xl font-black italic tracking-tighter tabular-nums leading-none">R$ {payroll.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-12 text-[8px] font-bold uppercase text-slate-400 dark:text-slate-700 pt-12 border-t-2 border-slate-900 dark:border-white italic">
              <div>
                 <p className="tracking-widest">Base de Incidência FGTS</p>
                 <p className="text-slate-900 dark:text-white mt-2 text-xs font-black">R$ {payroll.grossSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                 <p className="tracking-widest">Aporte Mensal FGTS</p>
                 <p className="text-slate-900 dark:text-white mt-2 text-xs font-black">R$ {payroll.fgtsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                 <p className="tracking-widest">Hash de Autenticação</p>
                 <p className="text-slate-900 dark:text-white mt-2 font-mono text-[7px] break-all leading-none opacity-50 uppercase">{Math.random().toString(36).substring(2).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payroll: React.FC = () => {
  const { employees, payrollHistory, manualEntries, processMonthlyPayroll, calculateEmployeePay, addManualEntry, removeManualEntry } = useHR();
  const [isClosing, setIsClosing] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<{ payroll: MonthlyPayroll; employee: Employee } | null>(null);
  const [showGeneralReport, setShowGeneralReport] = useState(false);
  const [activeView, setActiveTab] = useState<'preview' | 'history'>('preview');
  
  const currentMonth = "2024-11";

  const draftPayroll = useMemo(() => {
    return employees.filter(e => e.status !== 'Inativo').map(e => ({
      employee: e,
      calculation: calculateEmployeePay(e, currentMonth)
    }));
  }, [employees, calculateEmployeePay, currentMonth, manualEntries]);

  const stats = useMemo(() => {
    const gross = draftPayroll.reduce((acc, item) => acc + item.calculation.totalEarnings, 0);
    const net = draftPayroll.reduce((acc, item) => acc + item.calculation.netSalary, 0);
    const fgts = draftPayroll.reduce((acc, item) => acc + item.calculation.fgtsValue, 0);
    return { gross, net, fgts, baseCount: draftPayroll.length };
  }, [draftPayroll]);

  const handleClosePayroll = async () => {
    if(!confirm(`Confirma o fechamento definitivo da folha para ${currentMonth}?`)) return;
    setIsClosing(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); 
      processMonthlyPayroll(currentMonth);
      alert('Competência encerrada com sucesso no Nexus Ledger.');
      setActiveTab('history');
    } finally {
      setIsClosing(false);
    }
  };

  const isAlreadyClosed = useMemo(() => payrollHistory.some(p => p.month === currentMonth), [payrollHistory, currentMonth]);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Payroll"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8 animate-slideDown">
            <div className="text-center lg:text-left">
               <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">Financial Engine</h1>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.5rem] italic">Nexus Payroll Protocol &bull; Competência Nov/24</p>
            </div>
            
            <div className="flex gap-6 items-end">
               <div className="flex bg-white/5 backdrop-blur-md border border-white/10 p-1">
                  <button onClick={() => setActiveTab('preview')} className={`px-8 py-2 text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 italic ${activeView === 'preview' ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-white'}`}>Draft Ativo</button>
                  <button onClick={() => setActiveTab('history')} className={`px-8 py-2 text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 italic ${activeView === 'history' ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-white'}`}>Arquivo Nexus</button>
               </div>
               {!isAlreadyClosed && (
                <button 
                  onClick={handleClosePayroll} 
                  disabled={isClosing} 
                  className="px-10 py-3 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-white hover:text-slate-900 transition-all duration-500 disabled:opacity-50 italic"
                >
                  {isClosing ? 'Sincronizando Matriz...' : 'Encerrar Competência'}
                </button>
              )}
            </div>
         </div>
      </div>

      {activeView === 'preview' ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { label: 'Provisão Bruta', val: stats.gross, color: 'text-slate-900 dark:text-white' },
               { label: 'Fluxo Líquido', val: stats.net, color: 'text-blue-600 dark:text-blue-400' },
               { label: 'Encargos / FGTS', val: stats.fgts, color: 'text-slate-400 dark:text-slate-600' },
               { label: 'Entidades On-Chain', val: stats.baseCount, isRaw: true, color: 'text-slate-900 dark:text-white' }
             ].map((s, i) => (
               <div key={i} className="nexus-card p-8 group hover:-translate-y-2 transition-all duration-500">
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-4 italic border-b border-slate-50 dark:border-slate-800 pb-2">{s.label}</p>
                  <p className={`text-4xl font-black italic tracking-tighter ${s.color}`}>
                    {s.isRaw ? s.val : `R$ ${s.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  </p>
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             <div className="lg:col-span-3 nexus-card p-0 overflow-hidden min-h-[500px]">
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.5em] italic">Detalhamento de Proventos Corporativos</h3>
                    <button onClick={() => setShowGeneralReport(true)} className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 transition-all duration-500 shadow-xl italic">Master Audit Protocol</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 text-[9px] uppercase font-bold tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 italic">
                        <th className="px-10 py-6">Entidade / Unidade</th>
                        <th className="px-8 py-6 text-right">Draft Bruto</th>
                        <th className="px-8 py-6 text-right">Retenções</th>
                        <th className="px-8 py-6 text-right text-slate-900 dark:text-white">Crédito Líquido</th>
                        <th className="px-10 py-6 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold uppercase italic tracking-tighter">
                      {draftPayroll.map(({ employee, calculation }) => (
                        <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                          <td className="px-10 py-8">
                            <p className="font-black text-slate-900 dark:text-white text-base tracking-tighter leading-none mb-2">{employee.name}</p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-700 font-bold tracking-widest leading-none italic">#{employee.registration} &bull; {employee.department}</p>
                          </td>
                          <td className="px-8 py-8 text-right text-xs text-slate-400 dark:text-slate-700 tabular-nums">R$ {calculation.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-8 py-8 text-right text-xs text-red-500 dark:text-red-400 tabular-nums">- R$ {calculation.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-8 py-8 text-right text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tabular-nums tracking-tighter italic">R$ {calculation.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="px-10 py-8 text-right">
                            <button onClick={() => setSelectedPayroll({ payroll: calculation, employee })} className="px-6 py-2 border border-slate-200 dark:border-slate-800 text-[9px] font-bold text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-500 uppercase tracking-widest italic">Recibo</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             <aside className="space-y-8 animate-slideLeft">
                <div className="nexus-card p-10 flex flex-col justify-between h-[450px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                   <div className="overflow-hidden relative z-10">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-700 mb-10 border-b border-slate-50 dark:border-slate-800 pb-4 italic">Eventos Dinâmicos</h4>
                      <div className="space-y-8 max-h-[220px] overflow-y-auto pr-4 custom-scrollbar">
                        {manualEntries.filter(me => me.month === currentMonth).map(me => (
                          <div key={me.id} className="flex justify-between items-start group/item hover:translate-x-2 transition-transform duration-500">
                            <div>
                               <p className="text-[11px] font-bold text-slate-900 dark:text-white uppercase truncate max-w-[140px] italic leading-none mb-2">{me.name}</p>
                               <p className="text-[9px] text-slate-400 dark:text-slate-700 uppercase font-bold tracking-widest italic">{employees.find(e => e.id === me.employeeId)?.name.split(' ')[0]}</p>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className={`text-[11px] font-black italic tabular-nums ${me.type === 'Provento' ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                                 {me.type === 'Provento' ? '+' : '-'} R$ {me.value.toLocaleString('pt-BR')}
                               </span>
                               <button onClick={() => removeManualEntry(me.id)} className="text-slate-200 dark:text-slate-800 hover:text-red-600 transition-all">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6" /></svg>
                               </button>
                            </div>
                          </div>
                        ))}
                        {manualEntries.filter(m => m.month === currentMonth).length === 0 && (
                          <div className="py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 italic">
                             <p className="text-[9px] italic text-slate-300 dark:text-slate-800 font-bold uppercase tracking-[0.5em]">Input Zero</p>
                          </div>
                        )}
                      </div>
                   </div>
                   <button onClick={() => setIsManualModalOpen(true)} className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.4rem] hover:bg-blue-600 transition-all duration-500 shadow-xl relative z-10 italic">Injetar Evento Nexus</button>
                </div>

                <div className="bg-slate-950 p-10 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000"></div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.5rem] text-blue-500 mb-10 border-b border-white/5 pb-4 italic">Compliance Engine</h4>
                   <div className="space-y-8 relative z-10">
                      <div className="flex justify-between items-center bg-white/5 p-5 border border-white/5">
                         <span className="text-[9px] font-bold uppercase tracking-[0.4em] italic">Nexus eSocial v4.0</span>
                         <span className="w-2.5 h-2.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-5 border border-white/5">
                         <span className="text-[9px] font-bold uppercase tracking-[0.4em] italic">Tributário / Matriz</span>
                         <span className="text-[10px] font-black text-blue-400 italic font-mono tracking-tighter">CALC_OK</span>
                      </div>
                      <div className="p-6 bg-white/5 italic backdrop-blur-md">
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest italic">
                          Módulos financeiros em conformidade com as diretivas Nexus Global 2024. Todos os cálculos auditados via ledger.
                        </p>
                      </div>
                   </div>
                </div>
             </aside>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fadeIn">
           {(Array.from(new Set(payrollHistory.map(p => p.month))) as string[]).map(month => {
             const monthRecs = payrollHistory.filter(p => p.month === month);
             const totalNet = monthRecs.reduce((acc, p) => acc + p.netSalary, 0);
             return (
               <div key={month} className="nexus-card p-10 group hover:-translate-y-3 transition-all duration-700 flex flex-col justify-between h-[380px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-900 rotate-45 transform translate-x-16 -translate-y-16 group-hover:bg-blue-600/10 transition-colors"></div>
                  <div>
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-16 h-16 bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-2xl uppercase italic shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                          {month.split('-')[1]}
                       </div>
                       <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-[0.4em] border border-emerald-100 dark:border-emerald-900/30 italic">Nexus Vaulted</span>
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Competência {month}</h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mt-6 italic">Protocolo de Desembolso Final:</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter mt-1 tabular-nums">R$ {totalNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <button className="w-full py-5 text-[9px] font-bold uppercase tracking-[0.4rem] border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-500 italic">Consolidar Master Audit</button>
               </div>
             );
           })}
           {payrollHistory.length === 0 && (
             <div className="lg:col-span-3 py-64 text-center border-4 border-dashed border-slate-100 dark:border-slate-900 bg-slate-50/10 dark:bg-slate-950/10 italic">
                <p className="text-slate-200 dark:text-slate-800 font-extrabold uppercase tracking-[0.8em] text-[12px] animate-pulse">Financial Vault Empty</p>
             </div>
           )}
        </div>
      )}

      {selectedPayroll && (
        <HoleriteModal 
          isOpen={!!selectedPayroll} 
          onClose={() => setSelectedPayroll(null)} 
          payroll={selectedPayroll.payroll} 
          employee={selectedPayroll.employee} 
        />
      )}

      <ManualEntryModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
        employees={employees} 
        month={currentMonth}
        onSave={addManualEntry}
      />

      {showGeneralReport && (
        <GeneralReportModal 
          isOpen={showGeneralReport} 
          onClose={() => setShowGeneralReport(false)} 
          payrollData={draftPayroll} 
          month={currentMonth} 
        />
      )}
    </div>
  );
};

export default Payroll;
