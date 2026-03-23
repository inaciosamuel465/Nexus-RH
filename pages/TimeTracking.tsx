import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { TimeRecord, TimeRecordType, Employee } from '../types';

const ExportPreviewModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  employee: Employee; 
  records: Record<string, TimeRecord[]>; 
}> = ({ isOpen, onClose, employee, records }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative animate-slideIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Arquitetura de Jornada Nexus</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] italic">Visualização de Auditoria e Conformidade eSocial</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all italic shadow-lg">Extrair Protocolo PDF</button>
            <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-12 bg-white printable-area">
          <div className="border border-slate-900 p-10 space-y-10 text-slate-900 font-sans">
            <div className="flex justify-between border-b border-slate-900 pb-8">
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-tight">Nexus RH - Controle de Jornada</h1>
                <p className="text-[10px] font-medium mt-2">Empresa: NEXUS TECNOLOGIA LTDA | CNPJ: 00.000.000/0001-00</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">Período: 21/10/2024 a 20/11/2024</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Sincronizado eSocial: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 text-[10px] font-bold uppercase tracking-widest">
              <div className="space-y-1.5">
                <p className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-400">Nome:</span> <span>{employee.name}</span></p>
                <p className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-400">PIS/Registro:</span> <span>{employee.registration}</span></p>
              </div>
              <div className="space-y-1.5">
                <p className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-400">Cargo:</span> <span>{employee.role}</span></p>
                <p className="flex justify-between border-b border-slate-100 pb-1"><span className="text-slate-400">Depto:</span> <span>{employee.department}</span></p>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-900 text-[10px] font-medium">
              <thead>
                <tr className="bg-slate-50 font-bold uppercase tracking-widest">
                  <th className="border border-slate-900 p-2 text-center">Data</th>
                  <th className="border border-slate-900 p-2 text-center">Entrada</th>
                  <th className="border border-slate-900 p-2 text-center">I. Início</th>
                  <th className="border border-slate-900 p-2 text-center">I. Fim</th>
                  <th className="border border-slate-900 p-2 text-center">Saída</th>
                  <th className="border border-slate-900 p-2 text-center">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(records).map(([date, dayRecords]) => {
                  const sorted = [...(dayRecords as TimeRecord[])].sort((a,b) => a.timestamp.localeCompare(b.timestamp));
                  const getT = (type: TimeRecordType) => sorted.find(r => r.type === type)?.timestamp || '--:--';
                  return (
                    <tr key={date}>
                      <td className="border border-slate-900 p-2 text-center bg-slate-50 font-bold">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', weekday: 'short'})}</td>
                      <td className="border border-slate-900 p-2 text-center">{getT('Entrada')}</td>
                      <td className="border border-slate-900 p-2 text-center">{getT('Intervalo Início')}</td>
                      <td className="border border-slate-900 p-2 text-center">{getT('Intervalo Fim')}</td>
                      <td className="border border-slate-900 p-2 text-center">{getT('Saída')}</td>
                      <td className="border border-slate-900 p-2 text-center font-bold">08:00</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-20 pt-20">
              <div className="border-t border-slate-900 text-center pt-2">
                <p className="text-[10px] font-bold uppercase">{employee.name}</p>
                <p className="text-[8px] text-slate-400 uppercase mt-0.5">Assinatura do Colaborador</p>
              </div>
              <div className="border-t border-slate-900 text-center pt-2">
                <p className="text-[10px] font-bold uppercase">NEXUS RH - Compliance</p>
                <p className="text-[8px] text-slate-400 uppercase mt-0.5">Assinatura Digital Certificada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequestAdjustmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<TimeRecordType>('Entrada');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('Esquecimento');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col relative animate-slideIn">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
         <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Solicitar Ajuste / Abono</h3>
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-[0.3em] italic">Protocolo de Correção de Jornada</p>
         </div>
         <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Data</label>
                 <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Horário</label>
                 <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent" />
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Tipo de Batida</label>
               <select value={type} onChange={e => setType(e.target.value as TimeRecordType)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent">
                 <option value="Entrada" className="dark:bg-slate-900">Entrada</option>
                 <option value="Intervalo Início" className="dark:bg-slate-900">Intervalo Início</option>
                 <option value="Intervalo Fim" className="dark:bg-slate-900">Intervalo Fim</option>
                 <option value="Saída" className="dark:bg-slate-900">Saída</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Motivo (Abono/Correção)</label>
               <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent">
                 <option value="Esquecimento" className="dark:bg-slate-900">Esquecimento</option>
                 <option value="Problema Técnico" className="dark:bg-slate-900">Problema Técnico no Ponto</option>
                 <option value="Serviço Externo" className="dark:bg-slate-900">Serviço Externo</option>
                 <option value="Atestado/Declaração" className="dark:bg-slate-900">Atestado / Declaração</option>
                 <option value="Outros" className="dark:bg-slate-900">Outros</option>
               </select>
            </div>
            {reason === 'Outros' || reason === 'Atestado/Declaração' ? (
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Detalhes / Justificativa</label>
                 <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 py-3 text-sm text-slate-900 dark:text-white font-bold outline-none bg-transparent min-h-[80px]" placeholder="Descreva o motivo..."></textarea>
              </div>
            ) : null}
         </div>
         <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white dark:hover:bg-slate-900 transition-all">Cancelar</button>
            <button 
              disabled={!date || !time}
              onClick={() => { onSubmit({ date, type, timestamp: time, location: reason, notes }); onClose(); }}
              className="flex-[2] py-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-30"
            >
              Protocolar Solicitação
            </button>
         </div>
      </div>
    </div>
  );
};

const TimeTracking: React.FC = () => {
  const { 
    timeRecords, employees, syncESocial, authenticatedUser, requestAdjustment
  } = useHR();
  
  const isAdmin = authenticatedUser?.userRole === 'ADMIN' || authenticatedUser?.userRole === 'LIDER';
  
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedEmpId, setSelectedEmpId] = useState(isAdmin ? '' : authenticatedUser?.id || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdjModal, setShowAdjModal] = useState(false);

  const departments = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  const filteredEmployees = useMemo(() => selectedDept === 'Todos' ? employees : employees.filter(e => e.department === selectedDept), [employees, selectedDept]);
  const selectedEmployee = useMemo(() => employees.find(e => e.id === selectedEmpId), [employees, selectedEmpId]);

  const groupedRecords = useMemo<Record<string, TimeRecord[]>>(() => {
    if (!selectedEmpId) return {};
    const records = timeRecords
      .filter(tr => tr.employeeId === selectedEmpId)
      .sort((a, b) => new Date(`${b.date}T${b.timestamp}`).getTime() - new Date(`${a.date}T${a.timestamp}`).getTime());

    const groups: Record<string, TimeRecord[]> = {};
    records.forEach(tr => {
      if (!groups[tr.date]) groups[tr.date] = [];
      groups[tr.date].push(tr);
    });
    return groups;
  }, [timeRecords, selectedEmpId]);

  const handleSync = async () => {
    if (!selectedEmpId) return;
    setIsSyncing(true);
    try {
      await syncESocial(selectedEmpId);
      alert('Eventos S-1200 e S-1210 transmitidos ao eSocial com sucesso!');
    } catch (e) {
      alert('Erro na transmissão. Verifique os dados cadastrais.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = () => {
    if (!selectedEmpId) return;
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(true);
    }, 800);
  };

  const handleAdjustmentSubmit = (data: any) => {
    if (!selectedEmpId) return;
    requestAdjustment({ ...data, employeeId: selectedEmpId });
    alert('Solicitação de ajuste protocolada e enviada para aprovação.');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[180px] md:min-h-[220px] flex items-center px-6 md:px-10 overflow-hidden shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Time Tracking"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8 animate-slideDown text-center lg:text-left">
            <div>
               <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tighter uppercase italic">Protocolo de Jornada</h1>
               <p className="text-[10px] md:text-sm text-slate-400 mt-2 max-w-lg font-medium italic leading-relaxed">Auditoria biométrica em tempo real e sincronização neural com os pilares do eSocial.</p>
            </div>
            
            {isAdmin ? (
            <div className="flex flex-col sm:flex-row bg-white/5 backdrop-blur-xl p-1 border border-white/10 gap-0 sm:gap-6 shadow-2xl w-full lg:w-auto">
              <div className="flex items-center border-b sm:border-b-0 sm:border-r border-white/10">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] px-4 italic">B. Unit</span>
                <select 
                  className="bg-transparent text-[9px] font-bold uppercase text-white outline-none cursor-pointer py-3 italic flex-1"
                  value={selectedDept}
                  onChange={(e) => { setSelectedDept(e.target.value); setSelectedEmpId(''); }}
                >
                  {departments.map(d => <option key={d} value={d} className="bg-slate-900 font-sans">{d}</option>)}
                </select>
              </div>
              <div className="flex items-center">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] px-4 italic">Recurso</span>
                <select 
                  className="bg-transparent text-[9px] font-bold uppercase text-white outline-none cursor-pointer py-3 max-w-full italic flex-1"
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                >
                  <option value="" className="bg-slate-900 font-sans text-xs">Selecionar...</option>
                  {filteredEmployees.map(e => <option key={e.id} value={e.id} className="bg-slate-900 font-sans">{e.name}</option>)}
                </select>
              </div>
            </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl p-4 border border-white/10 shadow-2xl">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] italic">Colaborador Atual</span>
                <p className="text-white font-bold uppercase mt-1">{authenticatedUser?.name}</p>
              </div>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <section className="xl:col-span-3 space-y-8">
          {!selectedEmpId ? (
            <div className="nexus-card py-48 text-center border-dashed border-2 dark:border-slate-800 flex flex-col items-center justify-center">
               <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-10 border border-slate-100 dark:border-slate-800">
                 <svg className="w-12 h-12 text-slate-200 dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.5em] text-[10px] italic">Aguardando definição de parâmetro para auditoria Nexus</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-10 animate-fadeIn px-4 md:px-0">
               <div className="nexus-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 group relative overflow-hidden text-center md:text-left">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-blue-600/5 -mr-32 -mt-32 rounded-full group-hover:scale-150 transition-transform"></div>
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-bold text-xl md:text-2xl text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 italic transition-all group-hover:bg-slate-900 dark:group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent shrink-0">
                       {selectedEmployee?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">{selectedEmployee?.name}</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 md:mt-2 uppercase tracking-[0.3em] italic">Bio-Sync eSocial Protocolo Ativo</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                    <button onClick={handleExport} disabled={isExporting} className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 dark:bg-blue-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-500 shadow-2xl italic disabled:opacity-30">
                      {isExporting ? 'Processando...' : 'Gerar Cronograma'}
                    </button>
                    {!isAdmin ? (
                      <button onClick={() => setShowAdjModal(true)} className="px-6 md:px-10 py-3 md:py-4 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all italic shadow-2xl">
                        Solicitar Correção
                      </button>
                    ) : (
                      <button onClick={handleSync} disabled={isSyncing} className="px-6 md:px-10 py-3 md:py-4 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-100 dark:hover:bg-slate-900 transition-all italic disabled:opacity-30">
                        {isSyncing ? 'Transmitindo...' : 'Flash eSocial'}
                      </button>
                    )}
                  </div>
               </div>

                <div className="space-y-6 md:space-y-8">
                 {Object.entries(groupedRecords).map(([date, records]: [string, TimeRecord[]]) => (
                    <div key={date} className="nexus-card p-6 md:p-10 group/day hover:shadow-2xl transition-all duration-700 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-900/50 -mr-16 -mt-16 group-hover/day:bg-blue-600/5 transition-all"></div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8 md:mb-10 border-b border-slate-100 dark:border-slate-800 pb-6 md:pb-8 relative z-10">
                          <div className="flex items-center gap-4 md:gap-8">
                              <div className="flex flex-col items-center p-3 md:p-4 bg-slate-900 dark:bg-blue-600 border border-slate-900 dark:border-blue-700 min-w-[70px] md:min-w-[80px] text-white shadow-xl italic shrink-0">
                                <span className="text-2xl md:text-3xl font-black italic tracking-tighter">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit' })}</span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] mt-1 md:mt-2 opacity-60">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
                              </div>
                              <div>
                                 <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.3em] italic">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                                 <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mt-1 md:mt-2 italic border-l-2 border-blue-600 dark:border-blue-400 pl-4">Audit de Carga: 08:00h Nexus</p>
                              </div>
                          </div>
                   
                          <div className="text-left sm:text-right">
                             <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] mb-1 md:mb-2 italic">Diferencial Diário</p>
                             <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tabular-nums italic group-hover/day:text-blue-600 dark:group-hover/day:text-blue-400 transition-colors">00:00</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                          {[...records].sort((a,b) => a.timestamp.localeCompare(b.timestamp)).map(tr => (
                            <div key={tr.id} className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-500 flex flex-col justify-between group/record">
                                <div className="flex justify-between items-start mb-6">
                                  <div className="flex flex-col">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] italic ${
                                      tr.type === 'Entrada' ? 'text-emerald-500' : tr.type === 'Saída' ? 'text-red-500' : 'text-blue-500'
                                    }`}>{tr.type}</span>
                                    <span className="text-[7px] font-bold text-slate-400 dark:text-slate-700 uppercase mt-1">Status: OK</span>
                                  </div>
                                  <div className={`w-2 h-2 rounded-none transition-transform group-hover/record:rotate-45 ${
                                    tr.type === 'Entrada' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : tr.type === 'Saída' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                  }`}></div>
                                </div>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums italic tracking-tighter mb-4 group-hover/record:translate-x-1 transition-transform">{tr.timestamp}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                                   <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">{tr.status}</span>
                                   <button className="w-8 h-8 flex items-center justify-center text-slate-200 dark:text-slate-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                   </button>
                                </div>
                            </div>
                          ))}
                        </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </section>

        <aside className="space-y-8 animate-slideLeft">
           <div className="bg-slate-900 border border-slate-800 p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 -mr-40 -mt-40 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-12 border-b border-white/10 pb-6 italic">Audit Benchmarking Nexus</h4>
              
              <div className="space-y-12 relative z-10">
                 <div className="group/metric">
                    <p className="text-6xl font-black italic tracking-tighter leading-none group-hover/metric:text-blue-500 transition-colors">100%</p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-4 italic">Sincronia Estrutural eSocial</p>
                 </div>

                 <div className="p-8 bg-white/5 border-l-2 border-blue-600 italic text-[11px] text-slate-400 leading-relaxed font-bold tracking-tight">
                    O Nexus Monitor validou toda a malha biométrica. <span className="text-white">Protocolo Safe-Active garantido</span> nas últimas submissões de dados.
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-white/5 border border-white/5 hover:border-blue-600/30 transition-colors">
                       <p className="text-2xl font-black italic tracking-tighter text-white">0.4%</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase italic mt-1">Gaps RH</p>
                    </div>
                    <div className="text-center p-6 bg-white/5 border border-white/5 hover:border-blue-600/30 transition-colors">
                       <p className="text-2xl font-black italic tracking-tighter text-emerald-400">SAFE</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase italic mt-1">Audit</p>
                    </div>
                 </div>

                 <button className="w-full py-5 border border-white/10 hover:border-blue-600 text-[10px] font-bold uppercase tracking-[0.4em] italic hover:bg-blue-600 transition-all group/btn">
                    Protocolo em Tempo Real
                 </button>
              </div>
           </div>
        </aside>
      </div>

      {showExportModal && selectedEmployee && (
        <ExportPreviewModal 
          isOpen={showExportModal} 
          onClose={() => setShowExportModal(false)} 
          employee={selectedEmployee} 
          records={groupedRecords} 
        />
      )}
      
      <RequestAdjustmentModal
        isOpen={showAdjModal}
        onClose={() => setShowAdjModal(false)}
        onSubmit={handleAdjustmentSubmit}
      />
    </div>
  );
};

export default TimeTracking;
