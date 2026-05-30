interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
  const baseClass = 'kawaii-skeleton';

  const variants = {
    text: `${baseClass} h-4`,
    rect: `${baseClass} rounded-2xl`,
    circle: `${baseClass} rounded-full`,
  };

  return (
    <div className={`${variants[variant]} ${className}`} />
  );
};

export const BattleSkeleton = () => (
  <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
    <div className="kawaii-panel p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
    </div>

    <div className="space-y-4">
      <div className="h-40 md:h-48 rounded-2xl bg-bg-surface-alt border border-border flex items-center justify-center">
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-14 rounded-full" />
        ))}
      </div>
    </div>

    <div className="kawaii-panel p-4 space-y-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);
