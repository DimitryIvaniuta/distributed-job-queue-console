import type { JobStatus } from '../types/job';

const STATUS_TONE: Readonly<Record<JobStatus, string>> = {
  ACCEPTED: 'neutral',
  QUEUED: 'info',
  PROCESSING: 'warning',
  RETRY_SCHEDULED: 'warning',
  SUCCEEDED: 'success',
  DLQ: 'danger',
};

/** Returns stable design-token tone for any known backend status. */
export function getStatusTone(status: JobStatus): string {
  return STATUS_TONE[status];
}

/** Converts backend stats object into a stable display list, with operationally important statuses first. */
export function toStatusRows(stats: Readonly<Record<string, number>>): readonly (readonly [string, number])[] {
  const order = ['DLQ', 'PROCESSING', 'RETRY_SCHEDULED', 'QUEUED', 'ACCEPTED', 'SUCCEEDED'];

  return Object.entries(stats).sort(([left], [right]) => {
    const leftIndex = order.indexOf(left);
    const rightIndex = order.indexOf(right);

    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
    }

    return left.localeCompare(right);
  });
}
