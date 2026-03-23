import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { HealthRecord, EPIRecord, Employee, HealthRecordType } from '../types';

const CertificateModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: Employee[]; onSave: (data: any) => void }> = ({ isOpen, onClose, employees, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 bg-red-50 flex justify-between items-center text-red-600">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Protocolar Atestado Médico</h3>
            <p className="text-[10px] font-bold mt-1 uppercase tracking-widest text-red-400">Segurança & Conformidade Ativa</p>
          </div>
          <button onClick={onClose} className="p-2 text-red-300 hover:text-red-600 transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const start = new Date(fd.get('startDate') as string);
          const end = new Date(fd.get('endDate') as string);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          onSave({
            employeeId: fd.get('employeeId'),
            startDate: fd.get('startDate'),
            endDate: fd.get('endDate'),
            days,
            reason: fd.get('reason'),
            doctorName: fd.get('doctor'),
            crm: fd.get('crm'),
            abonoHoras: fd.get('abono') === 'on'
          });
          onClose();
        }}>
          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Colaborador</label>
                <select name="employeeId" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors bg-transparent">
                   <option value="">Selecione...</option>
                   {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Início</label>
                   <input name="startDate" type="date" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors bg-transparent" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Término</label>
                   <input name="endDate" type="date" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors bg-transparent" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <input name="doctor" required placeholder="Nome do Médico" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors bg-transparent" />
                <input name="crm" required placeholder="CRM/UF" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors bg-transparent" />
             </div>
             <textarea name="reason" placeholder="Motivo / CID" required className="w-full h-20 border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-red-600 transition-colors resize-none placeholder:text-slate-300 bg-transparent" />
             <label className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 cursor-pointer">
                <input name="abono" type="checkbox" className="w-4 h-4 accent-red-600" />
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest italic">Abonar automaticamente no controle de ponto</span>
             </label>
          </div>
          <button type="submit" className="w-full py-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">Confirmar Protocolo Médico</button>
        </form>
      </div>
    </div>
  );
};

const ASOModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: Employee[]; onSave: (data: any) => void }> = ({ isOpen, onClose, employees, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 bg-blue-50 flex justify-between items-center text-blue-600">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Lançar Exame ASO</h3>
            <p className="text-[10px] font-bold mt-1 uppercase tracking-widest text-blue-400">Módulo PCMSO / eSocial</p>
          </div>
          <button onClick={onClose} className="p-2 text-blue-300 hover:text-blue-600 transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSave({
            employeeId: fd.get('employeeId'),
            type: fd.get('type') as HealthRecordType,
            date: fd.get('date'),
            status: fd.get('status'),
            nextExam: fd.get('nextExam'),
            doctorName: fd.get('doctor'),
            notes: fd.get('notes')
          });
          onClose();
        }}>
          <div className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Colaborador</label>
                <select name="employeeId" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                   <option value="">Selecione...</option>
                   {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tipo de Exame</label>
                   <select name="type" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                      <option>Admissional</option>
                      <option>Periódico</option>
                      <option>Demissional</option>
                      <option>Retorno ao Trabalho</option>
                      <option>Mudança de Função</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Data Realização</label>
                   <input name="date" type="date" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Parecer</label>
                   <select name="status" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent font-bold">
                      <option>Apto</option>
                      <option>Inapto</option>
                      <option>Apto com Restrições</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vencimento</label>
                   <input name="nextExam" type="date" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
                </div>
             </div>
             <input name="doctor" required placeholder="Médico Examinador" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
             <textarea name="notes" placeholder="Observações adicionais" className="w-full h-16 border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors resize-none bg-transparent" />
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Sincronizar Exame no Histórico</button>
        </form>
      </div>
    </div>
  );
};

const Safety: React.FC = () => {
  const { 
    employees, healthRecords, medicalCertificates, epiRecords, 
    addEPIRecord, handleCertificate, deleteHealthRecord 
  } = useHR();

  const [activeTab, setActiveTab] = useState<'aso' | 'certificates' | 'epi' | 'legal'>('aso');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isASOModalOpen, setIsASOModalOpen] = useState(false);

  const stats = useMemo(() => {
    const today = new Date();
    const expiredASOs = healthRecords.filter(h => new Date(h.nextExam) < today).length;
    const pendingCerts = medicalCertificates.filter(c => c.status === 'Pendente').length;
    const awayCount = employees.filter(e => e.status === 'Afastado').length;
    return { expiredASOs, pendingCerts, awayCount, epiCompliance: 98 };
  }, [healthRecords, medicalCertificates, employees]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Segurança Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1579546673265-92a8a56c703b?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Safety"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Segurança & Saúde Ocupacional</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">Gestão de exames periódicos (ASO), controle de EPIs e protocolização de afastamentos médicos.</p>
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => setIsASOModalOpen(true)} className="px-8 py-3 bg-white text-slate-900 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg">Novo ASO</button>
               <button onClick={() => setIsCertModalOpen(true)} className="px-8 py-3 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">Lançar Atestado</button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className={`p-8 border shadow-sm transition-all flex flex-col justify-between ${stats.expiredASOs > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-4 ${stats.expiredASOs > 0 ? 'text-red-600' : 'text-slate-400'}`}>ASOs Vencidos</p>
            <p className={`text-4xl font-bold italic tracking-tight ${stats.expiredASOs > 0 ? 'text-red-600' : 'text-slate-900'}`}>{stats.expiredASOs}</p>
            <div className="mt-6 pt-4 border-t border-slate-50 italic text-[10px] text-slate-400">Exige renovação imediata</div>
         </div>
         
         <div className={`p-8 border shadow-sm transition-all flex flex-col justify-between ${stats.pendingCerts > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest mb-4 ${stats.pendingCerts > 0 ? 'text-amber-600' : 'text-slate-400'}`}>Atestados em Fila</p>
            <p className={`text-4xl font-bold italic tracking-tight ${stats.pendingCerts > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{stats.pendingCerts}</p>
            <div className="mt-6 pt-4 border-t border-slate-50 italic text-[10px] text-slate-400">Aguardando validação RH</div>
         </div>
         
         <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Afastamentos Atuais</p>
            <p className="text-4xl font-bold italic tracking-tight text-blue-600">{stats.awayCount}</p>
            <div className="mt-6 pt-4 border-t border-slate-50 italic text-[10px] text-slate-400">Impacto operacional em monitoria</div>
         </div>
         
         <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Conformidade EPI</p>
            <p className="text-4xl font-bold italic tracking-tight text-slate-900">{stats.epiCompliance}%</p>
            <div className="mt-6 pt-4 border-t border-slate-50 italic text-[10px] text-slate-400">Auditoria de inventário nominal</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
         <div className="flex bg-slate-50 border-b border-slate-100">
            {[
              { id: 'aso', label: 'Monitoramento ASO' },
              { id: 'certificates', label: 'Gestão de Atestados' },
              { id: 'epi', label: 'Controle de EPIs' },
              { id: 'legal', label: 'Documentação Legal' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id as any)} 
                className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
         </div>

         <div className="p-8 min-h-[500px]">
            {activeTab === 'aso' && (
               <div className="overflow-x-auto animate-fadeIn custom-scrollbar">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           <th className="px-6 py-4">Colaborador</th>
                           <th className="px-6 py-4">Tipo Exame</th>
                           <th className="px-6 py-4">Realização</th>
                           <th className="px-6 py-4">Parecer</th>
                           <th className="px-6 py-4">Vencimento</th>
                           <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {healthRecords.map(h => {
                           const emp = employees.find(e => e.id === h.employeeId);
                           const isExpired = new Date(h.nextExam) < new Date();
                           return (
                              <tr key={h.id} className="hover:bg-slate-50 transition-all group">
                                 <td className="px-6 py-6">
                                    <p className="font-bold text-xs text-slate-900 leading-none mb-1">{emp?.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{emp?.registration}</p>
                                 </td>
                                 <td className="px-6 py-6 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{h.type}</td>
                                 <td className="px-6 py-6 text-xs font-medium text-slate-600">{new Date(h.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                 <td className="px-6 py-6">
                                    <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${
                                       h.status === 'Apto' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
                                    }`}>{h.status}</span>
                                 </td>
                                 <td className="px-6 py-6 font-bold text-xs">
                                    <span className={isExpired ? 'text-red-500' : 'text-slate-900'}>{new Date(h.nextExam + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                 </td>
                                 <td className="px-6 py-6 text-right">
                                    <button onClick={() => deleteHealthRecord(h.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            )}

            {activeTab === 'certificates' && (
               <div className="space-y-6 animate-fadeIn">
                  {medicalCertificates.length === 0 ? (
                     <div className="py-32 text-center bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-slate-100 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Nenhum atestado pendente de avaliação</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medicalCertificates.map(c => {
                           const emp = employees.find(e => e.id === c.employeeId);
                           return (
                              <div key={c.id} className="bg-white p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-900 transition-all group">
                                 <div>
                                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-50">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200">{emp?.name[0]}</div>
                                          <div>
                                             <p className="font-bold text-slate-900 tracking-tight leading-none mb-1">{emp?.name}</p>
                                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.doctorName}</p>
                                          </div>
                                       </div>
                                       <span className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest border ${
                                          c.status === 'Validado' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                          c.status === 'Rejeitado' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                                       }`}>{c.status}</span>
                                    </div>
                                    <div className="space-y-4 mb-6 italic">
                                       <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100">
                                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{new Date(c.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(c.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                          <span className="text-sm font-bold text-red-600">{c.days} Dias</span>
                                       </div>
                                       <p className="text-[11px] text-slate-500 leading-relaxed font-medium">"{c.reason}"</p>
                                    </div>
                                 </div>
                                 {c.status === 'Pendente' && (
                                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                                       <button onClick={() => handleCertificate(c.id, 'Rejeitado')} className="flex-1 py-3 text-[9px] font-bold border border-slate-200 text-slate-400 uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all">Rejeitar</button>
                                       <button onClick={() => handleCertificate(c.id, 'Validado')} className="flex-[2] py-3 bg-red-600 text-white rounded-none font-bold text-[9px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-md">Validar Atestado</button>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'epi' && (
               <div className="space-y-8 animate-fadeIn">
                  <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest italic">Inventário de Proteção Individual</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {epiRecords.length === 0 ? (
                        <div className="col-span-3 py-32 text-center bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center">
                           <svg className="w-12 h-12 text-slate-100 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Nenhuma entrega de EPI registrada no sistema</p>
                        </div>
                     ) : (
                        epiRecords.map(epi => {
                           const emp = employees.find(e => e.id === epi.employeeId);
                           return (
                              <div key={epi.id} className="bg-white p-8 border border-slate-200 shadow-sm hover:border-slate-900 transition-all group">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-widest py-1 px-2 bg-emerald-50 border border-emerald-100">Certificado Ativo</span>
                                 </div>
                                 <div className="mb-6">
                                    <p className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none mb-1">{epi.item}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">CA: {epi.caNumber}</p>
                                 </div>
                                 <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold uppercase">
                                    <div>
                                       <p className="text-slate-300 mb-1">Operador</p>
                                       <p className="text-slate-900">{emp?.name}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-slate-300 mb-1">Data Fixa</p>
                                       <p className="text-slate-500 font-mono">{new Date(epi.deliveryDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                    </div>
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'legal' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                  {[
                    { title: 'PCMSO 2024', desc: 'Programa de Controle Médico de Saúde Ocupacional', status: 'Ativo', date: '01/01/2024' },
                    { title: 'PGR 2024', desc: 'Programa de Gerenciamento de Riscos e Variações', status: 'Ativo', date: '01/01/2024' },
                    { title: 'LTCAT 2024', desc: 'Laudo Técnico das Condições Ambientais', status: 'Ativo', date: '15/03/2024' },
                    { title: 'Relatório CIPA', desc: 'Comissão Interna de Prevenção de Incidentes', status: 'Arquivado', date: '20/05/2024' }
                  ].map(doc => (
                    <div key={doc.title} className="p-8 bg-white border border-slate-200 shadow-sm hover:border-slate-900 transition-all flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start mb-8">
                             <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             </div>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{doc.status}</span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 mb-2 tracking-tight uppercase italic">{doc.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-8 italic">{doc.desc}</p>
                       </div>
                       <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-slate-300">Vigência {doc.date}</span>
                          <button className="text-blue-600 hover:text-slate-900 transition-colors">Acessar Documento</button>
                       </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
      </div>

      <ASOModal 
         isOpen={isASOModalOpen} 
         onClose={() => setIsASOModalOpen(false)} 
         employees={employees} 
         onSave={(data) => {}} // Integration point for context
      />

      <CertificateModal 
         isOpen={isCertModalOpen} 
         onClose={() => setIsCertModalOpen(false)} 
         employees={employees} 
         onSave={handleCertificate} // Integration point for context
      />
    </div>
  );
};

export default Safety;
