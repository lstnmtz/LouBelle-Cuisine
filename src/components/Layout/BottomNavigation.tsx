
import { Calendar, ChefHat, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'recipes', label: 'Recettes', icon: ChefHat },
  { id: 'planning', label: 'Planning', icon: Calendar },
  { id: 'shopping', label: 'Courses', icon: ShoppingCart },
  { id: 'profile', label: 'Profil', icon: User },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0",
              activeTab === id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium truncate">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
