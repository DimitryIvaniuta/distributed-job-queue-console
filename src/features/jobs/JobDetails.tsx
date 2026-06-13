import { StatusBadge } from '../../components/StatusBadge';
import type { JobResponse } from '../../types/job';
import { formatDateTime } from '../../utils/date';
import { formatJson } from '../../utils/json';

interface JobDetailsProps {
  readonly job: JobResponse;
}

/** Detailed operator view for one job. */
export function JobDetails({ job }: JobDetailsProps): React.JSX.Element {
  return (
    <article className="job-details" aria-label="job details">
      <div className="job-title-row">
        <div>
          <p className="eyebrow">Job reference</p>
          <h3>{job.id}</h3>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <dl className="details-grid">
        <div>
          <dt>Idempotency Key</dt>
          <dd>{job.idempotencyKey}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{job.type}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{job.priority}</dd>
        </div>
        <div>
          <dt>Attempts</dt>
          <dd>
            {job.attempt} / {job.maxAttempts}
          </dd>
        </div>
        <div>
          <dt>Trace ID</dt>
          <dd>{job.traceId}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDateTime(job.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDateTime(job.updatedAt)}</dd>
        </div>
        <div>
          <dt>Next Retry</dt>
          <dd>{formatDateTime(job.nextRetryAt)}</dd>
        </div>
        <div>
          <dt>Completed</dt>
          <dd>{formatDateTime(job.completedAt)}</dd>
        </div>
      </dl>
      {job.errorMessage ? (
        <section className="code-panel code-panel-error">
          <h4>Last error</h4>
          <pre>{job.errorMessage}</pre>
        </section>
      ) : null}
      {job.resultJson ? (
        <section className="code-panel">
          <h4>Result JSON</h4>
          <pre>{formatJson(job.resultJson)}</pre>
        </section>
      ) : null}
    </article>
  );
}
