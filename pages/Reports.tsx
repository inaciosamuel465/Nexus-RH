import React, { useState } from 'react';

const Reports: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);

  const reportTypes = [
    { id: 'payroll', title: 'Folha de Pagamento', desc: 'Resumo mensal por departamento e encargos.', icon: '💰' },
    { id: 'turnover', title: 'Taxa de Turnover', desc: 'Análise de retenção e motivos de desligamento.', icon: '📈' },
    { id: 'headcount', title: 'Quadro de Funcionários', desc: 'Evolução do headcount e demographics.', icon: '👥' },
    { id: 'training', title: 'Eficiência de Treinamento', desc: 'ROI e engajamento em cursos corporativos.', icon: '🎓' },
    { id: 'safety', title: 'Saúde e Segurança', desc: 'Relatório de EPIs e exames ocupacionais.', icon: '🛡️' },
    { id: 'ai-analysis', title: 'Análise Preditiva IA', desc: 'Tendências de mercado e clima organizacional.', icon: '🤖' },
  ];

  const handleDownload = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert('Relatório gerado com sucesso! Iniciando download no diretório Nexus.');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Banner de Relatórios Estilizado */}
      <div className="bg-slate-900 border border-slate-200 relative min-h-[200px] flex items-center px-10 overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="Reports"
         />
         <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Centro de Inteligência</h1>
               <p className="text-sm text-slate-400 mt-2 max-w-md font-medium italic">Extração de dados brutos e síntese estatística para tomada de decisão estratégica.</p>
            </div>
            
            <div className="relative z-10 w-full lg:w-auto">
               <div className="bg-white/5 border border-white/10 px-8 py-5 text-right min-w-[280px]">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic">Última Extração Global</p>
                  <p className="text-2xl font-bold text-white tracking-tighter italic">NOVEMBRO / 2024</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportTypes.map((type) => (
          <div key={type.id} className="bg-white border border-slate-100 p-8 shadow-sm group hover:border-slate-900 transition-all flex flex-col h-[380px]">
            <div className="flex justify-between items-start mb-10">
               <div className="text-4xl group-hover:scale-110 transition-transform origin-left">{type.icon}</div>
               <div className="w-8 h-8 rounded-none border border-slate-100 flex items-center justify-center text-[10px] text-slate-300 font-bold group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                  {type.id[0].toUpperCase()}
               </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter italic mb-4">{type.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic mb-auto">
               {type.desc}
            </p>
            
            <div className="pt-8 border-t border-slate-50 mt-auto">
              <button 
                onClick={() => handleDownload(type.id)}
                disabled={generating === type.id}
                className={`w-full py-4 text-[9px] font-bold uppercase tracking-[0.3rem] transition-all italic border ${
                  generating === type.id 
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                  : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {generating === type.id ? 'Gerando Documento...' : 'Extrair Relatório'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Nexus AI Call to Action */}
      <div className="bg-slate-50 border border-slate-200 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 group">
         <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-3xl font-bold italic tracking-tighter uppercase text-slate-900">Necessita de um Report Customizado?</h3>
            <p className="text-slate-500 text-sm font-bold max-w-2xl italic uppercase tracking-widest leading-relaxed">
               Nossa <span className="text-blue-600 underline">Rede Neural AI</span> sintetiza relatórios sob medida baseados em prompts complexos de BI.
            </p>
         </div>
         
         <button className="px-12 py-5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.4rem] hover:bg-blue-600 shadow-xl transition-all italic">
            Ativar Nexus AI BI
         </button>
      </div>
    </div>
  );
};

export default Reports;
