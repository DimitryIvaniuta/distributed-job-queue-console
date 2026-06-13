import { useState } from 'react';
import { useLookupJobByIdMutation, useLookupJobByKeyMutation } from '../api/jobQueries';
import { ApiError } from '../api/http';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { JobDetails } from '../features/jobs/JobDetails';
import type { JobResponse } from '../types/job';

/** Search and audit page for job id and idempotency-key lookups. */
export function LookupPage(): React.JSX.Element {
  const lookupById = useLookupJobByIdMutation();
  const lookupByKey = useLookupJobByKeyMutation();
  const [jobId, setJobId] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('transfer-2026-0001');
  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = lookupById.isPending || lookupByKey.isPending;

  const runLookup = async (mode: 'id' | 'key'): Promise<void> => {
    setError(null);

    try {
      const result = mode === 'id' ? await lookupById.mutateAsync(jobId.trim()) : await lookupByKey.mutateAsync(idempotencyKey.trim());
      setJob(result);
    } catch (caught) {
      setError(caught instanceof ApiError || caught instanceof Error ? caught.message : 'Lookup failed.');
    }
  };

  return (
    <div className="page-grid two-columns">
      <Card description="Read durable job state from PostgreSQL." title="Lookup & Audit">
        <div className="form-stack">
          <Field id="lookup-job-id" label="Job ID">
            <input id="lookup-job-id" onChange={(event) => setJobId(event.target.value)} placeholder="UUID returned by create endpoint" value={jobId} />
          </Field>
          <Button disabled={loading || !jobId.trim()} onClick={() => void runLookup('id')}>
            Lookup by Job ID
          </Button>
          <div className="divider" />
          <Field id="lookup-idempotency-key" label="Idempotency Key">
            <input id="lookup-idempotency-key" onChange={(event) => setIdempotencyKey(event.target.value)} value={idempotencyKey} />
          </Field>
          <Button disabled={loading || !idempotencyKey.trim()} onClick={() => void runLookup('key')}>
            Lookup by Idempotency Key
          </Button>
          {error ? <Alert tone="error" title="Lookup failed">{error}</Alert> : null}
        </div>
      </Card>
      <Card description="Complete backend job projection." title="Audit Result">
        {job ? <JobDetails job={job} /> : <EmptyState title="No job selected" message="Search by UUID or idempotency key to load details." />}
      </Card>
    </div>
  );
}
