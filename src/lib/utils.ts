
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, startOfWeek, addDays, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function getWeekDates(weekStart: string): { date: Date; label: string; key: string }[] {
  const start = parseISO(weekStart);
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    weekDays.push({
      date,
      label: format(date, 'EEEE', { locale: fr }),
      key: format(date, 'EEEE', { locale: fr })
    });
  }
  
  return weekDays;
}

export function getCurrentWeekStart(): string {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lundi
  return format(weekStart, 'yyyy-MM-dd');
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h${remainingMinutes}`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
