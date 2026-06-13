interface LoadingStateProps {
  readonly label: string;
}

/** Accessible loading placeholder for async panels. */
export function LoadingState({ label }: LoadingStateProps): React.JSX.Element {
  return (
    <div aria-live="polite" className="loading-state" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
