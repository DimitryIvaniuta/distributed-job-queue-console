import { useState } from 'react';
import { useCreateJobMutation } from '../api/jobQueries';
import { ApiError } from '../api/http';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { JobDetails } from '../features/jobs/JobDetails';
import { getRuntimeConfig } from '../config/env';
import type { JobPriority, JobResponse } from '../types/job';
import { formatBytes, getUtf8SizeBytes } from '../utils/payload';
import { parseJsonInput } from '../utils/json';

const DEFAULT_PAYLOAD = JSON.stringify(
  {
    accountId: 'ACC-2026-0001',
    amount: '1250.00',
    currency: 'PLN',
    operation: 'BANK_TRANSFER_SETTLEMENT',
  },
  null,
  2,
);

/** Create-job command form with local JSON validation before backend call. */
export function CreateJobPage(): React.JSX.Element {
  const createJobMutation = useCreateJobMutation();
  const config = getRuntimeConfig();
  const [idempotencyKey, setIdempotencyKey] = useState('transfer-2026-0001');
  const [type, setType] = useState('BANK_TRANSFER_SETTLEMENT');
  const [priority, setPriority] = useState<JobPriority>('HIGH');
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [maxAttempts, setMaxAttempts] = useState(4);
  const [job, setJob] = useState<JobResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const payloadBytes = getUtf8SizeBytes(payload);

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsedPayload = parseJsonInput(payload);
    if (!parsedPayload.ok) {
      setError(`Invalid JSON payload: ${parsedPayload.message}`);
      return;
    }

    if (payloadBytes > config.payloadLimitBytes) {
      setError(`Payload is ${formatBytes(payloadBytes)}. Limit is ${formatBytes(config.payloadLimitBytes)}.`);
      return;
    }

    if (maxAttempts < 1 || maxAttempts > 20) {
      setError('Max attempts must be between 1 and 20.');
      return;
    }

    try {
      const response = await createJobMutation.mutateAsync({
        idempotencyKey: idempotencyKey.trim(),
        type: type.trim(),
        priority,
        payload: parsedPayload.value,
        maxAttempts,
      });
      setJob(response);
      setMessage('Job accepted safely. Reusing the same idempotency key will not duplicate side effects.');
    } catch (caught) {
      setError(caught instanceof ApiError || caught instanceof Error ? caught.message : 'Unable to submit job.');
    }
  };

  return (
    <div className="page-grid two-columns">
      <Card description="Create high or low priority work in Kafka." title="Submit Background Job">
        <form className="form-stack" onSubmit={(event) => void submit(event)}>
          <Field id="idempotency-key" label="Idempotency Key" hint="Stable for a business operation.">
            <input id="idempotency-key" maxLength={200} onChange={(event) => setIdempotencyKey(event.target.value)} required value={idempotencyKey} />
          </Field>
          <Field id="job-type" label="Job Type" hint="Worker execution selector.">
            <input id="job-type" maxLength={100} onChange={(event) => setType(event.target.value)} required value={type} />
          </Field>
          <div className="form-row">
            <Field id="priority" label="Priority">
              <select id="priority" onChange={(event) => setPriority(event.target.value as JobPriority)} value={priority}>
                <option value="HIGH">HIGH</option>
                <option value="LOW">LOW</option>
              </select>
            </Field>
            <Field id="max-attempts" label="Max Attempts">
              <input id="max-attempts" max={20} min={1} onChange={(event) => setMaxAttempts(Number(event.target.value))} type="number" value={maxAttempts} />
            </Field>
          </div>
          <Field id="payload" label="Payload JSON" hint={`Validated locally before submission. Size: ${formatBytes(payloadBytes)} / ${formatBytes(config.payloadLimitBytes)}.`}>
            <textarea id="payload" onChange={(event) => setPayload(event.target.value)} required rows={12} spellCheck={false} value={payload} />
          </Field>
          {error ? <Alert tone="error" title="Submission failed">{error}</Alert> : null}
          {message ? <Alert tone="success" title="Command accepted">{message}</Alert> : null}
          <Button disabled={createJobMutation.isPending} type="submit">
            {createJobMutation.isPending ? 'Submitting…' : 'Submit Job'}
          </Button>
        </form>
      </Card>
      <Card description="Backend response after job creation." title="Latest Result">
        {job ? <JobDetails job={job} /> : <p className="muted">Submit a job to see the response.</p>}
      </Card>
    </div>
  );
}
