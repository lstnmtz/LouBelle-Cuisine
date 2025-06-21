
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeeklyPlan, Recipe } from '@/types/recipe';
import { getWeekDates, getCurrentWeekStart, capitalizeFirst } from '@/lib/utils';
import { format, addWeeks, subWeeks, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeeklyPlannerProps {
  plan: WeeklyPlan | null;
  recipes: Recipe[];
  onPlanChange: (plan: WeeklyPlan) => void;
  onAddMeal: (day: string, mealType: string) => void;
}

const mealTypes = [
  { key: 'petitDejeuner', label: 'Petit-déjeuner' },
  { key: 'dejeuner', label: 'Déjeuner' },
  { key: 'diner', label: 'Dîner' },
  { key: 'collation', label: 'Collation' }
];

export function WeeklyPlanner({ plan, recipes, onPlanChange, onAddMeal }: WeeklyPlannerProps) {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekStart());
  
  const weekDates = getWeekDates(currentWeek);
  const currentPlan = plan?.semaine === currentWeek ? plan : null;

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' 
      ? format(subWeeks(parseISO(currentWeek), 1), 'yyyy-MM-dd')
      : format(addWeeks(parseISO(currentWeek), 1), 'yyyy-MM-dd');
    setCurrentWeek(newWeek);
  };

  const getRecipesByDay = (day: string, mealType: string): Recipe[] => {
    const dayPlan = currentPlan?.recettesParJour[day];
    if (!dayPlan || !dayPlan[mealType as keyof typeof dayPlan]) return [];
    
    const recipeIds = dayPlan[mealType as keyof typeof dayPlan] || [];
    return recipeIds
      .map(id => recipes.find(r => r.titre === id))
      .filter((recipe): recipe is Recipe => recipe !== undefined);
  };

  const removeRecipe = (day: string, mealType: string, recipeTitle: string) => {
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan };
    const dayPlan = updatedPlan.recettesParJour[day] || {};
    const mealRecipes = dayPlan[mealType as keyof typeof dayPlan] || [];
    
    updatedPlan.recettesParJour[day] = {
      ...dayPlan,
      [mealType]: mealRecipes.filter(title => title !== recipeTitle)
    };

    onPlanChange(updatedPlan);
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Semaine du {format(parseISO(currentWeek), 'd MMMM yyyy', { locale: fr })}
          </h2>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Planning Grid */}
      <div className="space-y-4">
        {weekDates.map(({ key: day, label, date }) => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {capitalizeFirst(label)} {format(date, 'd MMM', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mealTypes.map(({ key: mealType, label: mealLabel }) => (
                <div key={mealType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {mealLabel}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddMeal(day, mealType)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {getRecipesByDay(day, mealType).map((recipe) => (
                      <div
                        key={recipe.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{recipe.titre}</span>
                          <Badge variant="outline" className="text-xs">
                            {recipe.nombrePersonnes}p
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeRecipe(day, mealType, recipe.titre)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {getRecipesByDay(day, mealType).length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        Aucun repas planifié
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
