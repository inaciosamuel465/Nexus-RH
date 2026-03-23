import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const QUESTIONS = [
  { id: 'q1', label: 'O ambiente de trabalho é agradável e produtivo?', dimension: 'ambiente' as const },
  { id: 'q2', label: 'Tenho os recursos necessários para executar meu trabalho?', dimension: 'ambiente' as const },
  { id: 'q3', label: 'Minha liderança me oferece suporte e feedback?', dimension: 'liderança' as const },
  { id: 'q4', label: 'As decisões da liderança são claras e transparentes?', dimension: 'liderança' as const },
  { id: 'q5', label: 'Estou satisfeito com meu crescimento na empresa?', dimension: 'satisfação' as const },
  { id: 'q6', label: 'Me sinto reconhecido pelo trabalho que faço?', dimension: 'satisfação' as const },
  { id: 'q7', label: 'Minha carga de trabalho é equilibrada e gerenciável?', dimension: 'carga' as const },
  { id: 'q8', label: 'Consigo equilibrar minha vida pessoal e profissional?', dimension: 'carga' as const },
];

const DIMENSION_COLORS: Record<string, string> = { ambiente: '#2563eb', liderança: '#4f46e5', satisfação: '#10b981', carga: '#f59e0b' };

const OrgClimate: React.FC = () => {
  const { climateSurveys, addClimateSurveyResponse } = useHR() as any;
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, number>>({});
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const mockSurveyData = useMemo(() => {
    const surveys = climateSurveys || [];
    if (surveys.length > 0) return surveys;
    return [{
      id: 's1', title: 'Pesquisa Q1 2024', startDate: '2024-01-01', endDate: '2024-03-31', active: false,
      responses: Array.from({ length: 12 }, (_, i) => ({
        id: `r${i}`, surveyId: 's1', submittedAt: new Date().toISOString(),
        answers: { q1: 6+Math.round(Math.random()*3), q2: 5+Math.round(Math.random()*4), q3: 7+Math.round(Math.random()*3), q4: 6+Math.round(Math.random()*3), q5: 5+Math.round(Math.random()*4), q6: 6+Math.round(Math.random()*3), q7: 4+Math.round(Math.random()*5), q8: 5+Math.round(Math.random()*4) }
      }))
    }];
  }, [climateSurveys]);

  const stats = useMemo(() => {
    const allResponses = mockSurveyData.flatMap((s: any) => s.responses);
    if (allResponses.length === 0) return null;

    const dimensionScores: Record<string, { total: number; count: number }> = { ambiente: {total:0, count:0}, liderança: {total:0, count:0}, satisfação: {total:0, count:0}, carga: {total:0, count:0} };
    QUESTIONS.forEach(q => {
      allResponses.forEach((r: any) => {
        if (r.answers[q.id]) { dimensionScores[q.dimension].total += r.answers[q.id]; dimensionScores[q.dimension].count++; }
      });
    });

    const radarData = Object.entries(dimensionScores).map(([dim, { total, count }]) => ({
      subject: dim.charAt(0).toUpperCase() + dim.slice(1), A: Math.round((total / count) * 10) / 10, fullMark: 10
    }));

    const barData = QUESTIONS.map(q => {
      const vals = allResponses.map((r: any) => r.answers[q.id] || 0).filter(v => v > 0);
      return { name: q.label.slice(0, 30) + '...', score: Math.round((vals.reduce((a: number, v: number) => a + v, 0) / (vals.length || 1)) * 10) / 10, dimension: q.dimension };
    });

    const overall = Object.values(dimensionScores).reduce((a, { total, count }) => a + total / (count||1), 0) / 4;
    return { radarData, barData, overall: Math.round(overall * 10) / 10, totalResponses: allResponses.length };
  }, [mockSurveyData]);

  const handleSubmitSurvey = () => {
    if (Object.keys(surveyAnswers).length < QUESTIONS.length) return;
    addClimateSurveyResponse?.({ surveyId: 'current', answers: surveyAnswers });
    setSurveySubmitted(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[200px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Climate" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Clima Organizacional</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg italic">Pesquisas anônimas de satisfação e análise de clima interno. Voz dos colaboradores em dados.</p>
          </div>
          {stats && (
            <div className="bg-white/10 border border-white/20 px-8 py-4 text-center backdrop-blur-md">
              <p className="text-5xl font-bold text-white italic tabular-nums">{stats.overall}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">Score Geral /10</p>
              <p className="text-[8px] font-bold text-slate-500 italic">{stats.totalResponses} respostas</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {stats && (
            <>
              <div className="nexus-card p-10">
                <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Radar de Dimensões</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stats.radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                      <Radar name="Clima" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} strokeWidth={2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="nexus-card p-10">
                <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">Score por Pergunta</h3>
                <div className="space-y-6">
                  {stats.barData.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                          <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">{QUESTIONS[i].label}</p>
                          <span className="text-sm font-bold text-slate-900 dark:text-white italic tabular-nums">{item.score}</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                         <div className="h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]" style={{ width: `${item.score * 10}%`, backgroundColor: DIMENSION_COLORS[item.dimension] }}></div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="nexus-card p-8">
            <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
              {surveySubmitted ? '✅ Resposta Registrada' : '📝 Pesquisa Anônima — Atual'}
            </h3>
            {surveySubmitted ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic">Obrigado!</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-600 italic mt-2">Sua resposta anônima foi registrada com sucesso.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {QUESTIONS.map(q => (
                  <div key={q.id}>
                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic mb-3 leading-relaxed">{q.label}</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button key={n} onClick={() => setSurveyAnswers(prev => ({ ...prev, [q.id]: n }))}
                          className={`flex-1 py-2 text-[9px] font-bold border transition-all ${surveyAnswers[q.id] === n ? 'bg-slate-900 dark:bg-blue-600 border-slate-900 dark:border-blue-600 text-white shadow-lg' : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleSubmitSurvey} disabled={Object.keys(surveyAnswers).length < QUESTIONS.length}
                  className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 transition-all disabled:opacity-40 shadow-xl italic mt-4">
                  Enviar Resposta Anônima
                </button>
              </div>
            )}
          </div>

          <div className="nexus-card p-8">
            <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest italic mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">Legenda de Dimensões</h3>
            <div className="space-y-3">
              {Object.entries(DIMENSION_COLORS).map(([dim, color]) => (
                <div key={dim} className="flex items-center gap-3">
                  <div className="w-3 h-3 shrink-0 shadow-sm" style={{ backgroundColor: color }}></div>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">{dim.charAt(0).toUpperCase() + dim.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgClimate;
