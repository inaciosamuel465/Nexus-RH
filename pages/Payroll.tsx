
import React, { useMemo, useState } from 'react';
import { useHR } from '../context/HRContext';
import { Employee, MonthlyPayroll, ManualEntry, PayrollEventType } from '../types';

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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white rounded-[3rem] w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-950 text-white">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Relatório Gerencial de Folha</h3>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Competência: {month} &bull; Auditoria de Desembolso</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => window.print()} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Imprimir / PDF
             </button>
             <button onClick={onClose} className="px-8 py-4 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">Fechar</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-white printable-area">
           <div className="space-y-12">
              <header className="flex justify-between items-start border-b-2 border-gray-900 pb-8">
                 <div>
                    <h1 className="text-3xl font-black tracking-tighter">NEXUS TECNOLOGIA LTDA</h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Controle de Custos e Provisões</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-black uppercase">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Status: Auditoria Mensal</p>
                 </div>
              </header>

              <div className="grid grid-cols-4 gap-8">
                 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Total Bruto</p>
                    <p className="text-2xl font-black text-gray-900">R$ {totals.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Total Retenções</p>
                    <p className="text-2xl font-black text-red-600">R$ {totals.deductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Líquido a Pagar</p>
                    <p className="text-2xl font-black text-blue-700">R$ {totals.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">FGTS Provisão</p>
                    <p className="text-2xl font-black text-emerald-900">R$ {totals.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                 </div>
              </div>

              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b-2 border-gray-900 text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <th className="py-4">Nome / Matrícula</th>
                       <th className="py-4">Departamento</th>
                       <th className="py-4 text-right">Proventos</th>
                       <th className="py-4 text-right">Descontos</th>
                       <th className="py-4 text-right">Líquido</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-[11px] font-bold uppercase">
                    {payrollData.map(({ employee, calculation }) => (
                       <tr key={employee.id}>
                          <td className="py-4">{employee.name} <span className="text-gray-400 ml-2">#{employee.registration}</span></td>
                          <td className="py-4 text-gray-500">{employee.department}</td>
                          <td className="py-4 text-right">R$ {calculation.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-4 text-right text-red-500">R$ {calculation.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-4 text-right text-emerald-600 font-black">R$ {calculation.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       </tr>
                    ))}
                 </tbody>
                 <tfoot>
                    <tr className="border-t-2 border-gray-900 font-black text-sm uppercase">
                       <td colSpan={2} className="py-6">Total Geral da Folha</td>
                       <td className="py-6 text-right">R$ {totals.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       <td className="py-6 text-right">R$ {totals.deductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                       <td className="py-6 text-right text-blue-700">R$ {totals.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
          <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">Evento Variável</h3>
          <button onClick={onClose} className="p-2 text-indigo-300 hover:bg-indigo-100 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
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
          <div className="space-y-4">
            <select name="employeeId" required className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
              <option value="">Selecione Colaborador...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
            </select>
            <input name="name" required placeholder="Descrição (Ex: Bônus Meta)" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            <div className="grid grid-cols-2 gap-4">
              <select name="type" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                <option value="Provento">Provento (+)</option>
                <option value="Desconto">Desconto (-)</option>
              </select>
              <input name="value" type="number" step="0.01" required placeholder="Valor R$" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all">Registrar Evento</button>
        </form>
      </div>
    </div>
  );
};

// Modal de Holerite Individual (Recibo de Pagamento)
// This modal was added to fix the reference error in the Payroll component
const HoleriteModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  payroll: MonthlyPayroll; 
  employee: Employee 
}> = ({ isOpen, onClose, payroll, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[95vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Recibo de Pagamento de Salário</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Competência: {payroll.month}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Imprimir / PDF</button>
            <button onClick={onClose} className="px-6 py-3 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Fechar</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-12 bg-white printable-area">
          <div className="border-2 border-gray-900 p-8 space-y-8">
            <div className="flex justify-between border-b-2 border-gray-900 pb-6">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">NEXUS TECNOLOGIA LTDA</h1>
                <p className="text-[10px] font-bold mt-1">CNPJ: 00.000.000/0001-00</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black uppercase italic">Holerite</p>
                <p className="text-xs font-bold">Mês/Ano: {payroll.month}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-[10px] font-bold uppercase">
              <div className="space-y-1">
                <p><span className="text-gray-400">Cód/Nome:</span> {employee.registration} - {employee.name}</p>
                <p><span className="text-gray-400">Cargo:</span> {employee.role}</p>
              </div>
              <div className="space-y-1">
                <p><span className="text-gray-400">Departamento:</span> {employee.department}</p>
                <p><span className="text-gray-400">Admissão:</span> {new Date(employee.hireDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-900 text-[9px] uppercase font-bold">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-900">
                  <th className="p-2 text-left border-r border-gray-900">Descrição</th>
                  <th className="p-2 text-center border-r border-gray-900">Ref.</th>
                  <th className="p-2 text-right border-r border-gray-900">Vencimentos</th>
                  <th className="p-2 text-right">Descontos</th>
                </tr>
              </thead>
              <tbody>
                {payroll.events.map(event => (
                  <tr key={event.id} className="border-b border-gray-300">
                    <td className="p-2 border-r border-gray-900">{event.name}</td>
                    <td className="p-2 text-center border-r border-gray-900">{event.reference || '-'}</td>
                    <td className="p-2 text-right border-r border-gray-900">
                      {event.type === 'Provento' ? `R$ ${event.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                    </td>
                    <td className="p-2 text-right">
                      {event.type === 'Desconto' ? `R$ ${event.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                    </td>
                  </tr>
                ))}
                {/* Filler rows to maintain layout consistency */}
                {[...Array(Math.max(0, 10 - payroll.events.length))].map((_, i) => (
                  <tr key={`filler-${i}`} className="border-b border-gray-300">
                    <td className="p-2 border-r border-gray-900 h-6"></td>
                    <td className="p-2 border-r border-gray-900"></td>
                    <td className="p-2 border-r border-gray-900"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-900">
                  <td colSpan={2} className="p-2 text-right font-black border-r border-gray-900 uppercase">Totais:</td>
                  <td className="p-2 text-right font-black border-r border-gray-900">R$ {payroll.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-2 text-right font-black">R$ {payroll.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end gap-10">
               <div className="bg-gray-100 p-4 border border-gray-900 w-64 text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Líquido a Receber</p>
                  <p className="text-2xl font-black text-gray-900">R$ {payroll.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-[8px] font-bold text-gray-500 uppercase">
              <div className="p-2 border border-gray-200">
                 <p>Base Cálculo FGTS</p>
                 <p className="text-gray-900 text-[10px]">R$ {payroll.grossSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-2 border border-gray-200">
                 <p>FGTS do Mês</p>
                 <p className="text-gray-900 text-[10px]">R$ {payroll.fgtsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-2 border border-gray-200">
                 <p>Base Cálculo IRRF</p>
                 <p className="text-gray-900 text-[10px]">R$ {(payroll.grossSalary * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="pt-20 border-t-2 border-dashed border-gray-300 text-center">
              <p className="text-[10px] italic">Declaro ter recebido a importância líquida discriminada neste recibo.</p>
              <div className="mt-12 flex justify-between px-10">
                <div className="w-64 border-t border-gray-900 pt-2">
                  <p className="text-[8px]">Data</p>
                </div>
                <div className="w-64 border-t border-gray-900 pt-2">
                  <p className="text-[8px]">Assinatura do Colaborador</p>
                </div>
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

  // Cálculo da Folha em Tempo Real
  const draftPayroll = useMemo(() => {
    return employees.filter(e => e.status !== 'Inativo').map(e => ({
      employee: e,
      calculation: calculateEmployeePay(e, currentMonth)
    }));
  }, [employees, calculateEmployeePay, currentMonth, manualEntries]);

  // Nexus Controlador RH - Dashboard Ativo
  const stats = useMemo(() => {
    const gross = draftPayroll.reduce((acc, item) => acc + item.calculation.totalEarnings, 0);
    const net = draftPayroll.reduce((acc, item) => acc + item.calculation.netSalary, 0);
    const fgts = draftPayroll.reduce((acc, item) => acc + item.calculation.fgtsValue, 0);
    const manualCount = manualEntries.filter(me => me.month === currentMonth).length;
    return { gross, net, fgts, manualCount, baseCount: draftPayroll.length };
  }, [draftPayroll, manualEntries, currentMonth]);

  const handleClosePayroll = async () => {
    if(!confirm(`Deseja encerrar definitivamente a folha de ${currentMonth}? Os lançamentos serão consolidados no histórico.`)) return;
    setIsClosing(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulação de processamento bancário
      processMonthlyPayroll(currentMonth);
      alert('Folha de Novembro encerrada e liquidada com sucesso!');
      setActiveTab('history');
    } finally {
      setIsClosing(false);
    }
  };

  const isAlreadyClosed = useMemo(() => payrollHistory.some(p => p.month === currentMonth), [payrollHistory, currentMonth]);

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      {/* Header Profissional */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm no-print">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Nexus Payroll</h2>
            <p className="text-gray-500 font-medium">Competência Ativa: <span className="font-bold text-indigo-600 uppercase">{currentMonth}</span></p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex">
            <button onClick={() => setActiveTab('preview')} className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Auditoria</button>
            <button onClick={() => setActiveTab('history')} className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Histórico</button>
          </div>
          
          {!isAlreadyClosed && (
            <button onClick={handleClosePayroll} disabled={isClosing} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all">
              {isClosing ? 'Calculando...' : 'Fechar Folha'}
            </button>
          )}
        </div>
      </header>

      {activeView === 'preview' ? (
        <div className="space-y-10">
          {/* Dashboard Controlador RH Sincronizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 no-print">
             <div className="bg-gray-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Desembolso Bruto</p>
                <p className="text-3xl font-black tabular-nums">R$ {stats.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Líquido Previsto</p>
                <p className="text-3xl font-black text-gray-900 tabular-nums">R$ {stats.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">FGTS (Mês)</p>
                <p className="text-3xl font-black text-indigo-600 tabular-nums">R$ {stats.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Base Ativa</p>
                <p className="text-3xl font-black text-indigo-900 tabular-nums">{stats.baseCount} Colabs</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Tabela de Conferência */}
             <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden no-print">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Prévia de Eventos S-1200</h3>
                   <button onClick={() => setShowGeneralReport(true)} className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Relatório Gerencial (PDF)
                   </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-[9px] uppercase font-black tracking-widest">
                        <th className="px-10 py-6">Profissional</th>
                        <th className="px-10 py-6 text-right">Vencimentos</th>
                        <th className="px-10 py-6 text-right">Descontos</th>
                        <th className="px-10 py-6 text-right">Líquido Final</th>
                        <th className="px-10 py-6 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {draftPayroll.map(({ employee, calculation }) => (
                        <tr key={employee.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="px-10 py-6">
                            <p className="font-black text-sm text-gray-900 leading-none">{employee.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{employee.role}</p>
                          </td>
                          <td className="px-10 py-6 text-right text-sm font-bold text-gray-600">
                            R$ {calculation.totalEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-10 py-6 text-right text-sm font-bold text-red-500">
                            - R$ {calculation.totalDeductions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-10 py-6 text-right text-sm font-black text-emerald-600">
                            R$ {calculation.netSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button onClick={() => setSelectedPayroll({ payroll: calculation, employee })} className="px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black">Holerite</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             {/* Controlador RH - Sincronização em Tempo Real */}
             <div className="space-y-6 no-print">
                <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                   </div>
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-300 mb-8 border-b border-white/10 pb-4">Nexus Controlador RH</h4>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-indigo-200 uppercase">Eventos Manuais</span>
                         <span className="text-xl font-black">{stats.manualCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-indigo-200 uppercase">Sincronia Ponto</span>
                         <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-[8px] font-black">Ativo</span>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-[10px] text-indigo-100/60 leading-relaxed italic">As métricas de custo são atualizadas instantaneamente ao adicionar lançamentos variáveis.</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">Variáveis <br/> de Novembro</h3>
                      <button onClick={() => setIsManualModalOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">+ Novo</button>
                   </div>
                   
                   <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {manualEntries.filter(me => me.month === currentMonth).map(me => (
                        <div key={me.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-gray-200">
                           <div className="flex flex-col">
                              <p className="text-[11px] font-black text-gray-900 truncate">{me.name}</p>
                              <p className="text-[8px] font-bold text-gray-400 uppercase">{employees.find(e => e.id === me.employeeId)?.name}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-black ${me.type === 'Provento' ? 'text-blue-600' : 'text-red-600'}`}>R$ {me.value.toLocaleString('pt-BR')}</span>
                              <button onClick={() => removeManualEntry(me.id)} className="text-gray-300 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
                           </div>
                        </div>
                      ))}
                      {manualEntries.filter(m => m.month === currentMonth).length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-[3rem] text-gray-300 italic font-bold text-xs">Sem lançamentos</div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 no-print animate-fadeIn">
           {(Array.from(new Set(payrollHistory.map(p => p.month))) as string[]).map(month => {
             const monthRecs = payrollHistory.filter(p => p.month === month);
             const totalNet = monthRecs.reduce((acc, p) => acc + p.netSalary, 0);
             return (
               <div key={month} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm group flex flex-col justify-between hover:shadow-2xl transition-all h-[340px]">
                  <div>
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">
                          {month.split('-')[1]}
                       </div>
                       <span className="px-4 py-1.5 bg-green-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-100">Liquidada</span>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Folha de {month}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Líquido: R$ {totalNet.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <button onClick={() => {
                    // Reutilizamos a lógica de relatório com os dados históricos
                    const historyData = monthRecs.map(p => ({
                      employee: employees.find(e => e.id === p.employeeId)!,
                      calculation: p
                    }));
                    // Setando temporariamente o modal para o histórico
                    alert('Carregando auditoria histórica para PDF...');
                  }} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    Visualizar Auditoria & PDF
                  </button>
               </div>
             );
           })}
           {payrollHistory.length === 0 && (
             <div className="lg:col-span-3 py-48 text-center bg-white rounded-[5rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">O histórico de folhas encerradas está vazio.</p>
             </div>
           )}
        </div>
      )}

      {/* Modais de Exibição */}
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
