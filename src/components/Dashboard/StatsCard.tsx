import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colorClasses = {
    orange: 'from-[#FFA500]/20 to-[#FFA500]/5 border-[#FFA500]/30 text-[#FFA500]',
    blue: 'from-[#0A74DA]/20 to-[#0A74DA]/5 border-[#0A74DA]/30 text-[#0A74DA]',
    green: 'from-[#28A745]/20 to-[#28A745]/5 border-[#28A745]/30 text-[#28A745]',
    gold: 'from-[#B8860B]/20 to-[#B8860B]/5 border-[#B8860B]/30 text-[#B8860B]',
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} 
      backdrop-blur-xl border rounded-2xl p-6 
      hover:scale-105 hover:shadow-2xl transition-all duration-300
      cursor-pointer group
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br 
          ${color === 'orange' ? 'from-[#FFA500] to-[#FF8C00]' : ''}
          ${color === 'blue' ? 'from-[#0A74DA] to-[#003B6D]' : ''}
          ${color === 'green' ? 'from-[#28A745] to-[#20C997]' : ''}
          ${color === 'gold' ? 'from-[#B8860B] to-[#DAA520]' : ''}
          shadow-lg group-hover:shadow-xl transition-shadow
        `}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className="text-sm font-medium px-2 py-1 bg-white/20 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-[#003B6D] mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
}