import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../UI';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error boundary caught render error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">This screen needs a refresh</h2>
            <p className="mt-2 text-sm text-slate-700">
              A rendering error interrupted the page. You can retry without leaving your current session.
            </p>
            <div className="mt-4">
              <Button onClick={this.handleReset}>Try again</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
