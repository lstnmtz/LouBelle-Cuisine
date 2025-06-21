
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Recipe, Ingredient } from '@/types/recipe';
import { generateId } from '@/lib/utils';

interface RecipeFormProps {
  recipe?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const categories = [
  'Petit-déjeuner',
  'Déjeuner',
  'Dîner',
  'Collation',
  'Dessert',
  'Apéritif'
];

const ingredientTypes = [
  'Légumes',
  'Fruits',
  'Viandes',
  'Poissons',
  'Produits laitiers',
  'Produits animaux',
  'Céréales',
  'Légumineuses',
  'Épices',
  'Condiments',
  'Huiles',
  'Autres'
];

const units = [
  'g', 'kg', 'ml', 'l', 'pièce', 'cuillère à café', 'cuillère à soupe', 'tasse', 'verre', 'pincée'
];

export function RecipeForm({ recipe, onSave, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<Partial<Recipe>>({
    titre: recipe?.titre || '',
    image: recipe?.image || '',
    nombrePersonnes: recipe?.nombrePersonnes || 4,
    categorie: recipe?.categorie || '',
    caloriesParPersonne: recipe?.caloriesParPersonne || 0,
    tempsPreparation: recipe?.tempsPreparation || 0,
    tempsCuisson: recipe?.tempsCuisson || 0,
    ingredients: recipe?.ingredients || [],
    instructions: recipe?.instructions || [''],
    macronutrimentsParPersonne: recipe?.macronutrimentsParPersonne || {
      proteines: 0,
      lipides: 0,
      glucides: 0
    }
  });

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...(prev.ingredients || []),
        { nom: '', quantite: 0, unite: 'g', type: 'Autres' }
      ]
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), '']
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions?.map((inst, i) => 
        i === index ? value : inst
      )
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecipe: Recipe = {
      id: recipe?.id || generateId(),
      titre: formData.titre!,
      image: formData.image,
      nombrePersonnes: formData.nombrePersonnes!,
      categorie: formData.categorie!,
      caloriesParPersonne: formData.caloriesParPersonne,
      macronutrimentsParPersonne: formData.macronutrimentsParPersonne,
      tempsPreparation: formData.tempsPreparation!,
      tempsCuisson: formData.tempsCuisson!,
      ingredients: formData.ingredients!,
      instructions: formData.instructions!.filter(inst => inst.trim() !== ''),
      favorite: recipe?.favorite || false,
      createdAt: recipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(newRecipe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titre">Titre de la recette</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">URL de l'image (optionnel)</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombrePersonnes">Nombre de personnes</Label>
              <Input
                id="nombrePersonnes"
                type="number"
                min="1"
                value={formData.nombrePersonnes}
                onChange={(e) => setFormData(prev => ({ ...prev, nombrePersonnes: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="categorie">Catégorie</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categorie: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tempsPreparation">Temps de préparation (min)</Label>
              <Input
                id="tempsPreparation"
                type="number"
                min="0"
                value={formData.tempsPreparation}
                onChange={(e) => setFormData(prev => ({ ...prev, tempsPreparation: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="tempsCuisson">Temps de cuisson (min)</Label>
              <Input
                id="tempsCuisson"
                type="number"
                min="0"
                value={formData.tempsCuisson}
                onChange={(e) => setFormData(prev => ({ ...prev, tempsCuisson: Number(e.target.value) }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="calories">Calories/pers. (optionnel)</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.caloriesParPersonne || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, caloriesParPersonne: Number(e.target.value) || undefined }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Ingrédients
            <Button type="button" onClick={addIngredient} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ingredients?.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label>Nom</Label>
                <Input
                  value={ingredient.nom}
                  onChange={(e) => updateIngredient(index, 'nom', e.target.value)}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label>Quantité</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredient.quantite}
                  onChange={(e) => updateIngredient(index, 'quantite', Number(e.target.value))}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label>Unité</Label>
                <Select
                  value={ingredient.unite}
                  onValueChange={(value) => updateIngredient(index, 'unite', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-3">
                <Label>Type</Label>
                <Select
                  value={ingredient.type}
                  onValueChange={(value) => updateIngredient(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {(!formData.ingredients || formData.ingredients.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              Aucun ingrédient ajouté. Cliquez sur "Ajouter" pour commencer.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Instructions
            <Button type="button" onClick={addInstruction} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.instructions?.map((instruction, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Label>Étape {index + 1}</Label>
                <Textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder="Décrivez cette étape..."
                  required
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeInstruction(index)}
                className="mt-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {(!formData.instructions || formData.instructions.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              Aucune instruction ajoutée. Cliquez sur "Ajouter" pour commencer.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" className="flex-1">
          {recipe ? 'Modifier' : 'Créer'} la recette
        </Button>
      </div>
    </form>
  );
}
