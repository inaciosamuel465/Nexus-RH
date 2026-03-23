import React, { useState, useMemo } from 'react';
import { useHR } from '../context/HRContext';
import { CommunicationPost, PostType, ReactionType } from '../types';

const POST_TYPE_LABELS: Record<PostType, string> = {
  comunicado: 'Comunicado', evento: 'Evento', treinamento: 'Treinamento',
  aviso: 'Aviso', reconhecimento: 'Reconhecimento'
};

const POST_TYPE_COLORS: Record<PostType, string> = {
  comunicado: 'bg-blue-600 text-white', evento: 'bg-purple-600 text-white',
  treinamento: 'bg-emerald-600 text-white', aviso: 'bg-amber-500 text-white',
  reconhecimento: 'bg-slate-900 dark:bg-slate-800 text-white'
};

const REACTION_EMOJIS: Record<ReactionType, string> = { like: '👍', aplauso: '👏', star: '⭐', coração: '❤️' };

const CreatePostModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (p: any) => void; authorId: string; isAdmin: boolean }> = ({ isOpen, onClose, onSave, authorId, isAdmin }) => {
  const [type, setType] = useState<PostType>('comunicado');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduled, setScheduled] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:3001/api/v2/modules/communication/generate-post', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nexus_token')}` },
         body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (data.success) {
         setTitle(data.data.title);
         setContent(data.data.content);
         setType(data.data.type as PostType);
         setImageUrl(data.data.imageUrl);
         setShowAiInput(false);
         setAiPrompt('');
      } else {
         alert('Falha ao gerar postagem com Inteligência Artificial.');
      }
    } catch(e) {
      console.error(e);
      alert('Erro de conexão ao gerar post.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-slideIn">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight">Nova Publicação</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 uppercase tracking-widest italic">Transmissão Corporativa</p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button type="button" onClick={() => setShowAiInput(!showAiInput)} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all italic shadow-lg flex items-center gap-2">
                 <span>✨</span> Gerar com IA
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        {showAiInput && isAdmin && (
          <div className="p-8 pb-0 animate-fadeIn">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 space-y-4">
               <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest italic leading-relaxed">Instrua o Oracle (Gemini 1.5 Pro) sobre o que deseja comunicar. Título, texto e imagem serão gerados automaticamente.</label>
               <div className="flex gap-4">
                  <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Ex: Crie um convite animado para a festa de fim de ano da empresa focando em gratidão e celebração..." className="flex-1 border-b border-purple-200 dark:border-purple-800 bg-transparent py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors placeholder:text-purple-300 dark:placeholder:text-purple-800" disabled={isGenerating} />
                  <button type="button" onClick={handleAIGeneration} disabled={isGenerating || !aiPrompt.trim()} className="px-6 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-purple-700 transition-all disabled:opacity-50 italic shrink-0">
                     {isGenerating ? 'Processando Sinal...' : 'Materializar'}
                  </button>
               </div>
            </div>
          </div>
        )}

        <form className="p-10 space-y-8" onSubmit={(e) => {
          e.preventDefault();
          onSave({ authorId, type, title, content, imageUrl: imageUrl || undefined, scheduledAt: scheduled || undefined, targetDepartments: [], targetRoles: [], createdAt: new Date().toISOString(), reactions: { like: [], aplauso: [], star: [], coração: [] }, comments: [], published: !scheduled });
          onClose(); setTitle(''); setContent(''); setImageUrl(''); setScheduled('');
        }}>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">Tipo de Publicação</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(POST_TYPE_LABELS) as PostType[]).map(t => (
                <button key={t} type="button" onClick={() => setType(t)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all italic ${type === t ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-lg' : 'text-slate-400 dark:text-slate-700 border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-600'}`}>
                  {POST_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">Título</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da publicação..." className="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent py-2 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-blue-600 transition-colors italic" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">Conteúdo</label>
            <textarea required value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Digite o conteúdo da publicação..." className="w-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-4 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-blue-600 transition-colors resize-none font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">URL da Imagem (opcional)</label>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">Agendar para (opcional)</label>
              <input type="datetime-local" value={scheduled} onChange={e => setScheduled(e.target.value)} className="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-colors invert dark:invert-0" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all italic">Cancelar</button>
            <button type="submit" className="flex-[2] py-4 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl italic">
              {scheduled ? 'Agendar Publicação' : 'Publicar Agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: CommunicationPost; employees: any[]; onReact: (postId: string, reaction: ReactionType, userId: string) => void; onComment: (postId: string, comment: string, authorId: string) => void; currentUserId: string }> = ({ post, employees, onReact, onComment, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const author = employees.find(e => e.id === post.authorId);
  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff/60000)}min atrás`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h atrás`;
    return new Date(d).toLocaleDateString('pt-BR');
  };

  const renderContentWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => 
      part.startsWith('@') ? <span key={i} className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">{part}</span> : part
    );
  };

  const handleScheduleMeeting = (name: string) => {
    alert(`Redirecionando para agendamento de reunião com ${name} no calendário interno...`);
  };

  return (
    <div className="nexus-card p-0 overflow-hidden animate-fadeIn">
      <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-xs md:text-sm italic shrink-0 shadow-lg">{author?.name[0]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <p className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase italic tracking-tight truncate max-w-[120px] sm:max-w-none">{author?.name || 'Nexus RH'}</p>
            <span className={`text-[7px] md:text-[8px] font-bold uppercase tracking-widest px-1.5 md:px-2 py-0.5 italic shadow-sm ${POST_TYPE_COLORS[post.type]}`}>{POST_TYPE_LABELS[post.type]}</span>
          </div>
          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{author?.role} • {timeAgo(post.createdAt)}</p>
        </div>
        {post.scheduledAt && !post.published && (
          <span className="hidden sm:inline-block text-[8px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 px-3 py-1 uppercase tracking-widest italic">Agendado</span>
        )}
        <button 
          onClick={() => handleScheduleMeeting(author?.name || 'Autor')}
          className="ml-auto w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all rounded-full shrink-0"
          title="Agendar Reunião 1:1"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
      </div>

      <div className="p-6 md:p-8">
        <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase italic tracking-tight mb-3 md:mb-4">{post.title}</h4>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">{renderContentWithMentions(post.content)}</p>
        {post.imageUrl && (
          <div className="mt-6 md:mt-8 overflow-hidden rounded-sm">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 md:h-72 object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex gap-6">
          {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map(r => (
            <button key={r} onClick={() => onReact(post.id, r, currentUserId)}
              className={`flex items-center gap-2 text-[11px] font-bold transition-all hover:scale-110 ${post.reactions[r]?.includes(currentUserId) ? 'text-blue-600' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}>
              <span className="text-lg">{REACTION_EMOJIS[r]}</span>
              <span>{post.reactions[r]?.length || 0}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowComments(!showComments)} className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors italic flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          {post.comments?.length || 0} comentários
        </button>
      </div>

      {showComments && (
        <div className="border-t border-slate-50 dark:border-slate-800 px-8 pb-8 space-y-4 animate-fadeIn bg-white dark:bg-slate-950">
          {post.comments?.map((c, idx) => {
            const cAuthor = employees.find(e => e.id === c.authorId);
            const authorFirstName = cAuthor?.name.split(' ')[0] || 'Usuário';
            return (
              <div key={idx} className="flex gap-4 pt-6 first:pt-4 group">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-bold italic shrink-0 shadow-sm">{cAuthor?.name[0]}</div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800 relative">
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest italic">{cAuthor?.name}</p>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                       <button onClick={() => handleScheduleMeeting(cAuthor?.name || '')} className="text-[9px] text-slate-400 hover:text-blue-600 flex items-center gap-1 font-bold uppercase tracking-widest"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Ping</button>
                       <button onClick={() => setComment(`@${authorFirstName} `)} className="text-[9px] text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold uppercase tracking-widest"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg> Responder</button>
                     </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{renderContentWithMentions(c.content)}</p>
                </div>
              </div>
            );
          })}
          <div className="flex gap-4 pt-4">
            <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white text-xs font-bold italic shrink-0 shadow-lg">{employees.find(e => e.id === currentUserId)?.name[0]}</div>
            <div className="flex-1 flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Adicionar comentário..." className="flex-1 border-b border-slate-200 dark:border-slate-800 bg-transparent py-1 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-colors" />
              <button onClick={() => { if (comment.trim()) { onComment(post.id, comment, currentUserId); setComment(''); } }} className="px-6 py-2 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all italic shadow-md">Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Communication: React.FC = () => {
  const { employees, authenticatedUser, communicationPosts, addCommunicationPost, reactToPost, commentOnPost } = useHR() as any;
  const [filter, setFilter] = useState<'todos' | PostType>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const posts: CommunicationPost[] = communicationPosts || [];

  const filteredPosts = useMemo(() => {
    const visible = posts.filter(p => p.published);
    if (filter === 'todos') return visible;
    return visible.filter(p => p.type === filter);
  }, [posts, filter]);

  const stats = useMemo(() => ({
    published: posts.filter(p => p.published).length,
    scheduled: posts.filter(p => !p.published).length,
    totalReactions: posts.reduce((a, p) => a + Object.values(p.reactions || {}).flat().length, 0)
  }), [posts]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn pb-20 px-4 md:px-0">
      <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative min-h-[180px] md:min-h-[220px] flex items-center px-6 md:px-10 overflow-hidden text-center lg:text-left">
        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" alt="Communication" />
        <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tighter uppercase italic">Central de Comunicação</h1>
            <p className="text-[10px] md:text-sm text-slate-400 mt-2 max-w-lg font-medium italic">Feed corporativo interno. Publicações, eventos, treinamentos e comunicados da organização.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 md:px-10 py-4 md:py-5 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white shadow-2xl transition-all italic shrink-0 backdrop-blur-sm bg-opacity-90 w-full sm:w-auto">
            Nova Publicação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <aside className="xl:col-span-1 space-y-6">
          <div className="nexus-card p-4 md:p-6">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-4 md:mb-6 border-b border-slate-50 dark:border-slate-800 pb-4 text-center">Filtros do Feed</p>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
              {[
                { key: 'todos', label: 'Tudo' }, 
                { key: 'comunicado', label: 'Comunicados' }, 
                { key: 'evento', label: 'Eventos' }, 
                { key: 'treinamento', label: 'Treinos' }, 
                { key: 'aviso', label: 'Avisos' }, 
                { key: 'reconhecimento', label: 'Elogios' }
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key as any)} className={`w-full text-left px-3 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all italic truncate ${filter === f.key ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl translate-x-1' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="nexus-card p-6">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] italic mb-6 border-b border-slate-50 dark:border-slate-800 pb-4 text-center">Resumo de Atividade</p>
            <div className="space-y-6 px-2">
              {[
                { label: 'Publicados', val: stats.published, icon: '📄' }, 
                { label: 'Agendados', val: stats.scheduled, icon: '⏰' }, 
                { label: 'Reações', val: stats.totalReactions, icon: '❤️' }
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <span className="text-base grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">{s.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white italic tabular-nums">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="xl:col-span-3 space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="py-40 text-center nexus-card flex flex-col items-center justify-center opacity-50 grayscale">
              <div className="w-16 h-16 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-200 dark:text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-[0.5em] italic">Vazio Absoluto</p>
            </div>
          ) : (
            filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(post => (
              <PostCard key={post.id} post={post} employees={employees} currentUserId={authenticatedUser?.id || ''} onReact={(pid, r, uid) => reactToPost?.(pid, r, uid)} onComment={(pid, c, aid) => commentOnPost?.(pid, c, aid)} />
            ))
          )}
        </section>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(p) => addCommunicationPost?.(p)} authorId={authenticatedUser?.id || ''} isAdmin={authenticatedUser?.userRole === 'ADMIN'} />
    </div>
  );
};

export default Communication;
