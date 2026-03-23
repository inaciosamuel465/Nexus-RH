const API_BASE = 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('nexus_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}

// ============ EMPLOYEES ============
export const employeeApi = {
  list: () => request<any>('/api/v2/modules/employees/'),
  getById: (id: string) => request<any>(`/api/v2/modules/employees/${id}`),
  create: (data: any) => request<any>('/api/v2/modules/employees/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/api/v2/modules/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/api/v2/modules/employees/${id}`, { method: 'DELETE' }),
};

// ============ RECRUITMENT ============
export const recruitmentApi = {
  listJobs: () => request<any>('/api/v2/modules/recruitment/jobs'),
  createJob: (data: any) => request<any>('/api/v2/modules/recruitment/jobs', { method: 'POST', body: JSON.stringify(data) }),
  listCandidates: (jobId?: string) => request<any>(`/api/v2/modules/recruitment/candidates${jobId ? `?jobId=${jobId}` : ''}`),
  applyJob: (data: any) => request<any>('/api/v2/modules/recruitment/apply', { method: 'POST', body: JSON.stringify(data) }),
  analyzeCV: (data: any) => request<any>('/api/v2/modules/recruitment/analyze-cv', { method: 'POST', body: JSON.stringify(data) }),
  updateCandidate: (id: string, data: any) => request<any>(`/api/v2/modules/recruitment/candidates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ============ PAYROLL ============
export const payrollApi = {
  list: (month?: string) => request<any>(`/api/v2/modules/payroll/${month ? `?month=${month}` : ''}`),
  process: (month: string) => request<any>('/api/v2/modules/payroll/process', { method: 'POST', body: JSON.stringify({ month }) }),
  getByEmployee: (empId: string) => request<any>(`/api/v2/modules/payroll/employee/${empId}`),
};

// ============ TIME TRACKING ============
export const timeApi = {
  list: (empId?: string) => request<any>(`/api/v2/modules/timetracking/${empId ? `?employeeId=${empId}` : ''}`),
  punch: (data: any) => request<any>('/api/v2/modules/timetracking/punch', { method: 'POST', body: JSON.stringify(data) }),
  adjust: (id: string, data: any) => request<any>(`/api/v2/modules/timetracking/${id}/adjust`, { method: 'PUT', body: JSON.stringify(data) }),
  approve: (id: string) => request<any>(`/api/v2/modules/timetracking/${id}/approve`, { method: 'PUT' }),
};

// ============ VACATION ============
export const vacationApi = {
  list: () => request<any>('/api/v2/modules/vacation/'),
  request: (data: any) => request<any>('/api/v2/modules/vacation/', { method: 'POST', body: JSON.stringify(data) }),
  approve: (id: string) => request<any>(`/api/v2/modules/vacation/${id}/approve`, { method: 'PUT' }),
  reject: (id: string) => request<any>(`/api/v2/modules/vacation/${id}/reject`, { method: 'PUT' }),
};

// ============ BENEFITS ============
export const benefitApi = {
  list: () => request<any>('/api/v2/modules/benefits/'),
  create: (data: any) => request<any>('/api/v2/modules/benefits/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/api/v2/modules/benefits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/api/v2/modules/benefits/${id}`, { method: 'DELETE' }),
  enroll: (data: any) => request<any>('/api/v2/modules/benefits/enroll', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ TRAINING ============
export const trainingApi = {
  list: () => request<any>('/api/v2/modules/training/'),
  create: (data: any) => request<any>('/api/v2/modules/training/', { method: 'POST', body: JSON.stringify(data) }),
  assign: (data: any) => request<any>('/api/v2/modules/training/assign', { method: 'POST', body: JSON.stringify(data) }),
  updateProgress: (id: string, progress: number) => request<any>(`/api/v2/modules/training/${id}/progress`, { method: 'PUT', body: JSON.stringify({ progress }) }),
};

// ============ SAFETY ============
export const safetyApi = {
  listHealth: () => request<any>('/api/v2/modules/safety/health'),
  addHealth: (data: any) => request<any>('/api/v2/modules/safety/health', { method: 'POST', body: JSON.stringify(data) }),
  listCertificates: () => request<any>('/api/v2/modules/safety/certificates'),
  addCertificate: (data: any) => request<any>('/api/v2/modules/safety/certificates', { method: 'POST', body: JSON.stringify(data) }),
  listEPI: () => request<any>('/api/v2/modules/safety/epi'),
  addEPI: (data: any) => request<any>('/api/v2/modules/safety/epi', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ COMMUNICATION ============
export const commApi = {
  listPosts: () => request<any>('/api/v2/modules/communication/posts'),
  createPost: (data: any) => request<any>('/api/v2/modules/communication/notice', { method: 'POST', body: JSON.stringify(data) }),
  react: (postId: string, reaction: string) => request<any>(`/api/v2/modules/communication/posts/${postId}/react`, { method: 'POST', body: JSON.stringify({ reaction }) }),
  generatePost: (prompt: string) => request<any>('/api/v2/modules/communication/generate-post', { method: 'POST', body: JSON.stringify({ prompt }) }),
};

// ============ PERFORMANCE ============
export const performanceApi = {
  list: () => request<any>('/api/v2/modules/performance/'),
  save: (data: any) => request<any>('/api/v2/modules/performance/', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string) => request<any>(`/api/v2/modules/performance/${id}`, { method: 'DELETE' }),
};

// ============ SECTORS ============
export const sectorApi = {
  list: () => request<any>('/api/v2/modules/sector/'),
  getById: (id: string) => request<any>(`/api/v2/modules/sector/${id}`),
  create: (data: any) => request<any>('/api/v2/modules/sector/', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ DOCUMENTS ============
export const documentApi = {
  generateContract: (data: any) => request<any>('/api/v2/modules/document/generate-contract', { method: 'POST', body: JSON.stringify(data) }),
  generateWarning: (data: any) => request<any>('/api/v2/modules/document/generate-warning', { method: 'POST', body: JSON.stringify(data) }),
  preview: (data: any) => request<any>('/api/v2/modules/document/preview', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ SUPPORT ============
export const supportApi = {
  listTickets: () => request<any>('/api/v2/modules/support/tickets'),
  createTicket: (data: any) => request<any>('/api/v2/modules/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ ANALYTICS ============
export const analyticsApi = {
  getKPIs: () => request<any>('/api/v2/modules/analytics/kpis'),
  getInsights: (data?: any) => request<any>('/api/v2/modules/analytics/ai-insights', { method: 'POST', body: JSON.stringify(data || {}) }),
};
