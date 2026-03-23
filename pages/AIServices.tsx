import React, { useState, useRef } from 'react';
import { analyzeCandidateMultimodal, summarizeContract, getStrategicInsights } from '../services/geminiService';
import { useHR } from '../context/HRContext';

const AIServices: React.FC = () => {
  const { employees } = useHR();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'recruitment' | 'contracts' | 'strategy'>('recruitment');
  
  // States para Recrutamento
  const [jobReq, setJobReq] = useState('');
  const [cvText, setCvText] = useState('');
  const [cvImage, setCvImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // States para Contratos
  const [contractImage, setContractImage] = useState<string | null>(null);
  const [contractSummary, setContractSummary] = useState<string>('');

  // States para Estratégia
  const [strategicInsights, setStrategicInsights] = useState<string>('');
  
  // Geral
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'cv' | 'contract') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'cv') setCvImage(reader.result as string);
        else setContractImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processRecruitment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeCandidateMultimodal(jobReq, cvText, cvImage || undefined);
      if (typeof res === 'string' && res.includes('ERRO')) {
         setError(res);
         setAnalysisResult(null);
      } else {
         setAnalysisResult(res);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado na análise.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processContract = async () => {
    if (!contractImage) return;
    setLoading(true);
    setError(null);
    try {
      const res = await summarizeContract(contractImage);
      if (res.includes('ERRO') || res.includes('QUOTA') || res.includes('CHAVE')) {
         setError(res);
         setContractSummary('');
      } else {
         setContractSummary(res || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao ler documento.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processStrategy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = JSON.stringify(employees);
      const res = await getStrategicInsights(data);
      if (res.includes('ERRO') || res.includes('QUOTA') || res.includes('CHAVE')) {
         setError(res);
         setStrategicInsights('');
      } else {
         setStrategicInsights(res || '');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao gerar insights.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de IA Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[220px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="AI Services"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Nexus AI Engine</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium">Processamento inteligente de documentos, análise preditiva de candidatos e inteligência estratégica multimodal.</p>
            </div>
            
            <div className="flex bg-white/10 backdrop-blur-md p-1 border border-white/20">
              {[
                { id: 'recruitment', label: 'Talent Match' },
                { id: 'contracts', label: 'Análise de Docs' },
                { id: 'strategy', label: 'Inights RH' }
              ].map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setMode(t.id as any)} 
                  className={`px-6 py-2 text-[9px] font-bold uppercase tracking-widest transition-all ${mode === t.id ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-5 space-y-8">
          {mode === 'recruitment' && (
            <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 animate-fadeIn">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Perfil da Vaga</label>
                  <textarea 
                    value={jobReq}
                    onChange={(e) => setJobReq(e.target.value)}
                    className="w-full h-32 border-b border-slate-200 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 transition-colors resize-none placeholder:text-slate-300"
                    placeholder="Cole aqui os requisitos da vaga..."
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Currículo do Candidato</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-32 border border-slate-200 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${cvImage ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}`}
                  >
                    <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileUpload(e, 'cv')} accept="image/*,application/pdf" />
                    {cvImage ? (
                      <div className="text-center">
                         <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Documento Carregado</p>
                      </div>
                    ) : (
                      <div className="text-center">
                         <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Upload de PDF ou Imagem</p>
                      </div>
                    )}
                  </div>
                  <textarea 
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    className="w-full h-24 border-b border-slate-200 py-2 text-xs text-slate-500 outline-none focus:border-blue-600 transition-colors resize-none placeholder:text-slate-300"
                    placeholder="Ou cole o texto do currículo aqui..."
                  />
               </div>

               <button 
                 onClick={processRecruitment}
                 disabled={loading || (!jobReq && !cvText && !cvImage)}
                 className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-30"
               >
                 {loading ? 'Processando...' : 'Analisar Candidato'}
               </button>
            </div>
          )}

          {mode === 'contracts' && (
            <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6 animate-fadeIn">
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-80 border border-slate-200 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${contractImage ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}`}
               >
                  <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileUpload(e, 'contract')} accept="image/*,application/pdf" />
                  {contractImage ? (
                    <img src={contractImage} alt="Preview" className="w-full h-full object-cover opacity-60 grayscale" />
                  ) : (
                    <div className="text-center">
                       <svg className="w-10 h-10 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center px-10">Upload de Contrato ou Documento para Análise</p>
                    </div>
                  )}
               </div>

               <button 
                 onClick={processContract}
                 disabled={loading || !contractImage}
                 className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-30"
               >
                 {loading ? 'Lendo Documento...' : 'Gerar Resumo Estratégico'}
               </button>
            </div>
          )}

          {mode === 'strategy' && (
            <div className="bg-white border border-slate-200 p-10 shadow-sm space-y-6 animate-fadeIn">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Análise de Dados RH</h3>
               </div>
               
               <p className="text-slate-500 text-sm leading-relaxed font-medium">
                 O Nexus AI analisará o perfil de {employees.length} colaboradores para identificar padrões, riscos de turnover e oportunidades de sucessão interna.
               </p>

               <div className="p-6 bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400">Dataset Status</span>
                  <span className="text-[9px] font-bold uppercase text-emerald-600">Sincronizado</span>
               </div>

               <button 
                 onClick={processStrategy}
                 disabled={loading}
                 className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-30"
               >
                 {loading ? 'Analisando...' : 'Gerar Relatório de Insights'}
               </button>
            </div>
          )}
        </div>

        <div className="xl:col-span-7">
          <div className="bg-white border border-slate-200 min-h-[600px] shadow-sm p-10 relative overflow-hidden flex flex-col">
             {error && (
               <div className="mb-6 p-4 bg-red-50 border border-red-100 flex items-center gap-3 animate-fadeIn">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-none mb-1">Erro na Operação AI</p>
                    <p className="text-[11px] text-red-500 font-medium italic">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
             )}

             {!loading && !analysisResult && !contractSummary && !strategicInsights && (
               <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-slate-50 flex items-center justify-center border border-slate-100 mb-8">
                     <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Central de Inteligência</h4>
                  <p className="text-slate-400 font-medium max-w-sm mt-4 text-xs">Selecione uma modalidade de análise à esquerda para começar o processamento.</p>
               </div>
             )}

             {loading && (
               <div className="flex-1 flex flex-col items-center justify-center py-20 animate-pulse">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor de IA em operação...</p>
               </div>
             )}

             {analysisResult && mode === 'recruitment' && (
               <div className="animate-fadeIn space-y-10">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Afinidade com a Vaga</p>
                        <h4 className="text-7xl font-bold text-slate-900 tabular-nums">{analysisResult.score}<span className="text-2xl text-slate-300 ml-1">%</span></h4>
                     </div>
                     <div className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border ${analysisResult.score > 70 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        {analysisResult.score > 70 ? 'Recomendado' : 'Atenção'}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Pontos Fortes</h5>
                        <div className="space-y-3">
                           {analysisResult.strengths?.map((s: string, i: number) => (
                             <div key={i} className="flex gap-3 text-xs text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4 py-1">
                                {s}
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gaps Identificados</h5>
                        <div className="space-y-3">
                           {analysisResult.weaknesses?.map((w: string, i: number) => (
                             <div key={i} className="flex gap-3 text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4 py-1">
                                {w}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-900 p-8 text-white shadow-lg">
                     <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 italic">Conclusão Nexus AI</h5>
                     <p className="font-medium italic leading-relaxed text-sm">
                        "{analysisResult.recommendation}"
                     </p>
                  </div>
               </div>
             )}

             {contractSummary && mode === 'contracts' && (
               <div className="animate-fadeIn space-y-10">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Resumo Analítico do Documento</h4>
                  </div>
                  <div className="bg-slate-50 p-8 border border-slate-100 leading-relaxed text-slate-600 text-sm italic whitespace-pre-wrap">
                     {contractSummary}
                  </div>
               </div>
             )}

             {strategicInsights && mode === 'strategy' && (
               <div className="animate-fadeIn space-y-10">
                  <div className="bg-slate-900 p-10 text-white shadow-xl relative overflow-hidden group">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8 border-b border-white/10 pb-4">Nexus Strategy Insight v2</h4>
                     <div className="whitespace-pre-wrap font-medium text-sm leading-relaxed italic">
                        {strategicInsights}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 px-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="h-0.5 bg-slate-100 overflow-hidden">
                           <div className="h-full bg-blue-600 w-full opacity-30 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                        </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIServices;
