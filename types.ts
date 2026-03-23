
export enum EmployeeStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  ON_VACATION = 'Em Férias',
  AWAY = 'Afastado'
}

export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'MANAGER';
export type ContractType = 'CLT' | 'PJ' | 'Estagiário' | 'Temporário';
export type TimeRecordStatus = 'Original' | 'Ajustado' | 'Pendente' | 'Abonado' | 'Rejeitado';
export type TimeRecordType = 'Entrada' | 'Saída' | 'Intervalo Início' | 'Intervalo Fim';
export type VacationStatus = 'Pendente' | 'Aprovado' | 'Rejeitado' | 'Gozado';
export type BenefitType = 'Saúde' | 'Alimentação' | 'Seguro' | 'Transporte' | 'Educação' | 'Lazer';
export type PayrollEventType = 'Provento' | 'Desconto';
export type PayrollEventOrigin = 'Sistema' | 'Ponto' | 'Benefícios' | 'Manual';

export interface BankInfo {
  name: string;
  agency: string;
  account: string;
}

export interface Dependent {
  name: string;
  type: string;
  dob: string;
}

export interface HistoryEntry {
  date: string;
  event: string;
  role: string;
  salary: number;
}

export interface OnboardingTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  days: number;
  status: VacationStatus;
  type: 'Individual' | 'Coletiva';
  sellTenDays: boolean;
  requestDate: string;
}

export interface Benefit {
  id: string;
  name: string;
  provider: string;
  type: BenefitType;
  baseCost: number;
  eligibility: string;
  description?: string;
  active: boolean;
}

export interface EmployeeBenefit {
  id: string;
  employeeId: string;
  benefitId: string;
  status: 'Ativo' | 'Pendente' | 'Cancelado';
  enrollmentDate: string;
  cardNumber?: string;
}

export interface PayrollEvent {
  id: string;
  name: string;
  type: PayrollEventType;
  value: number;
  origin: PayrollEventOrigin;
  reference?: string;
}

export interface ManualEntry {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  name: string;
  type: PayrollEventType;
  value: number;
}

export interface MonthlyPayroll {
  id: string;
  employeeId: string;
  month: string; // YYYY-MM
  grossSalary: number;
  netSalary: number;
  events: PayrollEvent[];
  totalDeductions: number;
  totalEarnings: number;
  fgtsValue: number;
  status: 'Aberto' | 'Processado' | 'Pago';
}

export interface Employee {
  id: string;
  registration: string;
  name: string;
  role: string;
  department: string;
  contractType: ContractType;
  userRole: UserRole;
  salary: number;
  hireDate: string;
  status: string;
  email: string;
  managerId: string | null;
  bank: BankInfo;
  dependents: Dependent[];
  history: HistoryEntry[];
  cpf?: string;
  rg?: string;
  onboardingTasks?: OnboardingTask[];
  onboardingCompleted?: boolean;
  vacationBalance: number;
  terminationDetails?: {
    date: string;
    reason: string;
    completed: boolean;
  };
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  status: 'Open' | 'Closed' | 'Paused';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  requirements: string;
  salaryRange: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  stage: 'Triagem' | 'Entrevista RH' | 'Teste Técnico' | 'Entrevista Gestor' | 'Proposta' | 'Contratado' | 'Reprovado';
  score?: number;
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  };
  cvText?: string;
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  type: TimeRecordType;
  timestamp: string;
  status: TimeRecordStatus;
  location?: string;
  justification?: string;
  managerNotes?: string;
}

export type TrainingCategory = 'Integração' | 'Obrigatório' | 'Técnico' | 'Desenvolvimento' | 'Compliance';

export interface Training {
  id: string;
  name: string;
  category: TrainingCategory;
  durationHours: number;
  description: string;
  instructor: string; 
  active: boolean;
  targetDepartments?: string[];
  isMandatory: boolean;
}

export interface EmployeeTraining {
  id: string;
  employeeId: string;
  trainingId: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Expirado';
  assignedBy: 'Sistema' | 'RH' | 'Liderança';
  progress: number; 
  assignedDate: string;
  completionDate?: string;
}

export interface TrainingRequest {
  id: string;
  requesterId: string;
  employeeId: string;
  trainingId?: string;
  reason: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  requestDate: string;
}

export interface PerformanceEvaluation {
  id: string;
  employeeId: string;
  evaluatorId: string;
  period: string;
  performanceScore: number; 
  potentialScore: number; 
  competencies: { name: string, score: number }[];
  goals: { title: string, progress: number }[];
  pdi: string;
  status: 'Rascunho' | 'Finalizada' | 'Calibrada';
  date: string;
}

export type HealthRecordType = 'Admissional' | 'Periódico' | 'Demissional' | 'Retorno ao Trabalho' | 'Mudança de Função';

export interface HealthRecord {
  id: string;
  employeeId: string;
  type: HealthRecordType;
  date: string;
  status: 'Apto' | 'Inapto' | 'Apto com Restrições';
  nextExam: string;
  doctorName?: string;
  notes?: string;
}

export interface MedicalCertificate {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  cid?: string;
  doctorName: string;
  crm: string;
  status: 'Validado' | 'Pendente' | 'Rejeitado';
  abonoHoras: boolean;
}

export interface EPIRecord {
  id: string;
  employeeId: string;
  item: string;
  caNumber: string;
  deliveryDate: string;
  validityMonths: number;
  status: 'Entregue' | 'Devolvido' | 'Extraviado';
}

// =============================================
// NOVOS TIPOS — Expansão Avançada Nexus RH
// =============================================

export type PostType = 'comunicado' | 'evento' | 'treinamento' | 'aviso' | 'reconhecimento';
export type ReactionType = 'like' | 'aplauso' | 'star' | 'coração';

export interface PostComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface CommunicationPost {
  id: string;
  authorId: string;
  type: PostType;
  title: string;
  content: string;
  imageUrl?: string;
  targetDepartments: string[]; // [] = todos
  targetRoles: string[];       // [] = todos
  scheduledAt?: string;
  createdAt: string;
  reactions: Record<ReactionType, string[]>; // userId[]
  comments: PostComment[];
  published: boolean;
}

export interface ClimateQuestion {
  id: string;
  label: string;
  dimension: 'ambiente' | 'liderança' | 'satisfação' | 'carga';
}

export interface ClimateResponse {
  id: string;
  surveyId: string;
  answers: Record<string, number>; // questionId -> score 1-10
  submittedAt: string;
}

export interface ClimateSurvey {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  active: boolean;
  responses: ClimateResponse[];
}

export interface CompetencySkill {
  id: string;
  name: string;
  category: 'Técnica' | 'Comportamental' | 'Liderança' | 'Comunicação';
}

export interface CompetencyScore {
  id: string;
  employeeId: string;
  skillId: string;
  score: number; // 1-5
  evaluatedBy: string;
  evaluatedAt: string;
}

export type RecognitionType = 'destaque_mes' | 'performance' | 'inovacao' | 'cultura' | 'cliente';

export interface Recognition {
  id: string;
  employeeId: string;
  grantedBy: string; // gestorId
  type: RecognitionType;
  title: string;
  description: string;
  createdAt: string;
  points: number;
}

export type AutomationTrigger = 'ferias_vencidas' | 'excesso_faltas' | 'avaliacao_vencida' | 'aniversario' | 'risco_turnover';
export type AutomationAction = 'alerta_rh' | 'email_gestor' | 'notificacao_sistema' | 'sugestao_pip';

export interface AutomationRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  active: boolean;
  lastRun?: string;
  executionCount: number;
  threshold?: number; // e.g., 3 faltas
}

export interface AutomationLog {
  id: string;
  ruleId: string;
  employeeId: string;
  executedAt: string;
  message: string;
}

export type TimelineEventType = 'admissao' | 'promocao' | 'treinamento' | 'ferias' | 'avaliacao' | 'reconhecimento' | 'advertencia' | 'afastamento';

export interface TimelineEvent {
  id: string;
  employeeId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string;
  metadata?: Record<string, any>;
}

export interface LearningTrack {
  id: string;
  name: string;
  description: string;
  targetRole?: string;
  targetDepartment?: string;
  courseIds: string[]; // Training IDs
  mandatory: boolean;
  coverImage?: string;
}

export interface CourseEnrollment {
  id: string;
  employeeId: string;
  trainingId: string;
  trackId?: string;
  progress: number;
  status: 'não_iniciado' | 'em_andamento' | 'concluído';
  startedAt?: string;
  completedAt?: string;
  certificateId?: string;
}

