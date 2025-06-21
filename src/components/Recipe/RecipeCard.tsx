
import { Clock, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types/recipe';
import { formatTime } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <div className="aspect-video relative bg-muted">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Pas d'image</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(recipe);
          }}
        >
          <Heart className={`h-4 w-4 ${recipe.favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{recipe.titre}</h3>
          <Badge variant="secondary" className="mt-1">
            {recipe.categorie}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(recipe.tempsPreparation + recipe.tempsCuisson)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.nombrePersonnes}</span>
          </div>
        </div>
        
        {recipe.caloriesParPersonne && (
          <div className="text-sm text-muted-foreground">
            {recipe.caloriesParPersonne} kcal/pers.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
