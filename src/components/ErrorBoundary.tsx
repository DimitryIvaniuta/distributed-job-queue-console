import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert } from './Alert';
import { Button } from './Button';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

/** Last-resort UI boundary so a rendering defect does not blank the operator console. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override readonly state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('UI render failure', { error, errorInfo });
  }

  public override render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="fatal-shell">
        <Alert tone="error" title="Console rendering failed">
          A client-side error was isolated. Refresh the page after checking the browser console.
        </Alert>
        <Button onClick={() => window.location.reload()} variant="secondary">
          Reload console
        </Button>
      </main>
    );
  }
}
