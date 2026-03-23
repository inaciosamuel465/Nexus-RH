import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { HRProvider } from './context/HRContext';

// Importação das Páginas
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AIServices from './pages/AIServices';
import OrgChart from './pages/OrgChart';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Payroll from './pages/Payroll';
import Performance from './pages/Performance';
import Recruitment from './pages/Recruitment';
import Safety from './pages/Safety';
import Lifecycle from './pages/Lifecycle';
import Reports from './pages/Reports';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import MySpace from './pages/MySpace';
import Training from './pages/Training';
import Vacation from './pages/Vacation';
import TimeTracking from './pages/TimeTracking';
import Benefits from './pages/Benefits';
import Communication from './pages/Communication';
import HRInsights from './pages/HRInsights';
import HRAssistant from './pages/HRAssistant';
import OrgClimate from './pages/OrgClimate';
import Academy from './pages/Academy';
import CompetencyMatrix from './pages/CompetencyMatrix';
import Recognition from './pages/Recognition';
import Automations from './pages/Automations';
import PeopleAnalytics from './pages/PeopleAnalytics';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HRProvider>
      <BrowserRouter>
        <App>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nexus-ai" element={<AIServices />} />
            <Route path="/org-chart" element={<OrgChart />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetail />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/lifecycle" element={<Lifecycle />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-space" element={<MySpace />} />
            <Route path="/training" element={<Training />} />
            <Route path="/vacation" element={<Vacation />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/hr-insights" element={<HRInsights />} />
            <Route path="/hr-assistant" element={<HRAssistant />} />
            <Route path="/org-climate" element={<OrgClimate />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/competency-matrix" element={<CompetencyMatrix />} />
            <Route path="/recognition" element={<Recognition />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/people-analytics" element={<PeopleAnalytics />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </App>
      </BrowserRouter>
    </HRProvider>
  </React.StrictMode>
);
