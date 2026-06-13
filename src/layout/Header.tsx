import { useBackendHealthQuery } from '../api/jobQueries';

/** Top application bar with banking-grade operational context. */
export function Header(): React.JSX.Element {
  const healthQuery = useBackendHealthQuery();
  const status = healthQuery.data?.status ?? (healthQuery.isError ? 'DOWN' : 'CHECKING');
  const tone = status === 'UP' ? 'success' : status === 'CHECKING' ? 'warning' : 'danger';

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Banking + BigTech queue operations</p>
        <h1>Distributed Job Queue Console</h1>
      </div>
      <div className="header-meta" aria-label="environment summary">
        <span className={`health-pill health-${tone}`}>Backend {status}</span>
        <span>React 19.2</span>
        <span>Kafka priority lanes</span>
        <span>At-least-once safe</span>
      </div>
    </header>
  );
}
