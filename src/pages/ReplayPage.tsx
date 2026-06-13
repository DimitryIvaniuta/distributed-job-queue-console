import { useState } from 'react';
import { useReplayJobMutation } from '../api/jobQueries';
import { ApiError } from '../api/http';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { JobDetails } from '../features/jobs/JobDetails';
import type { JobPriority, JobResponse } from '../types/job';

/** Operator DLQ replay form. Backend rejects invalid state transitions. */
export function ReplayPage(): React.JSX.Element {
  const replayMutation = useReplayJobMutation();
  const [jobId, setJobId] = useState('');
  const [priority, setPriority] = useState<JobPriority>('HIGH');
  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const replay = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const result = await replayMutation.mutateAsync({ jobId: jobId.trim(), priority });
      setJob(result);
      setMessage('DLQ job replay was scheduled. The worker will process it using the selected priority lane.');
    } catch (caught) {
      setError(caught instanceof ApiError || caught instanceof Error ? caught.message : 'Replay failed.');
    }
  };

  return (
    <div className="page-grid two-columns">
      <Card description="Safely requeue a dead-lettered job after operator review." title="DLQ Replay">
        <form className="form-stack" onSubmit={(event) => void replay(event)}>
          <Field id="replay-job-id" label="DLQ Job ID">
            <input id="replay-job-id" onChange={(event) => setJobId(event.target.value)} placeholder="UUID currently in DLQ state" required value={jobId} />
          </Field>
          <Field id="replay-priority" label="Replay Priority">
            <select id="replay-priority" onChange={(event) => setPriority(event.target.value as JobPriority)} value={priority}>
              <option value="HIGH">HIGH</option>
              <option value="LOW">LOW</option>
            </select>
          </Field>
          {error ? <Alert tone="error" title="Replay failed">{error}</Alert> : null}
          {message ? <Alert tone="success" title="Replay scheduled">{message}</Alert> : null}
          <Button disabled={replayMutation.isPending || !jobId.trim()} type="submit" variant="danger">
            {replayMutation.isPending ? 'Scheduling…' : 'Replay DLQ Job'}
          </Button>
        </form>
      </Card>
      <Card description="Updated backend job response." title="Replay Result">
        {job ? <JobDetails job={job} /> : <p className="muted">Replay a DLQ job to see the updated state.</p>}
      </Card>
    </div>
  );
}
