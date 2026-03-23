import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Candidate, JobOpening } from '../types';
import { analyzeCandidate } from '../services/geminiService';

const JobModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Publicar Nova Vaga</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Abertura de Processo Seletivo</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
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
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Título da Vaga</label>
              <input name="title" placeholder="Ex: Desenvolvedor Senior" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Departamento</label>
                <input name="department" placeholder="Ex: Tecnologia" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Prioridade</label>
                <select name="priority" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                  <option value="High">Urgente</option>
                  <option value="Medium">Média</option>
                  <option value="Low">Baixa</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Requisitos Técnicos (Base para IA)</label>
              <textarea name="requirements" placeholder="Descreva as competências fundamentais..." required className="w-full h-24 border border-slate-200 p-4 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors resize-none bg-transparent" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Faixa Salarial Estimada</label>
              <input name="salaryRange" placeholder="Ex: R$ 8.000 - R$ 12.000" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors font-bold bg-transparent" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10">Sincronizar Vaga no Pipeline</button>
        </form>
      </div>
    </div>
  );
};

const CandidateModal: React.FC<{ isOpen: boolean; onClose: () => void; jobs: JobOpening[]; onSubmit: (data: any) => void }> = ({ isOpen, onClose, jobs, onSubmit }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Registrar Candidato</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none">Entrada de Novos Performance Makers</p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onSubmit({
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            jobId: fd.get('jobId'),
            cvText: fd.get('cvText'),
            stage: 'Triagem'
          });
          onClose();
        }}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Vaga de Aplicação</label>
              <select name="jobId" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent">
                <option value="">Selecione...</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <input name="name" placeholder="Ex: Maria Souza" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                <input name="email" type="email" placeholder="maria@email.com" required className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contato/Link</label>
                <input name="phone" placeholder="(00) 00000-0000" className="w-full border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors bg-transparent" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Curriculum Vitae (Markdown/Texto)</label>
              <textarea name="cvText" placeholder="Insira o texto para análise neural..." className="w-full h-32 border border-slate-200 p-4 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors resize-none bg-transparent" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all">Adicionar ao Fluxo de Avaliação</button>
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-none w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white text-xl font-bold">
              {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{candidate.name}</h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Candidatura: {job?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" /></svg>
          </button>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          {candidate.aiAnalysis ? (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 text-blue-600/20">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                 </div>
                 <div className="flex justify-between items-center mb-6 relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nexus Match Affinity Score</p>
                    <p className="text-5xl font-bold text-blue-500 italic tracking-tighter">{candidate.score}%</p>
                 </div>
                 <p className="text-sm font-medium leading-relaxed italic text-slate-300 relative z-10">"{candidate.aiAnalysis.recommendation}"</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-emerald-50 border border-emerald-100">
                   <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-4 italic">Core Competencies</h4>
                   <ul className="space-y-2">
                     {candidate.aiAnalysis.strengths.map((s, i) => (
                        <li key={i} className="text-[11px] font-bold text-emerald-900 flex gap-2"><span className="text-emerald-500">/</span> {s}</li>
                     ))}
                   </ul>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-100">
                   <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-4 italic">Development Gaps</h4>
                   <ul className="space-y-2">
                     {candidate.aiAnalysis.weaknesses.map((w, i) => (
                        <li key={i} className="text-[11px] font-bold text-slate-700 flex gap-2"><span className="text-slate-300">/</span> {w}</li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 italic text-slate-400 text-xs uppercase tracking-widest font-bold">
               Aguardando Processamento Neural para este Perfil
            </div>
          )}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-1 underline decoration-slate-200 underline-offset-8">Dados do Curriculum Vitae</h4>
            <div className="text-xs text-slate-600 bg-slate-50 p-8 border border-slate-100 leading-wider whitespace-pre-wrap font-medium">
               {candidate.cvText}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex gap-4 bg-white">
          <button onClick={() => onReject(candidate.id)} className="flex-1 py-4 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest transition-all">Descartar Unidade</button>
          <button onClick={() => onHire(candidate.id, candidate.jobId)} className="flex-[2] py-4 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl">Aprovar para Admissão</button>
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
    if (!job || !candidate.cvText) return alert("Parâmetros de dados insuficientes para análise.");
    
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
      alert("Falha crítica no processamento neural.");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Recrutamento Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Recruitment"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Arquitetura de Talentos</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">Pipeline inteligente para identificação, mapeamento e onboarding estratégico de capital humano.</p>
            </div>
            
            <div className="flex gap-4">
               <button onClick={() => setIsCandModalOpen(true)} className="px-6 py-3 border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">Novo Candidato</button>
               <button onClick={() => setIsJobModalOpen(true)} className="px-8 py-3 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-blue-500/10">Abrir Nova Vaga</button>
            </div>
         </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 px-1 custom-scrollbar scroll-smooth">
        {stages.map(stage => {
          const list = candidates.filter(c => c.stage === stage);
          return (
            <div key={stage} className="min-w-[320px] w-[320px] bg-white border border-slate-200 flex flex-col min-h-[600px] shadow-sm">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                 <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">{stage}</h4>
                 <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold">{list.length}</span>
              </div>
              
              <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50/30">
                {list.length === 0 ? (
                  <div className="py-20 text-center opacity-30 mt-10">
                    <p className="text-[8px] font-bold uppercase tracking-widest">Nenhuma unidade nesta fase</p>
                  </div>
                ) : (
                  list.map(cand => (
                    <div 
                      key={cand.id} 
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-white p-6 border border-slate-200 hover:border-blue-600 transition-all cursor-pointer group shadow-sm flex flex-col justify-between min-h-[160px]"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-[9px] group-hover:bg-slate-900 group-hover:text-white transition-all">
                          {cand.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-slate-900 text-xs tracking-tight truncate group-hover:text-blue-600 transition-colors uppercase italic">{cand.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 truncate uppercase mt-0.5">
                            {jobs.find(j => j.id === cand.jobId)?.title}
                          </p>
                        </div>
                      </div>

                      {cand.score ? (
                        <div className="flex items-center justify-between py-3 border-t border-slate-50">
                           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Nexus Affinity</span>
                           <span className="text-sm font-bold text-blue-600 italic">{cand.score}%</span>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAIAnalysis(cand); }}
                          disabled={analyzingId === cand.id}
                          className="w-full py-2 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                        >
                          {analyzingId === cand.id ? 'Fusing Data...' : 'Neural Check'}
                        </button>
                      )}

                      <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                         {stages.indexOf(cand.stage) > 0 && (
                           <button 
                              onClick={() => updateCandidate(cand.id, { stage: stages[stages.indexOf(cand.stage) - 1] })}
                              className="flex-1 py-1.5 border border-slate-100 text-slate-300 text-[8px] font-bold uppercase hover:text-slate-900 hover:border-slate-900 transition-all"
                            >
                              Recuar
                            </button>
                         )}
                         {stages.indexOf(cand.stage) < stages.length - 1 && (
                           <button 
                              onClick={() => updateCandidate(cand.id, { stage: stages[stages.indexOf(cand.stage) + 1] })}
                              className="flex-[2] py-1.5 bg-slate-100 border border-slate-200 text-slate-900 text-[8px] font-bold uppercase hover:bg-slate-900 hover:text-white transition-all"
                            >
                              Avançar
                            </button>
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <JobModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSubmit={addJob} />
      <CandidateModal isOpen={isCandModalOpen} onClose={() => setIsCandModalOpen(false)} jobs={jobs} onSubmit={addCandidate} />
      {selectedCandidate && (
        <CandidateDetailsModal 
          candidate={selectedCandidate}
          job={jobs.find(j => j.id === selectedCandidate.jobId)}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onHire={(id, jid) => { hireCandidate(id, jid); setSelectedCandidate(null); }}
          onReject={(id) => { rejectCandidate(id); setSelectedCandidate(null); }}
        />
      )}
    </div>
  );
};

export default Recruitment;
