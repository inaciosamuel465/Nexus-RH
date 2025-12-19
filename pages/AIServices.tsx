
import React, { useState } from 'react';
import { analyzeCandidate, getHRInsights } from '../services/geminiService';
import { MOCK_EMPLOYEES } from '../constants';

const AIServices: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cvText, setCvText] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [strategicInsights, setStrategicInsights] = useState<string>('');

  const handleAnalyze = async () => {
    if (!cvText || !jobRequirements) return;
    setLoading(true);
    try {
      const result = await analyzeCandidate("Candidato Exemplo", cvText, jobRequirements);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetInsights = async () => {
    setLoading(true);
    try {
      const data = JSON.stringify(MOCK_EMPLOYEES);
      const res = await getHRInsights(data);
      setStrategicInsights(res || 'Não foi possível gerar insights.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Nexus AI <span className="text-blue-600">Intelligence</span></h2>
        <p className="text-gray-500">Utilize inteligência artificial generativa para transformar o seu RH em uma unidade estratégica.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CV Analyzer Tool */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold">Analisador de Candidatos Inteligente</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Requisitos da Vaga</label>
              <textarea 
                className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Ex: Desenvolvedor React Sênior com 5 anos de experiência..."
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Conteúdo do Currículo (Texto)</label>
              <textarea 
                className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Cole aqui o texto do currículo do candidato..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Analisando...' : 'Iniciar Análise por IA'}
            </button>
          </div>

          {analysisResult && (
            <div className="mt-8 p-6 bg-gray-900 text-white rounded-3xl space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400 uppercase">Match Score</span>
                <span className={`text-3xl font-black ${analysisResult.score > 70 ? 'text-green-400' : 'text-amber-400'}`}>
                  {analysisResult.score}%
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2 text-blue-400">Pontos Fortes</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  {analysisResult.strengths?.map((s: string) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <p className="text-sm italic text-gray-300">"{analysisResult.recommendation}"</p>
            </div>
          )}
        </section>

        {/* Strategic Insights Tool */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h3 className="text-xl font-bold">Insights Estratégicos de RH</h3>
          </div>
          
          <div className="p-6 bg-indigo-50 rounded-3xl mb-6">
            <p className="text-sm text-indigo-700 leading-relaxed mb-6">
              Esta ferramenta analisa os dados atuais dos seus colaboradores (Headcount, Turnover, Salários) para propor ações de melhoria no clima e retenção.
            </p>
            <button 
              onClick={handleGetInsights}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Processando dados...' : 'Gerar Insights para Diretoria'}
            </button>
          </div>

          {strategicInsights && (
            <div className="bg-white border-2 border-indigo-100 p-6 rounded-3xl prose prose-sm animate-fadeIn">
              <h4 className="text-indigo-900 font-bold mb-4">Recomendações da IA:</h4>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {strategicInsights}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AIServices;
