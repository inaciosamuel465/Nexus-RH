import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Employee, JobOpening, Candidate, TimeRecord, VacationRequest, Benefit, 
  EmployeeBenefit, MonthlyPayroll, ManualEntry, Training, 
  EmployeeTraining, TrainingRequest, PerformanceEvaluation,
  HealthRecord, MedicalCertificate, EPIRecord,
  CommunicationPost, Recognition
} from '../types';
import { 
  employeeApi, recruitmentApi, payrollApi, timeApi, vacationApi, 
  benefitApi, trainingApi, safetyApi, commApi, performanceApi, 
  benefitApi, trainingApi, safetyApi, commApi, performanceApi, 
  sectorApi 
} from '../services/api';
import { API_BASE } from '../src/config';

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
  addEmployee: (employee: any) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
  addJob: (job: any) => Promise<void>;
  updateJob: (id: string, data: any) => Promise<void>;
  addCandidate: (candidate: any) => Promise<void>;
  updateCandidate: (id: string, data: Partial<Candidate>) => Promise<void>;
  hireCandidate: (candidateId: string, jobId: string) => Promise<void>;
  rejectCandidate: (candidateId: string) => Promise<void>;
  punchTime: (type: string, location?: string) => Promise<void>;
  requestAdjustment: (data: any) => Promise<void>;
  approveTimeRecord: (id: string) => Promise<void>;
  rejectTimeRecord: (id: string, notes: string) => Promise<void>;
  requestVacation: (req: any) => Promise<void>;
  approveVacation: (id: string) => Promise<void>;
  rejectVacation: (id: string) => Promise<void>;
  scheduleCollectiveVacation: (employeeIds: string[], startDate: string, endDate: string) => void;
  addBenefit: (benefit: any) => Promise<void>;
  updateBenefit: (id: string, data: Partial<Benefit>) => Promise<void>;
  removeBenefit: (id: string) => Promise<void>;
  enrollEmployeeInBenefit: (employeeId: string, benefitId: string, cardNumber?: string) => Promise<void>;
  cancelEmployeeBenefit: (enrollmentId: string) => Promise<void>;
  updateEmployeeBenefit: (id: string, data: Partial<EmployeeBenefit>) => Promise<void>;
  toggleBenefitStatus: (id: string) => Promise<void>;
  processMonthlyPayroll: (month: string) => Promise<void>;
  calculateEmployeePay: (employee: Employee, month: string) => MonthlyPayroll;
  addManualEntry: (entry: Omit<ManualEntry, 'id'>) => void;
  removeManualEntry: (id: string) => void;
  addTraining: (data: any) => Promise<void>;
  assignTraining: (trainingId: string, target: any) => Promise<void>;
  updateTrainingProgress: (participationId: string, progress: number) => Promise<void>;
  requestTraining: (data: any) => void;
  handleTrainingRequest: (requestId: string, status: 'Aprovado' | 'Rejeitado') => void;
  saveEvaluation: (data: any) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;
  addHealthRecord: (record: any) => Promise<void>;
  deleteHealthRecord: (id: string) => void;
  addMedicalCertificate: (cert: any) => Promise<void>;
  handleCertificate: (id: string, status: 'Validado' | 'Rejeitado') => void;
  addEPIRecord: (record: any) => Promise<void>;
  syncESocial: (empId: string) => Promise<void>;
  communicationPosts: CommunicationPost[];
  addCommunicationPost: (post: Omit<CommunicationPost, 'id'>) => Promise<void>;
  reactToPost: (postId: string, reaction: any, userId: string) => Promise<void>;
  commentOnPost: (postId: string, content: string, authorId: string) => void;
  recognitions: Recognition[];
  addRecognition: (data: Omit<Recognition, 'id'>) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [employeeBenefits, setEmployeeBenefits] = useState<EmployeeBenefit[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<MonthlyPayroll[]>([]);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [medicalCertificates, setMedicalCertificates] = useState<MedicalCertificate[]>([]);
  const [epiRecords, setEpiRecords] = useState<EPIRecord[]>([]);
  const [communicationPosts, setCommunicationPosts] = useState<CommunicationPost[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  
  const [authenticatedUser, setAuthenticatedUser] = useState<Employee | null>(null);

  const fetchAllData = async () => {
    if (!localStorage.getItem('nexus_token')) return;
    try {
      const [emp, j, cand, time, vac, ben, train, health, cert, posts, perf] = await Promise.all([
        employeeApi.list(), 
        recruitmentApi.listJobs(), 
        recruitmentApi.listCandidates(),
        timeApi.list(), 
        vacationApi.list(), 
        benefitApi.list(),
        trainingApi.list(), 
        safetyApi.listHealth(), 
        safetyApi.listCertificates(),
        commApi.listPosts(),
        performanceApi.list()
      ]);

      if (emp.success) setEmployees(emp.data);
      if (j.success) setJobs(j.data);
      if (cand.success) setCandidates(cand.data);
      if (time.success) setTimeRecords(time.data);
      if (vac.success) setVacationRequests(vac.data);
      if (ben.success) setBenefits(ben.data);
      if (train.success) setTrainings(train.data);
      if (health.success) setHealthRecords(health.data);
      if (cert.success) setMedicalCertificates(cert.data);
      if (posts.success) setCommunicationPosts(posts.data);
      if (perf.success) setEvaluations(perf.data);
    } catch (err) {
      console.error('Erro na sincroniza\u00e7\u00e3o:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('nexus_token');
    const userData = localStorage.getItem('nexus_user_data');
    if (token && userData) {
       setAuthenticatedUser(JSON.parse(userData));
       fetchAllData();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      
      if (resp.ok && data.success) {
         const user = { 
           id: data.user.id.toString(), 
           name: data.user.name, 
           email: email, 
           userRole: data.user.role,
           position: data.user.role === 'ADMIN' ? 'Diretoria' : 'Colaborador',
           image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=0D1117&color=fff`,
         } as any;
         
         setAuthenticatedUser(user);
         localStorage.setItem('nexus_token', data.token);
         localStorage.setItem('nexus_user_data', JSON.stringify(user));
         fetchAllData();
         return true;
      }
      return false;
    } catch(err) {
      return false;
    }
  };

  const logout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user_data');
    setEmployees([]);
  };

  return (
    <HRContext.Provider value={{ 
      employees, jobs, candidates, timeRecords, vacationRequests, benefits, employeeBenefits, 
      payrollHistory, manualEntries, trainings, employeeTrainings, trainingRequests, 
      evaluations, healthRecords, medicalCertificates, epiRecords, authenticatedUser,
      login, logout,
      addEmployee: async (d) => { await employeeApi.create(d); fetchAllData(); },
      updateEmployee: async (id, d) => { await employeeApi.update(id, d); fetchAllData(); },
      removeEmployee: async (id) => { await employeeApi.remove(id); fetchAllData(); },
      addJob: async (j) => { await recruitmentApi.createJob(j); fetchAllData(); }, 
      updateJob: async (id, d) => { fetchAllData(); },
      addCandidate: async (c) => { await recruitmentApi.applyJob(c); fetchAllData(); },
      updateCandidate: async (id, d) => { await recruitmentApi.updateCandidate(id, d); fetchAllData(); },
      hireCandidate: async (candId, jobId) => { fetchAllData(); },
      rejectCandidate: async (id) => { await recruitmentApi.updateCandidate(id, { stage: 'Reprovado' }); fetchAllData(); },
      punchTime: async (type, loc) => { await timeApi.punch({ type, location: loc }); fetchAllData(); },
      requestAdjustment: async (d) => { await timeApi.adjust(d.id, d); fetchAllData(); },
      approveTimeRecord: async (id) => { await timeApi.approve(id); fetchAllData(); },
      rejectTimeRecord: async (id, n) => { fetchAllData(); },
      requestVacation: async (req) => { await vacationApi.request(req); fetchAllData(); },
      approveVacation: async (id) => { await vacationApi.approve(id); fetchAllData(); },
      rejectVacation: async (id) => { await vacationApi.reject(id); fetchAllData(); },
      scheduleCollectiveVacation: (ids, s, e) => {},
      addBenefit: async (b) => { await benefitApi.create(b); fetchAllData(); },
      updateBenefit: async (id, d) => { await benefitApi.update(id, d); fetchAllData(); },
      removeBenefit: async (id) => { await benefitApi.remove(id); fetchAllData(); },
      enrollEmployeeInBenefit: async (eid, bid) => { await benefitApi.enroll({ employeeId: eid, benefitId: bid }); fetchAllData(); },
      cancelEmployeeBenefit: async (id) => { fetchAllData(); },
      updateEmployeeBenefit: async (id, d) => { fetchAllData(); },
      toggleBenefitStatus: async (id) => { fetchAllData(); },
      processMonthlyPayroll: async (m) => { await payrollApi.process(m); fetchAllData(); },
      calculateEmployeePay: (e, m) => ({} as any),
      addManualEntry: (e) => {},
      removeManualEntry: (id) => {},
      addTraining: async (d) => { await trainingApi.create(d); fetchAllData(); },
      assignTraining: async (tid, target) => { await trainingApi.assign({ trainingId: tid, employeeId: target }); fetchAllData(); },
      updateTrainingProgress: async (id, p) => { await trainingApi.updateProgress(id, p); fetchAllData(); },
      requestTraining: (d) => {},
      handleTrainingRequest: (id, s) => {},
      saveEvaluation: async (d) => { await performanceApi.save(d); fetchAllData(); },
      deleteEvaluation: async (id) => { await performanceApi.remove(id); fetchAllData(); },
      addHealthRecord: async (r) => { await safetyApi.addHealth(r); fetchAllData(); },
      deleteHealthRecord: (id) => {},
      addMedicalCertificate: async (c) => { await safetyApi.addCertificate(c); fetchAllData(); },
      handleCertificate: (id, s) => {},
      addEPIRecord: async (r) => { await safetyApi.addEPI(r); fetchAllData(); },
      syncESocial: async (id) => { await new Promise(r => setTimeout(r, 1000)); },
      communicationPosts,
      addCommunicationPost: async (post) => { await commApi.createPost(post); fetchAllData(); },
      reactToPost: async (postId, reaction) => { await commApi.react(postId, reaction); fetchAllData(); },
      commentOnPost: (postId, content, authorId) => {},
      recognitions,
      addRecognition: (data) => {},
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
