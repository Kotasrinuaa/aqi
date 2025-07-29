interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  gradient: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, subtitle, gradient, icon }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 group`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-white/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full blur-xl" />
    </div>
  );
}