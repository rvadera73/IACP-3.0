import { cn } from '../UI';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} aria-hidden="true" />;
}
