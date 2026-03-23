import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';

const MOCK_TRACKS = [
  { id: 'tr1', name: 'Liderança & Gestão', description: 'Trilha para desenvolvimento de líderes de equipe', targetRole: 'Coordenador', mandatory: true, courseIds: ['c1', 'c2', 'c3'], coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800' },
  { id: 'tr2', name: 'Onboarding Nexus', description: 'Integração obrigatória para novos colaboradores', targetRole: undefined, mandatory: true, courseIds: ['c4', 'c5'], coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800' },
  { id: 'tr3', name: 'Desenvolvimento Técnico', description: 'Aprimoramento de habilidades técnicas específicas', targetRole: 'Engenheiro', mandatory: false, courseIds: ['c6', 'c7', 'c8'], coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'tr4', name: 'Compliance & eSocial', description: 'Treinamentos obrigatórios de conformidade legal', targetRole: undefined, mandatory: true, courseIds: ['c9', 'c10'], coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800' },
];

const MOCK_COURSES = [
  { id: 'c1', name: 'Liderança Situacional', category: 'Desenvolvimento', durationHours: 8, instructor: 'Nexus Academy', isMandatory: false },
  { id: 'c2', name: 'Feedback de Alta Qualidade', category: 'Comportamental', durationHours: 4, instructor: 'Nexus Academy', isMandatory: false },
  { id: 'c3', name: 'Gestão de Conflitos', category: 'Comportamental', durationHours: 6, instructor: 'Nexus Academy', isMandatory: false },
  { id: 'c4', name: 'Cultura e Valores Nexus', category: 'Integração', durationHours: 2, instructor: 'RH Nexus', isMandatory: true },
  { id: 'c5', name: 'Ferramentas e Sistemas', category: 'Técnico', durationHours: 4, instructor: 'TI Nexus', isMandatory: true },
  { id: 'c6', name: 'React & TypeScript Avançado', category: 'Técnico', durationHours: 20, instructor: 'Tech Lead', isMandatory: false },
  { id: 'c7', name: 'APIs REST e Integrações', category: 'Técnico', durationHours: 12, instructor: 'Tech Lead', isMandatory: false },
  { id: 'c8', name: 'Cloud & DevOps Basics', category: 'Técnico', durationHours: 16, instructor: 'Nexus Academy', isMandatory: false },
  { id: 'c9', name: 'eSocial e CLT 2024', category: 'Compliance', durationHours: 4, instructor: 'Nexus RH', isMandatory: true },
  { id: 'c10', name: 'LGPD na Prática', category: 'Compliance', durationHours: 3, instructor: 'Nexus Jurídico', isMandatory: true },
];

const Academy: React.FC = () => {
  const { employees, authenticatedUser } = useHR();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Record<string, number>>({});
  const [showCert, setShowCert] = useState<string | null>(null);

  const enrollInCourse = (courseId: string) => {
    setEnrollments(prev => {
      if (prev[courseId] === undefined) return { ...prev, [courseId]: 0 };
      if (prev[courseId] < 100) return { ...prev, [courseId]: Math.min(prev[courseId] + 25, 100) };
      return prev;
    });
  };

  const currentTrack = selectedTrack ? MOCK_TRACKS.find(t => t.id === selectedTrack) : null;
  const trackCourses = currentTrack ? MOCK_COURSES.filter(c => currentTrack.courseIds.includes(c.id)) : [];

  const completedCount = Object.values(enrollments).filter(p => p === 100).length;
  const totalHours = Object.entries(enrollments).filter(([, p]) => p === 100).reduce((acc, [id]) => {
    const c = MOCK_COURSES.find(c => c.id === id);
    return acc + (c?.durationHours || 0);
  }, 0);

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[220px] flex items-center px-10 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Academy" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Academia Corporativa</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg font-medium italic">Trilhas de aprendizado, cursos e certificações. Desenvolvendo talentos Nexus com excelência.</p>
          </div>
          <div className="flex gap-4">
            {[{ label: 'Cursos Concluídos', val: completedCount }, { label: 'Horas Acumuladas', val: `${totalHours}h` }].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 px-8 py-5 text-center backdrop-blur-md">
                <p className="text-4xl font-bold text-white italic">{s.val}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!selectedTrack ? (
        <div className="space-y-6">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic">Trilhas de Aprendizado Disponíveis</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {MOCK_TRACKS.map(track => {
              const courses = MOCK_COURSES.filter(c => track.courseIds.includes(c.id));
              const trackProgress = track.courseIds.reduce((a, id) => a + (enrollments[id] || 0), 0) / (track.courseIds.length * 100) * 100;
              return (
                <div key={track.id} className="nexus-card p-0 overflow-hidden group cursor-pointer" onClick={() => setSelectedTrack(track.id)}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={track.coverImage} alt={track.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex items-end p-8">
                      {track.mandatory && <span className="text-[9px] font-bold text-white bg-blue-600 px-3 py-1 uppercase tracking-widest italic shadow-lg">Obrigatória</span>}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{track.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-medium italic mb-6 leading-relaxed">{track.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{courses.length} módulos • {courses.reduce((a, c) => a + c.durationHours, 0)}h de carga</span>
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white italic">{Math.round(trackProgress)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]" style={{ width: `${trackProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedTrack(null)} className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Voltar às Trilhas
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">{currentTrack?.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackCourses.map((course, idx) => {
              const progress = enrollments[course.id];
              const completed = progress === 100;
              return (
                <div key={course.id} className={`nexus-card transition-all ${completed ? 'border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10' : ''}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 flex items-center justify-center text-xs font-bold italic shadow-sm ${completed ? 'bg-emerald-600 text-white' : 'bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-400'}`}>{idx + 1}</div>
                      {course.isMandatory && <span className="text-[8px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 px-2 py-1 uppercase tracking-widest italic">Obrigatório</span>}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-2">{course.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic mb-6">{course.category} • {course.durationHours}h • @{course.instructor}</p>
                    
                    {progress !== undefined && (
                      <div className="mb-6">
                        <div className="flex justify-between text-[8px] font-bold uppercase italic text-slate-400 dark:text-slate-600 mb-2">
                          <span>Progresso do Aluno</span><span>{progress}%</span>
                        </div>
                        <div className="h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full transition-all duration-700 ${completed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-900 dark:bg-blue-600 shadow-[0_0_10_rgba(37,99,235,0.4)]'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button onClick={() => enrollInCourse(course.id)} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all italic shadow-md ${completed ? 'bg-emerald-600 text-white' : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-700'}`}>
                        {completed ? '✓ Curso Concluído' : progress !== undefined ? `Continuar (${progress}%)` : 'Iniciar Módulo'}
                      </button>
                      {completed && (
                        <button onClick={() => setShowCert(course.id)} className="px-4 py-4 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm" title="Ver Certificado">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-950 border-8 border-double border-slate-900 dark:border-blue-900/50 p-16 max-w-2xl w-full text-center shadow-2xl animate-slideIn relative">
            <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 font-serif text-8xl opacity-10 select-none">NEXUS</div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em] italic mb-10 leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-4">NEXUS ACADEMY — CERTIFICADO DE EXCELÊNCIA</p>
            <div className="w-20 h-20 bg-slate-900 dark:bg-blue-600 mx-auto mb-10 flex items-center justify-center text-white italic text-3xl font-bold shadow-2xl transform rotate-45"><span className="-rotate-45">N</span></div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-4">{authenticatedUser?.name || 'Colaborador Nexus'}</h2>
            <p className="text-sm text-slate-500 italic mb-8">Concluiu com êxito e mérito técnico o curso</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-10 leading-snug">{MOCK_COURSES.find(c => c.id === showCert)?.name}</h3>
            <div className="flex justify-center gap-12 mb-10">
               <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic mb-1">Carga Horária</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white italic">{MOCK_COURSES.find(c => c.id === showCert)?.durationHours}h</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic mb-1">Data de Emissão</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white italic">{new Date().toLocaleDateString('pt-BR')}</p>
               </div>
            </div>
            <p className="text-[9px] font-mono text-slate-300 dark:text-slate-700 mb-10">VERIFICATION HASH: {Math.random().toString(36).substring(2, 12).toUpperCase()}-NXS-{Date.now()}</p>
            <button onClick={() => setShowCert(null)} className="px-12 py-4 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 transition-all italic shadow-2xl">Fechar Documento</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academy;
