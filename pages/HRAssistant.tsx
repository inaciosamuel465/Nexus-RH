import React, { useState, useRef, useEffect } from 'react';
import { useHR } from '../context/HRContext';
import { sendChatMessage } from '../services/geminiService';

// Tipagem básica para Web Speech API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    preview?: string;
  };
}

const QUICK_QUESTIONS = [
  'Quem tem mais faltas este mês?',
  'Funcionários com férias vencidas',
  'Qual o headcount atual por departamento?',
  'Qual o custo total da folha?',
  'Quais são os riscos de turnover?',
  'Gere um resumo executivo do quadro',
];

interface HRAssistantProps {
  embedded?: boolean;
}

const HRAssistant: React.FC<HRAssistantProps> = ({ embedded }) => {
  const { employees, evaluations, timeRecords, payrollHistory, vacationRequests } = useHR();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: 'Olá! Sou o **Assistente Nexus IA**, powered by Google Gemini. Posso responder perguntas sobre dados de RH, analisar contratos, currículos e gerar relatórios estratégicos. Como posso ajudá-lo hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Inicializa o Reconhecimento de Voz
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInput(''); // limpa o input antes de nova fala
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!voiceModeEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    // Remove marcações de markdown e emojis para leitura mais limpa
    const cleanText = text.replace(/[*#]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    
    // Tenta encontrar uma voz mais humanizada do Brasil
    const voices = window.speechSynthesis.getVoices();
    const brVoice = voices.find(v => v.lang === 'pt-BR' && v.name.includes('Google')) || voices.find(v => v.lang === 'pt-BR');
    if (brVoice) utterance.voice = brVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const buildSystemContext = () => {
    const depts = Array.from(new Set(employees.map(e => e.department))).join(', ');
    const totalSalary = employees.reduce((acc, e) => acc + e.salary, 0);
    const pendingVacations = vacationRequests.filter(r => r.status === 'Pendente').length;
    const absences = timeRecords.filter(tr => tr.status === 'Abonado').length;

    return `Você é o Assistente Nexus IA, um especialista em Recursos Humanos com acesso aos dados do sistema Nexus RH.

DADOS ATUAIS DO SISTEMA:
- Total de funcionários: ${employees.length}
- Funcionários ativos: ${employees.filter(e => e.status === 'Ativo').length}
- Funcionários inativos/desligados: ${employees.filter(e => e.status === 'Inativo').length}
- Departamentos: ${depts}
- Folha salarial mensal total: R$ ${totalSalary.toLocaleString('pt-BR')}
- Salário médio: R$ ${employees.length > 0 ? Math.round(totalSalary / employees.length).toLocaleString('pt-BR') : 0}
- Férias pendentes: ${pendingVacations}
- Ausências registradas: ${absences}
- Avaliações de desempenho realizadas: ${evaluations.length}

FUNCIONÁRIOS (resumo):
${employees.slice(0, 15).map(e => `- ${e.name} | ${e.department} | ${e.position} | Status: ${e.status} | Salário: R$ ${e.salary.toLocaleString('pt-BR')}`).join('\n')}
${employees.length > 15 ? '... e mais ' + (employees.length - 15) + ' colaboradores' : ''}

**INSTRUÇÕES IMPORTANTES: TRANSCRIÇÃO DE REUNIÕES**
- Se o usuário enviar um texto grande que aparente ser uma transcrição (fala de reunião), você deve agir como secretário inteligente: gerando um RESUMO EXECUTIVO claro de 1 parágrafo, seguido de uma seção de "ACTION ITEMS" (Tarefas Extratadas) em bullet points, designando responsáveis se citados.

Responda sempre em português do Brasil, de forma clara, objetiva e profissional. Use formatação Markdown quando adequado (**negrito**, listas, etc). Não fale como um robô, mas sim como um parceiro de negócios estratégico.
`;
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleSend = async (msg?: string) => {
    const text = msg || input.trim();
    if (!text && !selectedFile) return;

    const currentFile = selectedFile;
    const currentPreview = filePreview;

    setInput('');
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text || 'Análise de arquivo',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      attachment: currentFile
        ? { name: currentFile.name, type: currentFile.type, preview: currentPreview || undefined }
        : undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      let fileBase64: string | undefined;
      let fileMimeType: string | undefined;

      if (currentFile) {
        fileBase64 = await fileToBase64(currentFile);
        fileMimeType = currentFile.type;
      }

      const response = await sendChatMessage(
        buildSystemContext(),
        text || 'Analise o arquivo enviado sob a perspectiva de RH.',
        fileBase64,
        fileMimeType
      );

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      if (voiceModeEnabled) {
        speakText(response);
      }
    } catch (err: any) {
      console.error('Gemini Error:', err);
      const errorMsg = err?.message || 'Erro desconhecido';
      
      let userFriendlyError = 'Ocorreu um erro ao processar sua solicitação.';
      let assistantResponse = '';

      if (errorMsg.includes('CHAVE_AUSENTE')) {
         userFriendlyError = 'Chave da API não configurada.';
         assistantResponse = '⚠️ **Configuração Necessária**: A chave da API do Gemini não foi encontrada no arquivo `.env`. Adicione `VITE_GEMINI_API_KEY=sua_bit_chave` e reinicie o projeto.';
      } else if (errorMsg.includes('QUOTA_EXCEDIDA')) {
         userFriendlyError = 'Limite de uso da API atingido.';
         assistantResponse = '⚠️ **Limite Atingido**: A cota gratuita da API Gemini foi excedida para esta conta ou região. Tente novamente mais tarde ou use uma chave com faturamento ativado.';
      } else if (errorMsg.includes('ACESSO_NEGADO')) {
         userFriendlyError = 'Acesso à API negado.';
         assistantResponse = '⚠️ **Erro de Permissão**: A chave da API fornecida parece ser inválida ou não tem permissão para usar este modelo.';
      } else {
         assistantResponse = `⚠️ **Erro de Conexão**: Não foi possível conectar ao Gemini. Detalhes: ${errorMsg}`;
      }

      setError(userFriendlyError);

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const renderMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h6 class="font-bold text-xs mt-3 mb-1">$1</h6>')
      .replace(/^## (.*$)/gm, '<h5 class="font-bold text-sm mt-4 mb-1">$1</h5>')
      .replace(/^# (.*$)/gm, '<h4 class="font-bold text-base mt-4 mb-2">$1</h4>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={`flex flex-col animate-fadeIn ${embedded ? 'h-full bg-slate-50 dark:bg-slate-900' : 'h-[calc(100vh-11rem)]'}`}>
      {!embedded && (
        <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 relative flex items-center px-10 py-8 overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
            alt="AI"
          />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Assistente Nexus IA</h1>
              <p className="text-sm text-slate-400 mt-1 italic">Powered by Google Gemini 2.0 Flash &amp; Nexus Data Engine</p>
            </div>
            <div className="ml-auto flex items-center gap-3 bg-black/40 backdrop-blur-sm p-3 border border-slate-700/50">
               <span className="text-[10px] font-bold text-white uppercase tracking-widest italic">{voiceModeEnabled ? 'Voz: Ativada' : 'Voz: Desativada'}</span>
               <button 
                 onClick={() => {
                   setVoiceModeEnabled(!voiceModeEnabled);
                   if (voiceModeEnabled) window.speechSynthesis.cancel();
                 }}
                 className={`w-12 h-6 flex items-center rounded-full transition-colors ${voiceModeEnabled ? 'bg-blue-500' : 'bg-slate-700'} px-1`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${voiceModeEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex items-center gap-3">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto space-y-6 custom-scrollbar px-6 py-4 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 ${embedded ? '' : 'shadow-2xl'}`}>
        {!embedded && (
          <div className="mb-8">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic mb-4">Perguntas Rápidas:</p>
            <div className="flex gap-2 flex-wrap">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isThinking}
                  className="px-4 py-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-blue-600 hover:text-white transition-all italic disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-4 animate-fadeIn ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 shrink-0 flex items-center justify-center font-bold text-[10px] italic shadow-lg ${msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-900 dark:bg-slate-800 text-white'}`}>
              {msg.role === 'assistant' ? 'IA' : 'EU'}
            </div>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`p-5 border transition-all ${msg.role === 'assistant' ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-md' : 'bg-slate-900 dark:bg-blue-900/20 border-slate-800 dark:border-blue-900/50 text-white shadow-xl'}`}>
                {msg.attachment && (
                  <div className="mb-4 border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                    {msg.attachment.preview ? (
                      <img src={msg.attachment.preview} className="w-12 h-12 object-cover" alt="Preview" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">DOC</div>
                    )}
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-bold truncate">{msg.attachment.name}</p>
                      <p className="text-[8px] opacity-50 uppercase tracking-widest">{msg.attachment.type}</p>
                    </div>
                  </div>
                )}
                <div
                  className="text-xs font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                />
              </div>
              <p className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest italic mt-2">
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-4 animate-fadeIn">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] italic shrink-0 shadow-lg">IA</div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex items-center gap-3">
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic ml-2">Gemini processando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedFile && (
        <div className="mx-6 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {filePreview && <img src={filePreview} className="w-8 h-8 object-cover" alt="Selected" />}
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider italic">
              Anexado: {selectedFile.name}
            </span>
          </div>
          <button onClick={() => { setSelectedFile(null); setFilePreview(null); }} className="text-blue-600 hover:text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex gap-2 mt-4 px-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Anexar arquivo/transcrição"
          className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
        
        {!!SpeechRecognition && (
          <button
            onClick={toggleListening}
            title="Ditar para o Assistente (Transcrição Live)"
            className={`p-4 border transition-all ${isListening ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600'}`}
          >
            <svg className="w-6 h-6 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
        )}

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={isListening ? 'Ouvindo... (Fale agora)' : "Cole uma transcrição de reunião, faça uma pergunta ou anexe um documento..."}
          className="flex-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-sm text-slate-900 dark:text-white font-medium outline-none focus:border-blue-600 transition-colors italic placeholder:not-italic placeholder:text-slate-300"
        />
        <button
          onClick={() => handleSend()}
          disabled={(!input.trim() && !selectedFile) || isThinking}
          className="px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-700 transition-all disabled:opacity-40 shadow-xl italic shrink-0"
        >
          {isThinking ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default HRAssistant;
