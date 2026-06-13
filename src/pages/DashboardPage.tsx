import { useJobStatsQuery } from '../api/jobQueries';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LoadingState } from '../components/LoadingState';
import { toStatusRows } from '../utils/job';

/** Dashboard calls /stats and renders operational counters with cached polling. */
export function DashboardPage(): React.JSX.Element {
  const statsQuery = useJobStatsQuery();
  const rows = statsQuery.data ? toStatusRows(statsQuery.data.countsByStatus) : [];
  const total = rows.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="page-grid">
      <Card
        actions={
          <Button disabled={statsQuery.isFetching} onClick={() => void statsQuery.refetch()} variant="secondary">
            {statsQuery.isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        }
        description="Live counters grouped by durable backend status. Auto-refreshes every 15 seconds."
        title="Queue Health"
      >
        {statsQuery.isLoading ? <LoadingState label="Loading queue health" /> : null}
        {statsQuery.isError ? <Alert tone="error" title="Backend unavailable">{statsQuery.error.message}</Alert> : null}
        <div className="kpi-grid" data-testid="kpi-grid">
          <div className="kpi-card primary">
            <span>Total Jobs</span>
            <strong>{total}</strong>
            <small>All states</small>
          </div>
          <div className="kpi-card">
            <span>DLQ</span>
            <strong>{statsQuery.data?.countsByStatus['DLQ'] ?? 0}</strong>
            <small>Needs review</small>
          </div>
          <div className="kpi-card">
            <span>Processing</span>
            <strong>{statsQuery.data?.countsByStatus['PROCESSING'] ?? 0}</strong>
            <small>Active leases</small>
          </div>
          <div className="kpi-card">
            <span>Retry Scheduled</span>
            <strong>{statsQuery.data?.countsByStatus['RETRY_SCHEDULED'] ?? 0}</strong>
            <small>Backoff topics</small>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2}>No stats returned yet.</td>
              </tr>
            ) : (
              rows.map(([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
      <Card description="The backend is designed for at-least-once Kafka delivery." title="Production Guarantees">
        <ul className="guarantee-list">
          <li>Priority routing through independent Kafka topics.</li>
          <li>Retry safety through deterministic backoff topics and DLQ.</li>
          <li>Duplicate side effects prevented by idempotency and receipts.</li>
          <li>Multi-instance workers protected by Redis leases and PostgreSQL uniqueness.</li>
        </ul>
      </Card>
    </div>
  );
}
