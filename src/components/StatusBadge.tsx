import type { JobStatus } from '../types/job'; import { getStatusTone } from '../utils/job';
interface StatusBadgeProps { readonly status: JobStatus; }
/** Visual status token. React escapes content, so backend strings are safe as text. */
export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element { return <span className={`status-badge status-${getStatusTone(status)}`}>{status}</span>; }
