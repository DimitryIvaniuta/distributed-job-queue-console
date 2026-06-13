import { EnvironmentBanner } from '../components/EnvironmentBanner';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  readonly children: React.ReactNode;
}

/** Root banking layout with sidebar, header, central area and footer. */
export function AppShell({ children }: AppShellProps): React.JSX.Element {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Header />
        <main className="content-shell">
          <EnvironmentBanner />
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
