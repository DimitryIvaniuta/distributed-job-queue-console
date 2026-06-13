export type AppSection = 'dashboard' | 'create' | 'lookup' | 'replay' | 'architecture';

export interface NavigationItem {
  readonly id: AppSection;
  readonly label: string;
  readonly description: string;
  readonly path: string;
}

export const NAVIGATION: readonly NavigationItem[] = [
  { id: 'dashboard', label: 'Operations Dashboard', description: 'Queue health and KPIs', path: '/' },
  { id: 'create', label: 'Submit Job', description: 'Create priority work', path: '/jobs/new' },
  { id: 'lookup', label: 'Lookup & Audit', description: 'Search durable state', path: '/jobs/lookup' },
  { id: 'replay', label: 'DLQ Replay', description: 'Requeue safely', path: '/jobs/replay' },
  { id: 'architecture', label: 'Architecture', description: 'Interview model', path: '/architecture' },
];
