import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

const KPICard = ({ title, value, change, changeType = 'neutral', icon: Icon, iconColor }: KPICardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-xl',
            iconColor || 'bg-primary/10'
          )}>
            <Icon className={cn(
              'w-6 h-6',
              iconColor ? '' : 'text-primary'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
