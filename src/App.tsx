import { Navigate, Route, Routes } from 'react-router';
import { AppShell } from './layout/AppShell';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CreateJobPage } from './pages/CreateJobPage';
import { DashboardPage } from './pages/DashboardPage';
import { LookupPage } from './pages/LookupPage';
import { ReplayPage } from './pages/ReplayPage';

/** Main application routes. URL-based navigation is bookmarkable and production-friendly. */
export function App(): React.JSX.Element {
  return (
    <AppShell>
      <Routes>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<CreateJobPage />} path="/jobs/new" />
        <Route element={<LookupPage />} path="/jobs/lookup" />
        <Route element={<ReplayPage />} path="/jobs/replay" />
        <Route element={<ArchitecturePage />} path="/architecture" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppShell>
  );
}
