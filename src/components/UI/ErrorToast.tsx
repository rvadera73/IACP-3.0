import { AlertCircle, RefreshCcw, X } from 'lucide-react';
import { Button, cn } from '../UI';

interface ErrorToastProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function ErrorToast({ error, onRetry, onDismiss, className }: ErrorToastProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">We hit an API error</div>
          <p className="mt-1 text-sm text-red-700">{getMessage(error)}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <Button size="sm" variant="danger" onClick={onRetry} leftIcon={<RefreshCcw className="h-4 w-4" />}>
                  Retry
                </Button>
              )}
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss} leftIcon={<X className="h-4 w-4" />}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
