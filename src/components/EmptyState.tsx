interface EmptyStateProps { readonly title: string; readonly message: string; }
/** Quiet empty state used before operators run a lookup. */
export function EmptyState({ title, message }: EmptyStateProps): React.JSX.Element { return <div className="empty-state"><strong>{title}</strong><p>{message}</p></div>; }
