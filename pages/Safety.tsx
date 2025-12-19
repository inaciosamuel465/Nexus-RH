
import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { HealthRecord, MedicalCertificate, EPIRecord, Employee, HealthRecordType } from '../types';

const CertificateModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: Employee[]; onSave: (data: any) => void }> = ({ isOpen, onClose, employees, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 bg-red-50/50 text-red-900 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Registrar Atestado Médico</h3>
            <p className="text-[10px] font-black text-red-400 mt-1 uppercase tracking-widest">Protocolo de Saúde do Trabalho</p>
          </div>
          <button onClick={onClose} className="p-2 text-red-300 hover:bg-red-100 rounded-full"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-10 space-y-6" onSubmit={(e) => {
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
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Colaborador</label>
                <select name="employeeId" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                   <option value="">Selecione...</option>
                   {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Data Início</label>
                   <input name="startDate" type="date" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Data Fim</label>
                   <input name="endDate" type="date" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <input name="doctor" required placeholder="Nome do Médico" className="px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
                <input name="crm" required placeholder="CRM/UF" className="px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
             </div>
             <textarea name="reason" placeholder="Motivo do Afastamento (Descrição do Atestado)" required className="w-full h-24 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
             <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer">
                <input name="abono" type="checkbox" className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span className="text-xs font-black text-gray-600 uppercase tracking-tight">Abonar horas no ponto eletrônico</span>
             </label>
          </div>
          <button type="submit" className="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Protocolar Documento</button>
        </form>
      </div>
    </div>
  );
};

const ASOModal: React.FC<{ isOpen: boolean; onClose: () => void; employees: Employee[]; onSave: (data: any) => void }> = ({ isOpen, onClose, employees, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 bg-blue-50/50 text-blue-900 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Lançar Exame Ocupacional (ASO)</h3>
            <p className="text-[10px] font-black text-blue-400 mt-1 uppercase tracking-widest">Controle PCMSO / eSocial S-2220</p>
          </div>
          <button onClick={onClose} className="p-2 text-blue-300 hover:bg-blue-100 rounded-full"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-10 space-y-6" onSubmit={(e) => {
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
             <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Colaborador</label>
                <select name="employeeId" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                   <option value="">Selecione...</option>
                   {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.registration})</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Tipo de Exame</label>
                   <select name="type" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                      <option>Admissional</option>
                      <option>Periódico</option>
                      <option>Demissional</option>
                      <option>Retorno ao Trabalho</option>
                      <option>Mudança de Função</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Data do Exame</label>
                   <input name="date" type="date" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Parecer Final</label>
                   <select name="status" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                      <option>Apto</option>
                      <option>Inapto</option>
                      <option>Apto com Restrições</option>
                   </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Próximo Exame</label>
                   <input name="nextExam" type="date" required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
                </div>
             </div>
             <input name="doctor" required placeholder="Nome do Médico Examinador" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
             <textarea name="notes" placeholder="Observações e Recomendações" className="w-full h-20 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
          </div>
          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Registrar ASO</button>
        </form>
      </div>
    </div>
  );
};

const Safety: React.FC = () => {
  const { 
    employees, healthRecords, medicalCertificates, epiRecords, 
    addHealthRecord, addMedicalCertificate, handleCertificate, addEPIRecord, deleteHealthRecord 
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
    <div className="space-y-10 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Saúde & Segurança</h2>
            <p className="text-gray-500 font-medium mt-2">Monitoramento PCMSO, PPRA e conformidade eSocial.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsASOModalOpen(true)} className="px-10 py-5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Novo ASO</button>
           <button onClick={() => setIsCertModalOpen(true)} className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Registrar Atestado</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className={`p-8 rounded-[3rem] border transition-all ${stats.expiredASOs > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ASOs Vencidos</p>
            <p className={`text-4xl font-black ${stats.expiredASOs > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.expiredASOs}</p>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-red-500" style={{ width: `${(stats.expiredASOs / (employees.length || 1)) * 100}%` }}></div>
            </div>
         </div>
         <div className={`p-8 rounded-[3rem] border transition-all ${stats.pendingCerts > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-100 shadow-sm'}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atestados Pendentes</p>
            <p className={`text-4xl font-black ${stats.pendingCerts > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{stats.pendingCerts}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-2">Aguardando validação RH</p>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Colab. Afastados</p>
            <p className="text-4xl font-black text-indigo-600">{stats.awayCount}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-2">Prazos previdenciários ativos</p>
         </div>
         <div className="bg-gray-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Compliance EPI</p>
            <p className="text-4xl font-black">{stats.epiCompliance}%</p>
            <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: '98%' }}></div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
            <button onClick={() => setActiveTab('aso')} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'aso' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Monitoramento de ASOs</button>
            <button onClick={() => setActiveTab('certificates')} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'certificates' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Atestados Médicos</button>
            <button onClick={() => setActiveTab('epi')} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'epi' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Controle de EPIs</button>
            <button onClick={() => setActiveTab('legal')} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'legal' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Documentação Legal</button>
         </div>

         <div className="p-8">
            {activeTab === 'aso' && (
               <div className="overflow-x-auto animate-fadeIn">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                           <th className="px-8 py-6">Colaborador</th>
                           <th className="px-8 py-6">Tipo de Exame</th>
                           <th className="px-8 py-6">Realizado em</th>
                           <th className="px-8 py-6">Status Parecer</th>
                           <th className="px-8 py-6">Próximo Exame</th>
                           <th className="px-8 py-6 text-right">Ações</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {healthRecords.map(h => {
                           const emp = employees.find(e => e.id === h.employeeId);
                           const isExpired = new Date(h.nextExam) < new Date();
                           return (
                              <tr key={h.id} className="hover:bg-gray-50 group">
                                 <td className="px-8 py-6">
                                    <p className="font-black text-sm text-gray-900 leading-none">{emp?.name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">#{emp?.registration}</p>
                                 </td>
                                 <td className="px-8 py-6 text-xs font-bold text-gray-600">{h.type}</td>
                                 <td className="px-8 py-6 text-xs font-bold text-gray-500">{new Date(h.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                 <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                                       h.status === 'Apto' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                    }`}>{h.status}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`text-xs font-black ${isExpired ? 'text-red-600 underline decoration-2' : 'text-gray-900'}`}>{new Date(h.nextExam + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button onClick={() => deleteHealthRecord(h.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
                     <div className="py-24 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <p className="text-gray-300 font-black uppercase tracking-widest italic">Nenhum atestado registrado no sistema.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {medicalCertificates.map(c => {
                           const emp = employees.find(e => e.id === c.employeeId);
                           return (
                              <div key={c.id} className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all flex flex-col justify-between">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner">{emp?.name[0]}</div>
                                       <div>
                                          <p className="font-black text-gray-900 leading-none mb-1">{emp?.name}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase">{c.doctorName} &bull; CRM {c.crm}</p>
                                       </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                       c.status === 'Validado' ? 'bg-green-50 text-green-600 border-green-100' :
                                       c.status === 'Rejeitado' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                    }`}>{c.status}</span>
                                 </div>
                                 <div className="bg-white p-6 rounded-[2rem] border border-gray-100 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Período de Ausência</span>
                                       <span className="text-xs font-black text-red-600">{c.days} Dias</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">{new Date(c.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(c.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                    <p className="mt-4 text-xs italic text-gray-500 leading-relaxed">"{c.reason}"</p>
                                 </div>
                                 {c.status === 'Pendente' && (
                                    <div className="flex gap-4">
                                       <button onClick={() => handleCertificate(c.id, 'Rejeitado')} className="flex-1 py-4 border border-red-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Rejeitar</button>
                                       <button onClick={() => handleCertificate(c.id, 'Validado')} className="flex-[2] py-4 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-xl shadow-gray-200 transition-all">Validar e Abonar</button>
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
               <div className="space-y-10 animate-fadeIn">
                  <div className="flex justify-between items-center px-4">
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Inventário de Equipamentos de Proteção</h3>
                     <button onClick={() => {
                        const item = prompt("Nome do Item (EPI):");
                        const ca = prompt("Certificado de Aprovação (CA):");
                        if(item && ca) addEPIRecord({ employeeId: employees[0].id, item, caNumber: ca, deliveryDate: new Date().toISOString().split('T')[0], validityMonths: 12 });
                     }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">+ Registrar Entrega</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {epiRecords.length === 0 ? (
                        <div className="col-span-3 py-24 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                           <p className="text-gray-300 font-black uppercase tracking-widest italic">Nenhum EPI registrado em posse de colaboradores.</p>
                        </div>
                     ) : (
                        epiRecords.map(epi => {
                           const emp = employees.find(e => e.id === epi.employeeId);
                           return (
                              <div key={epi.id} className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 flex flex-col gap-4">
                                 <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[8px] font-black uppercase">Vigente</span>
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900 leading-none mb-1">{epi.item}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CA: {epi.caNumber}</p>
                                 </div>
                                 <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <div>
                                       <p className="text-[8px] font-black text-gray-400 uppercase">Posse</p>
                                       <p className="text-[11px] font-bold text-gray-700">{emp?.name}</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500">Entregue: {new Date(epi.deliveryDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
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
                    { title: 'PCMSO 2024', desc: 'Programa de Controle Médico de Saúde Ocupacional', status: 'Vigente', date: '01/01/2024' },
                    { title: 'PPRA / PGR 2024', desc: 'Programa de Gerenciamento de Riscos', status: 'Vigente', date: '01/01/2024' },
                    { title: 'LTCAT Atualizado', desc: 'Laudo Técnico das Condições Ambientais', status: 'Vigente', date: '15/03/2024' },
                    { title: 'Relatório CIPA', desc: 'Comissão Interna de Prevenção de Acidentes', status: 'Arquivo', date: '20/05/2024' }
                  ].map(doc => (
                    <div key={doc.title} className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[8px] font-black uppercase">{doc.status}</span>
                       </div>
                       <h4 className="text-lg font-black text-gray-900 leading-tight mb-2">{doc.title}</h4>
                       <p className="text-xs text-gray-500 font-medium mb-6">{doc.desc}</p>
                       <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-gray-400 uppercase italic">Publicado em {doc.date}</span>
                          <button className="text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline">Download PDF</button>
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
         onSave={addHealthRecord} 
      />

      <CertificateModal 
         isOpen={isCertModalOpen} 
         onClose={() => setIsCertModalOpen(false)} 
         employees={employees} 
         onSave={addMedicalCertificate} 
      />
    </div>
  );
};

export default Safety;
