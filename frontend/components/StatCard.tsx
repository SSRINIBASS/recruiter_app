type StatCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export function StatCard({ label, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-surface-secondary rounded-lg p-4 flex flex-col justify-between h-28 relative">
      <div>
        <div className="text-xs uppercase font-medium text-text-secondary tracking-wider">
          {label}
        </div>
        <div className="text-xl font-medium text-text-primary mt-2">
          {value}
        </div>
      </div>
      
      {subtitle && (
        <div className="text-xs text-text-secondary mt-1">
          {subtitle}
        </div>
      )}

      {Icon && (
        <div className="absolute right-4 top-4 text-text-secondary/50">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
