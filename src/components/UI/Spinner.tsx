import { cn } from '../UI';

interface SpinnerProps {
  label?: string;
  className?: string;
  inline?: boolean;
}

export function Spinner({ label = 'Loading', className, inline = false }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 text-slate-600',
        inline ? 'min-h-[44px]' : 'min-h-[40vh] w-full',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
