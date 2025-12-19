
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { TimeRecord, TimeRecordType, TimeRecordStatus, Employee } from '../types';

const ExportPreviewModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  employee: Employee; 
  records: Record<string, TimeRecord[]>; 
}> = ({ isOpen, onClose, employee, records }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-slideIn">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Pré-visualização do Espelho</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documento gerado para fins de conferência - Nexus HR</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Imprimir / Salvar PDF</button>
            <button onClick={onClose} className="px-6 py-3 bg-white border border-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Fechar</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-12 bg-white printable-area">
          <div className="border-2 border-gray-900 p-8 space-y-8">
            <div className="flex justify-between border-b-2 border-gray-900 pb-6">
              <div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">Nexus HR - Espelho de Ponto</h1>
                <p className="text-sm font-bold mt-1">Empresa: NEXUS TECNOLOGIA LTDA | CNPJ: 00.000.000/0001-00</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">Período: 21/10/2024 a 20/11/2024</p>
                <p className="text-xs font-bold">Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs font-bold uppercase">
              <div className="space-y-1">
                <p><span className="text-gray-400">Nome:</span> {employee.name}</p>
                <p><span className="text-gray-400">Matrícula:</span> {employee.registration}</p>
              </div>
              <div className="space-y-1">
                <p><span className="text-gray-400">Cargo:</span> {employee.role}</p>
                <p><span className="text-gray-400">Setor:</span> {employee.department}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-gray-900 text-[10px] uppercase font-bold">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-900 p-2">Data</th>
                  <th className="border border-gray-900 p-2">Entrada</th>
                  <th className="border border-gray-900 p-2">I. Início</th>
                  <th className="border border-gray-900 p-2">I. Fim</th>
                  <th className="border border-gray-900 p-2">Saída</th>
                  <th className="border border-gray-900 p-2">Saldo</th>
                  <th className="border border-gray-900 p-2">Ocorrência</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(records).map(([date, dayRecords]) => {
                  // Explicitly cast to TimeRecord[] to avoid 'unknown' type errors when iterating
                  const recordsForDay = dayRecords as TimeRecord[];
                  const sorted = [...recordsForDay].sort((a,b) => a.timestamp.localeCompare(b.timestamp));
                  const getT = (type: TimeRecordType) => sorted.find(r => r.type === type)?.timestamp || '--:--';
                  return (
                    <tr key={date}>
                      <td className="border border-gray-900 p-2 text-center">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}</td>
                      <td className="border border-gray-900 p-2 text-center">{getT('Entrada')}</td>
                      <td className="border border-gray-900 p-2 text-center">{getT('Intervalo Início')}</td>
                      <td className="border border-gray-900 p-2 text-center">{getT('Intervalo Fim')}</td>
                      <td className="border border-gray-900 p-2 text-center">{getT('Saída')}</td>
                      <td className="border border-gray-900 p-2 text-center">08:00</td>
                      <td className="border border-gray-900 p-2 italic text-[8px]">{recordsForDay.some(r => r.status === 'Ajustado') ? 'Ajustado RH' : ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-20 pt-20">
              <div className="border-t border-gray-900 text-center pt-2">
                <p className="text-[10px] font-bold uppercase">{employee.name}</p>
                <p className="text-[8px] text-gray-400">Assinatura do Colaborador</p>
              </div>
              <div className="border-t border-gray-900 text-center pt-2">
                <p className="text-[10px] font-bold uppercase">Nexus HR - Departamento Pessoal</p>
                <p className="text-[8px] text-gray-400">Carimbo e Assinatura Empresa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeTracking: React.FC = () => {
  const { 
    timeRecords, employees, updateTimeRecord, deleteTimeRecord, 
    addManualRecord, approveTimeRecord, rejectTimeRecord, 
    syncESocial, exportPDF 
  } = useHR();
  
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);

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

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      {/* Header remain same as previous good design */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none uppercase">Central de Jornada</h2>
            <p className="text-gray-500 font-medium mt-2">Auditoria e conformidade eSocial.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
           <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Setor</label>
              <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedEmpId(''); }} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                  {departments.map(d => <option key={d}>{d}</option>)}
              </select>
           </div>
           <div className="space-y-1 flex-1 min-w-[250px]">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Colaborador</label>
              <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Selecione um profissional...</option>
                  {filteredEmployees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
              </select>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <section className="xl:col-span-2 space-y-10">
          {!selectedEmpId ? (
            <div className="p-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Selecione um profissional para auditoria de ponto</p>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 bg-white/50 p-6 rounded-[2.5rem] border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                    <span className="w-3 h-8 bg-indigo-600 rounded-full"></span>
                    Timeline: {selectedEmployee?.name}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={handleExport} disabled={isExporting} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                      {isExporting ? 'Processando...' : 'Exportar Espelho'}
                    </button>
                    <button onClick={handleSync} disabled={isSyncing} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50">
                      {isSyncing ? 'Transmitindo...' : 'Sincronizar eSocial'}
                    </button>
                  </div>
               </div>

               <div className="space-y-6">
                 {Object.entries(groupedRecords).map(([date, records]: [string, TimeRecord[]]) => (
                    <div key={date} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group/day">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                          <div className="flex items-center gap-4">
                              <span className="text-2xl font-black text-gray-900">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[8px] font-black text-gray-400 uppercase">Total do Dia</p>
                              <p className="text-sm font-black text-indigo-600">08:00h</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[...records].sort((a,b) => a.timestamp.localeCompare(b.timestamp)).map(tr => (
                            <div key={tr.id} className={`p-5 rounded-[2rem] border transition-all group/card relative ${
                              tr.status === 'Rejeitado' ? 'bg-red-50 border-red-100' :
                              tr.status === 'Abonado' ? 'bg-purple-50 border-purple-100' : 
                              tr.status === 'Pendente' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'
                            }`}>
                                <div className="flex justify-between items-start mb-3">
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                                    tr.type === 'Entrada' ? 'text-green-600' : tr.type === 'Saída' ? 'text-red-600' : 'text-blue-600'
                                  }`}>{tr.type}</span>
                                  <button onClick={() => { setSelectedRecord(tr); setIsEditOpen(true); }} className="opacity-0 group-hover/card:opacity-100 text-indigo-600 p-1.5 hover:bg-white rounded-lg shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </button>
                                </div>
                                <p className="text-2xl font-black text-gray-900 tabular-nums">{tr.timestamp}</p>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${tr.status === 'Original' ? 'bg-white text-green-600 border-green-50' : 'bg-white text-blue-600 border-blue-50'}`}>{tr.status}</span>
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

        <section className="space-y-8">
           <div className="bg-gray-950 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-10 pb-4 border-b border-white/10">Compliance Global</h4>
              <div className="space-y-10">
                 <div className="flex justify-between items-center group/item">
                    <div>
                       <p className="text-4xl font-black tabular-nums">100%</p>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Sincronia S-1200</p>
                    </div>
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                    </div>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">
                       A Nexus HR valida automaticamente a jornada contra a CLT. Alertas de horas extras acima de 2h/dia são priorizados para o gestor.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {showExportModal && selectedEmployee && (
        <ExportPreviewModal 
          isOpen={showExportModal} 
          onClose={() => setShowExportModal(false)} 
          employee={selectedEmployee} 
          records={groupedRecords} 
        />
      )}
    </div>
  );
};

export default TimeTracking;
