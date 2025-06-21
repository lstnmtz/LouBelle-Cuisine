
import { ArrowLeft, Clock, Users, Edit, Trash, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Recipe } from '@/types/recipe';
import { formatTime } from '@/lib/utils';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function RecipeDetail({ recipe, onBack, onEdit, onDelete, onToggleFavorite }: RecipeDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
            <Heart className={`h-5 w-5 ${recipe.favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image */}
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground">Pas d'image</span>
          </div>
        )}
      </div>

      {/* Title and Category */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{recipe.titre}</h1>
        <Badge variant="secondary">{recipe.categorie}</Badge>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-2 p-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{formatTime(recipe.tempsPreparation + recipe.tempsCuisson)}</div>
              <div className="text-sm text-muted-foreground">
                Prépa: {formatTime(recipe.tempsPreparation)} + Cuisson: {formatTime(recipe.tempsCuisson)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-2 p-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{recipe.nombrePersonnes} personnes</div>
              {recipe.caloriesParPersonne && (
                <div className="text-sm text-muted-foreground">
                  {recipe.caloriesParPersonne} kcal/pers.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macronutriments */}
      {recipe.macronutrimentsParPersonne && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Valeurs nutritionnelles (par personne)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {recipe.macronutrimentsParPersonne.proteines}g
                </div>
                <div className="text-sm text-muted-foreground">Protéines</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {recipe.macronutrimentsParPersonne.lipides}g
                </div>
                <div className="text-sm text-muted-foreground">Lipides</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {recipe.macronutrimentsParPersonne.glucides}g
                </div>
                <div className="text-sm text-muted-foreground">Glucides</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ingrédients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{ingredient.nom}</span>
                <span className="text-muted-foreground">
                  {ingredient.quantite} {ingredient.unite}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="flex-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
