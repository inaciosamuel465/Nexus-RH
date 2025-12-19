
import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Candidate, JobOpening } from '../types';
import { analyzeCandidate } from '../services/geminiService';

const JobModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Nova Vaga Estratégica</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-8 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSubmit({
            title: fd.get('title'),
            department: fd.get('department'),
            priority: fd.get('priority'),
            status: 'Open',
            requirements: fd.get('requirements'),
            salaryRange: fd.get('salaryRange'),
            description: fd.get('description')
          });
          onClose();
        }}>
          <div className="space-y-4">
            <input name="title" placeholder="Título da Vaga" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            <div className="grid grid-cols-2 gap-4">
              <input name="department" placeholder="Departamento" required className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
              <select name="priority" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
                <option value="High">Alta Prioridade</option>
                <option value="Medium">Média</option>
                <option value="Low">Baixa</option>
              </select>
            </div>
            <textarea name="requirements" placeholder="Requisitos Técnicos (Para análise de IA)" required className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            <input name="salaryRange" placeholder="Faixa Salarial (Ex: R$ 8k - 10k)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
          </div>
          <button type="submit" className="w-full mt-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">Publicar Vaga</button>
        </form>
      </div>
    </div>
  );
};

const CandidateModal: React.FC<{ isOpen: boolean; onClose: () => void; jobs: JobOpening[]; onSubmit: (data: any) => void }> = ({ isOpen, onClose, jobs, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-slideIn">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
          <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter">Novo Candidato</h3>
          <button onClick={onClose} className="p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg></button>
        </div>
        <form className="p-8 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSubmit({
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            jobId: fd.get('jobId'),
            cvText: fd.get('cvText')
          });
          onClose();
        }}>
          <select name="jobId" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold">
            <option value="">Selecione a Vaga...</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <input name="name" placeholder="Nome do Candidato" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
          <div className="grid grid-cols-2 gap-4">
            <input name="email" type="email" placeholder="Email" required className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
            <input name="phone" placeholder="Telefone" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
          </div>
          <textarea name="cvText" placeholder="Texto do Currículo (para análise de Match)" className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold" />
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Cadastrar Talentos</button>
        </form>
      </div>
    </div>
  );
};

const CandidateDetailsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  candidate: Candidate; 
  job?: JobOpening;
  onHire: (id: string, jId: string) => void;
  onReject: (id: string) => void;
}> = ({ isOpen, onClose, candidate, job, onHire, onReject }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-10 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{candidate.name}</h3>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Candidato para: {job?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        
        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {candidate.aiAnalysis ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-indigo-900 text-white rounded-[2rem] shadow-xl shadow-indigo-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Match Score</p>
                  <p className="text-4xl font-black">{candidate.score}%</p>
                </div>
                <div className="text-right max-w-xs">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Recomendação IA</p>
                  <p className="text-xs font-bold leading-relaxed">{candidate.aiAnalysis.recommendation}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100">
                  <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-4">Fortalezas</h4>
                  <ul className="space-y-1">
                    {candidate.aiAnalysis.strengths.map((s, i) => <li key={i} className="text-xs font-bold text-green-800">• {s}</li>)}
                  </ul>
                </div>
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-4">Gaps</h4>
                  <ul className="space-y-1">
                    {candidate.aiAnalysis.weaknesses.map((w, i) => <li key={i} className="text-xs font-bold text-amber-800">• {w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic font-bold">Solicite análise de IA para ver o perfil completo.</p>
            </div>
          )}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumo do Currículo</h4>
            <p className="text-xs text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">{candidate.cvText}</p>
          </div>
        </div>

        <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex gap-4">
          <button 
            onClick={() => onReject(candidate.id)}
            className="flex-1 py-5 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
          >
            Reprovar
          </button>
          <button 
            onClick={() => onHire(candidate.id, candidate.jobId)}
            className="flex-1 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Efetivar Contratação
          </button>
        </div>
      </div>
    </div>
  );
};

const Recruitment: React.FC = () => {
  const { jobs, candidates, addJob, updateCandidate, addCandidate, hireCandidate, rejectCandidate } = useHR();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCandModalOpen, setIsCandModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const stages = ['Triagem', 'Entrevista RH', 'Teste Técnico', 'Entrevista Gestor', 'Proposta'] as Candidate['stage'][];

  const handleAIAnalysis = async (candidate: Candidate) => {
    const job = jobs.find(j => j.id === candidate.jobId);
    if (!job || !candidate.cvText) return alert("Vaga ou texto do CV ausente.");
    
    setAnalyzingId(candidate.id);
    try {
      const analysis = await analyzeCandidate(candidate.name, candidate.cvText, job.requirements);
      updateCandidate(candidate.id, { 
        score: analysis.score,
        aiAnalysis: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendation: analysis.recommendation
        }
      });
    } catch (e) {
      alert("Erro na análise via Gemini.");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
           </div>
           <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">Nexus Sourcing AI</h2>
              <p className="text-gray-500 font-medium">Pipeline inteligente integrado à admissão digital.</p>
           </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCandModalOpen(true)} className="px-10 py-5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">
            + Novo Candidato
          </button>
          <button onClick={() => setIsJobModalOpen(true)} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            + Abrir Vaga
          </button>
        </div>
      </header>

      {/* Pipeline de Seleção */}
      <section className="space-y-8 overflow-x-auto pb-10 custom-scrollbar">
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3 px-4">
          <span className="w-3 h-8 bg-indigo-600 rounded-full"></span>
          Esteira Ativa de Talentos
        </h3>
        
        <div className="flex gap-8 min-w-[1600px] px-2">
          {stages.map(stage => {
            const list = candidates.filter(c => c.stage === stage);
            return (
              <div key={stage} className="flex-1 bg-gray-50/40 rounded-[3.5rem] p-6 border border-gray-100 min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8 px-6">
                   <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{stage}</h4>
                   <span className="px-3 py-1 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-900 shadow-sm">
                      {list.length}
                   </span>
                </div>
                
                <div className="space-y-6">
                  {list.map(cand => (
                    <div 
                      key={cand.id} 
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                          {cand.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-black text-gray-900 text-sm truncate">{cand.name}</p>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">
                            {jobs.find(j => j.id === cand.jobId)?.title}
                          </p>
                        </div>
                      </div>

                      {cand.score ? (
                        <div className="mb-5 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                          <span className="text-[10px] font-black text-green-700 uppercase italic">Match AI</span>
                          <span className="text-lg font-black text-green-700">{cand.score}%</span>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAIAnalysis(cand); }}
                          disabled={analyzingId === cand.id}
                          className="w-full mb-5 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                          {analyzingId === cand.id ? 'Analisando...' : 'Match IA'}
                        </button>
                      )}

                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                         {stages.indexOf(cand.stage) > 0 && (
                           <button 
                              onClick={() => updateCandidate(cand.id, { stage: stages[stages.indexOf(cand.stage) - 1] })}
                              className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase hover:bg-gray-100"
                            >
                              Recuar
                            </button>
                         )}
                         {stages.indexOf(cand.stage) < stages.length - 1 && (
                           <button 
                              onClick={() => updateCandidate(cand.id, { stage: stages[stages.indexOf(cand.stage) + 1] })}
                              className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black shadow-lg"
                            >
                              Avançar
                            </button>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <JobModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSubmit={addJob} />
      <CandidateModal isOpen={isCandModalOpen} onClose={() => setIsCandModalOpen(false)} jobs={jobs} onSubmit={addCandidate} />
      {selectedCandidate && (
        <CandidateDetailsModal 
          candidate={selectedCandidate}
          job={jobs.find(j => j.id === selectedCandidate.jobId)}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onHire={(id, jid) => { hireCandidate(id, jid); setSelectedCandidate(null); alert('Talento movido para Formalização de Admissão!'); }}
          onReject={(id) => { rejectCandidate(id); setSelectedCandidate(null); }}
        />
      )}
    </div>
  );
};

export default Recruitment;
