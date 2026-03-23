
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { MOCK_EMPLOYEES, DEFAULT_ONBOARDING_TASKS, MOCK_JOBS, MOCK_CANDIDATES, MOCK_TIME_RECORDS, MOCK_BENEFITS, MOCK_HEALTH_RECORDS } from '../constants';
import { 
  Employee, JobOpening, Candidate, TimeRecord, VacationRequest, Benefit, 
  EmployeeBenefit, MonthlyPayroll, PayrollEvent, ManualEntry, Training, 
  EmployeeTraining, TrainingRequest, ContractType, PerformanceEvaluation,
  HealthRecord, MedicalCertificate, EPIRecord,
  CommunicationPost, ReactionType, PostComment, Recognition
} from '../types';

interface HRContextType {
  employees: Employee[];
  jobs: JobOpening[];
  candidates: Candidate[];
  timeRecords: TimeRecord[];
  vacationRequests: VacationRequest[];
  benefits: Benefit[];
  employeeBenefits: EmployeeBenefit[];
  payrollHistory: MonthlyPayroll[];
  manualEntries: ManualEntry[];
  trainings: Training[];
  employeeTrainings: EmployeeTraining[];
  trainingRequests: TrainingRequest[];
  evaluations: PerformanceEvaluation[];
  healthRecords: HealthRecord[];
  medicalCertificates: MedicalCertificate[];
  epiRecords: EPIRecord[];
  authenticatedUser: Employee | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addEmployee: (employee: any) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  addJob: (job: Omit<JobOpening, 'id'>) => void;
  updateJob: (id: string, data: Partial<JobOpening>) => void;
  addCandidate: (candidate: any) => void;
  updateCandidate: (id: string, data: Partial<Candidate>) => void;
  hireCandidate: (candidateId: string, jobId: string) => void;
  rejectCandidate: (candidateId: string) => void;
  punchTime: (type: TimeRecord['type'], location?: string) => void;
  requestAdjustment: (data: any) => void;
  approveTimeRecord: (id: string) => void;
  rejectTimeRecord: (id: string, notes: string) => void;
  requestVacation: (req: any) => void;
  approveVacation: (id: string) => void;
  rejectVacation: (id: string) => void;
  scheduleCollectiveVacation: (employeeIds: string[], startDate: string, endDate: string) => void;
  addBenefit: (benefit: any) => void;
  updateBenefit: (id: string, data: Partial<Benefit>) => void;
  removeBenefit: (id: string) => void;
  enrollEmployeeInBenefit: (employeeId: string, benefitId: string, cardNumber?: string) => void;
  cancelEmployeeBenefit: (enrollmentId: string) => void;
  updateEmployeeBenefit: (id: string, data: Partial<EmployeeBenefit>) => void;
  toggleBenefitStatus: (id: string) => void;
  processMonthlyPayroll: (month: string) => void;
  calculateEmployeePay: (employee: Employee, month: string) => MonthlyPayroll;
  addManualEntry: (entry: Omit<ManualEntry, 'id'>) => void;
  removeManualEntry: (id: string) => void;
  addTraining: (data: any) => void;
  assignTraining: (trainingId: string, target: any) => void;
  updateTrainingProgress: (participationId: string, progress: number) => void;
  requestTraining: (data: any) => void;
  handleTrainingRequest: (requestId: string, status: 'Aprovado' | 'Rejeitado') => void;
  saveEvaluation: (data: any) => void;
  deleteEvaluation: (id: string) => void;
  addHealthRecord: (record: any) => void;
  deleteHealthRecord: (id: string) => void;
  addMedicalCertificate: (cert: any) => void;
  handleCertificate: (id: string, status: 'Validado' | 'Rejeitado') => void;
  addEPIRecord: (record: any) => void;
  syncESocial: (empId: string) => Promise<void>;
  // Novos módulos expandidos
  communicationPosts: CommunicationPost[];
  addCommunicationPost: (post: Omit<CommunicationPost, 'id'>) => void;
  reactToPost: (postId: string, reaction: ReactionType, userId: string) => void;
  commentOnPost: (postId: string, content: string, authorId: string) => void;
  recognitions: Recognition[];
  addRecognition: (data: Omit<Recognition, 'id'>) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [jobs, setJobs] = useState<JobOpening[]>(MOCK_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES as any);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(MOCK_TIME_RECORDS);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>(MOCK_BENEFITS as any);
  const [employeeBenefits, setEmployeeBenefits] = useState<EmployeeBenefit[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<MonthlyPayroll[]>([]);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([
    { id: 't1', name: 'Cultura Nexus', category: 'Integração', durationHours: 4, instructor: 'RH', active: true, isMandatory: true },
    { id: 't2', name: 'Segurança da Informação', category: 'Compliance', durationHours: 2, instructor: 'TI', active: true, isMandatory: true }
  ]);
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(MOCK_HEALTH_RECORDS as any);
  const [medicalCertificates, setMedicalCertificates] = useState<MedicalCertificate[]>([]);
  const [epiRecords, setEpiRecords] = useState<EPIRecord[]>([]);
  // Estado dos novos módulos
  const [communicationPosts, setCommunicationPosts] = useState<CommunicationPost[]>([
    { id: 'p1', authorId: 'emp1', type: 'comunicado', title: 'Bem-vindos ao novo Portal RH Nexus!', content: 'Estamos felizes em apresentar o novo sistema de gestão de pessoas Nexus RH. Explore os novos módulos de comunicação, academia, reconhecimentos e muito mais!', targetDepartments: [], targetRoles: [], createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), reactions: { like: ['emp2', 'emp3'], aplauso: ['emp4'], star: [], coração: ['emp5'] }, comments: [{ id: 'c1', authorId: 'emp2', content: 'Excelente iniciativa! O sistema está incrível.', createdAt: new Date(Date.now() - 86400000).toISOString() }], published: true },
    { id: 'p2', authorId: 'emp1', type: 'evento', title: 'Workshop de Liderança — 25/11', content: 'Convidamos todos os gestores e coordenadores para o Workshop de Liderança Situacional. Inscrições até 20/11. Vagas limitadas!', targetDepartments: [], targetRoles: [], createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), reactions: { like: ['emp3'], aplauso: [], star: ['emp2'], coração: [] }, comments: [], published: true },
    { id: 'p3', authorId: 'emp1', type: 'aviso', title: 'Prazo de Avaliações de Desempenho — Ciclo Q4', content: 'Lembramos que o prazo para conclusão das avaliações de desempenho do ciclo Q4 é 30/11. Gestores, acessem o módulo de Performance para preencher os formulários.', targetDepartments: [], targetRoles: [], createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), reactions: { like: [], aplauso: [], star: [], coração: [] }, comments: [], published: true },
  ]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([
    { id: 'r1', employeeId: 'emp2', grantedBy: 'emp1', type: 'destaque_mes', title: 'Destaque do Mês', description: 'Reconhecimento pelo excelente trabalho no projeto de transformação digital, superando todas as metas estabelecidas.', createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), points: 100 },
    { id: 'r2', employeeId: 'emp3', grantedBy: 'emp1', type: 'performance', title: 'Alta Performance', description: 'Performance excepcional no trimestre com resultados acima da meta em todas as métricas avaliadas.', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), points: 80 },
  ]);
  
  // Auth State
  const [authenticatedUser, setAuthenticatedUser] = useState<Employee | null>(null);

  // Lógica de Login Integrada (SaaS Auth)
  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      
      if (resp.ok && data.success) {
         // Modelando Payload do Backend para o Typescript Front-End
         const user = { 
           id: data.user.id.toString(), 
           name: data.user.name, 
           email: email, 
           position: data.user.role === 'ADMIN' ? 'C-Level' : (data.user.role === 'LIDER' ? 'Liderança' : 'Colaborador'),
           status: 'Ativo',
           image: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.user.name) + '&background=0D1117&color=fff',
           userRole: data.user.role,
           department: 'Gestão Inteligente',
           performanceScore: 95
         } as unknown as Employee;
         
         setAuthenticatedUser(user);
         localStorage.setItem('nexus_token', data.token);
         localStorage.setItem('nexus_user_data', JSON.stringify(user));
         return true;
      }
      console.warn('Backend Auth Rejeitou Login:', data.error);
      return false;
    } catch(err) {
      console.error('Network Error ao falar com Node API:', err);
      return false;
    }
  };

  const logout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user_data');
  };

  // Tenta recuperar sessão ao iniciar via Storage Nativo do Auth
  useEffect(() => {
    const token = localStorage.getItem('nexus_token');
    const userData = localStorage.getItem('nexus_user_data');
    if (token && userData) {
       try {
         setAuthenticatedUser(JSON.parse(userData));
       } catch(e) {}
    }
  }, []);

  const updateCandidate = (id: string, data: Partial<Candidate>) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));

  const calculateTaxes = (salary: number) => {
    let inss = 0;
    if (salary <= 1412) inss = salary * 0.075;
    else if (salary <= 2666.68) inss = (salary * 0.09) - 21.18;
    else if (salary <= 4000.03) inss = (salary * 0.12) - 101.18;
    else if (salary <= 7786.02) inss = (salary * 0.14) - 181.18;
    else inss = 908.85;

    const baseIRRF = salary - inss;
    let irrf = 0;
    if (baseIRRF <= 2112) irrf = 0;
    else if (baseIRRF <= 2826.65) irrf = (baseIRRF * 0.075) - 158.40;
    else if (baseIRRF <= 3751.05) irrf = (baseIRRF * 0.15) - 370.40;
    else if (baseIRRF <= 4664.68) irrf = (baseIRRF * 0.225) - 651.73;
    else irrf = (baseIRRF * 0.275) - 884.96;

    return { inss, irrf, fgts: salary * 0.08 };
  };

  const calculateEmployeePay = (employee: Employee, month: string): MonthlyPayroll => {
    const events: PayrollEvent[] = [
      { id: 'ev-sal', name: 'Salário Base', type: 'Provento', value: employee.salary, origin: 'Sistema', reference: '30d' }
    ];
    const earnings = events.filter(e => e.type === 'Provento').reduce((acc, e) => acc + e.value, 0);
    const taxes = calculateTaxes(earnings);
    events.push({ id: 'ev-inss', name: 'INSS', type: 'Desconto', value: taxes.inss, origin: 'Sistema' });
    events.push({ id: 'ev-irrf', name: 'IRRF', type: 'Desconto', value: taxes.irrf, origin: 'Sistema' });
    const deductions = events.filter(e => e.type === 'Desconto').reduce((acc, e) => acc + e.value, 0);

    return {
      id: `p-${employee.id}-${month}`,
      employeeId: employee.id,
      month,
      grossSalary: earnings,
      netSalary: earnings - deductions,
      events,
      totalDeductions: deductions,
      totalEarnings: earnings,
      fgtsValue: taxes.fgts,
      status: 'Processado'
    };
  };

  const addEmployee = (data: any) => {
    const id = (employees.length + 1).toString();
    setEmployees([...employees, { ...data, id, registration: `NX${id.padStart(3, '0')}`, userRole: 'EMPLOYEE', vacationBalance: 30, history: [], status: 'Ativo' }]);
  };

  return (
    <HRContext.Provider value={{ 
      employees, jobs, candidates, timeRecords, vacationRequests, benefits, employeeBenefits, 
      payrollHistory, manualEntries, trainings, employeeTrainings, trainingRequests, 
      evaluations, healthRecords, medicalCertificates, epiRecords, authenticatedUser,
      login, logout,
      addEmployee, updateEmployee: (id, d) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...d } : e)),
      removeEmployee: (id) => setEmployees(prev => prev.filter(e => e.id !== id)),
      addJob: (j) => setJobs([...jobs, { ...j, id: `v-${Date.now()}` }]), 
      updateJob: (id, d) => setJobs(prev => prev.map(j => j.id === id ? { ...j, ...d } : j)),
      addCandidate: (c) => setCandidates([...candidates, { ...c, id: `can-${Date.now()}`, stage: 'Triagem' }]),
      updateCandidate,
      hireCandidate: (candId, jobId) => {
        const cand = candidates.find(c => c.id === candId);
        const job = jobs.find(j => j.id === jobId);
        if(cand && job) {
          addEmployee({ name: cand.name, role: job.title, department: job.department, salary: 0, email: cand.email, contractType: 'CLT', hireDate: new Date().toISOString().split('T')[0] });
          updateCandidate(candId, { stage: 'Contratado' });
        }
      },
      rejectCandidate: (id) => updateCandidate(id, { stage: 'Reprovado' }),
      punchTime: (type, loc) => { 
        if(!authenticatedUser) return;
        const newRec: TimeRecord = { id: `tr-${Date.now()}`, employeeId: authenticatedUser.id, date: new Date().toISOString().split('T')[0], type, timestamp: new Date().toLocaleTimeString('pt-BR'), status: 'Original', location: loc };
        setTimeRecords([newRec, ...timeRecords]);
      },
      requestAdjustment: (d) => setTimeRecords([{ ...d, id: `adj-${Date.now()}`, status: 'Pendente' }, ...timeRecords]),
      approveTimeRecord: (id) => setTimeRecords(prev => prev.map(tr => tr.id === id ? { ...tr, status: 'Ajustado' } : tr)),
      rejectTimeRecord: (id, n) => setTimeRecords(prev => prev.map(tr => tr.id === id ? { ...tr, status: 'Rejeitado', managerNotes: n } : tr)),
      requestVacation: (req) => setVacationRequests([...vacationRequests, { ...req, id: `vr-${Date.now()}`, status: 'Pendente', requestDate: new Date().toISOString().split('T')[0] }]),
      approveVacation: (id) => setVacationRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Aprovado' } : r)),
      rejectVacation: (id) => setVacationRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejeitado' } : r)),
      scheduleCollectiveVacation: (ids, s, e) => { /* logic */ },
      addBenefit: (b) => setBenefits([...benefits, { ...b, id: `b-${Date.now()}`, active: true }]),
      updateBenefit: (id, d) => setBenefits(prev => prev.map(b => b.id === id ? { ...b, ...d } : b)),
      removeBenefit: (id) => setBenefits(prev => prev.filter(b => b.id !== id)),
      enrollEmployeeInBenefit: (eid, bid) => setEmployeeBenefits([...employeeBenefits, { id: `eb-${Date.now()}`, employeeId: eid, benefitId: bid, status: 'Ativo', enrollmentDate: new Date().toISOString().split('T')[0] }]),
      cancelEmployeeBenefit: (id) => setEmployeeBenefits(prev => prev.map(eb => eb.id === id ? { ...eb, status: 'Cancelado' } : eb)),
      updateEmployeeBenefit: (id, d) => setEmployeeBenefits(prev => prev.map(eb => eb.id === id ? { ...eb, ...d } : eb)),
      toggleBenefitStatus: (id) => setBenefits(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b)),
      processMonthlyPayroll: (m) => { 
        const newRecords = employees.map(e => ({ ...calculateEmployeePay(e, m), status: 'Pago' as const }));
        setPayrollHistory([...payrollHistory, ...newRecords]);
      },
      calculateEmployeePay,
      addManualEntry: (e) => setManualEntries([...manualEntries, { ...e, id: `me-${Date.now()}` }]),
      removeManualEntry: (id) => setManualEntries(prev => prev.filter(m => m.id !== id)),
      addTraining: (d) => setTrainings([...trainings, { ...d, id: `t-${Date.now()}`, active: true }]),
      assignTraining: (tid, target) => { /* logic */ },
      updateTrainingProgress: (id, p) => setEmployeeTrainings(prev => prev.map(et => et.id === id ? { ...et, progress: p, status: p === 100 ? 'Concluído' : 'Em Andamento' } : et)),
      requestTraining: (d) => setTrainingRequests([...trainingRequests, { ...d, id: `req-${Date.now()}`, status: 'Pendente', requestDate: new Date().toISOString().split('T')[0] }]),
      handleTrainingRequest: (id, s) => setTrainingRequests(prev => prev.map(r => r.id === id ? { ...r, status: s } : r)),
      saveEvaluation: (d) => setEvaluations([...evaluations, { ...d, id: `ev-${Date.now()}`, date: new Date().toISOString().split('T')[0] }]),
      deleteEvaluation: (id) => setEvaluations(prev => prev.filter(ev => ev.id !== id)),
      addHealthRecord: (r) => setHealthRecords([...healthRecords, { ...r, id: `h-${Date.now()}` }]),
      deleteHealthRecord: (id) => setHealthRecords(prev => prev.filter(h => h.id !== id)),
      addMedicalCertificate: (c) => setMedicalCertificates([...medicalCertificates, { ...c, id: `c-${Date.now()}`, status: 'Pendente' }]),
      handleCertificate: (id, s) => setMedicalCertificates(prev => prev.map(c => c.id === id ? { ...c, status: s } : c)),
      addEPIRecord: (r) => setEpiRecords([...epiRecords, { ...r, id: `epi-${Date.now()}`, status: 'Entregue' }]),
      syncESocial: async (id) => { await new Promise(r => setTimeout(r, 1000)); },
      // Novos m\u00f3dulos
      communicationPosts,
      addCommunicationPost: (post) => setCommunicationPosts(prev => [{ ...post, id: `p-${Date.now()}` }, ...prev]),
      reactToPost: (postId, reaction, userId) => setCommunicationPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const current = p.reactions[reaction] || [];
        const toggled = current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId];
        return { ...p, reactions: { ...p.reactions, [reaction]: toggled } };
      })),
      commentOnPost: (postId, content, authorId) => setCommunicationPosts(prev => prev.map(p =>
        p.id !== postId ? p : { ...p, comments: [...(p.comments || []), { id: `c-${Date.now()}`, authorId, content, createdAt: new Date().toISOString() }] }
      )),
      recognitions,
      addRecognition: (data) => setRecognitions(prev => [{ ...data, id: `r-${Date.now()}` }, ...prev]),
    }}>

      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) throw new Error('useHR must be used within an HRProvider');
  return context;
};
