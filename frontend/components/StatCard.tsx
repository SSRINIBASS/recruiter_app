type StatCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export function StatCard({ label, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-surface-primary border border-subtle rounded-lg p-5 flex flex-col justify-between h-32 relative shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300">
      <div>
        <div className="text-xs uppercase font-semibold text-text-secondary tracking-wider">
          {label}
        </div>
        <div className="text-2xl font-bold text-text-primary mt-2">
          {value}
        </div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-text-secondary mt-1">
          {subtitle}
        </div>
      )}

      {Icon && (
        <div className="absolute right-5 top-5 w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
