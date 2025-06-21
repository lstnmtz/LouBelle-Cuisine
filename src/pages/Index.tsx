
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Layout/Header';
import { BottomNavigation } from '@/components/Layout/BottomNavigation';
import { RecipeCard } from '@/components/Recipe/RecipeCard';
import { RecipeForm } from '@/components/Recipe/RecipeForm';
import { RecipeDetail } from '@/components/Recipe/RecipeDetail';
import { WeeklyPlanner } from '@/components/Planning/WeeklyPlanner';
import { Recipe, WeeklyPlan, ShoppingList } from '@/types/recipe';
import { LocalStorage } from '@/lib/storage';
import { getCurrentWeekStart, generateId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function Index() {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const { toast } = useToast();

  const categories = ['all', 'Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation', 'Dessert', 'Apéritif'];

  useEffect(() => {
    const loadData = async () => {
      LocalStorage.initializeDefaultData();
      const loadedRecipes = await LocalStorage.getRecipes();
      setRecipes(loadedRecipes);
      setFilteredRecipes(loadedRecipes);

      const plans = await LocalStorage.getWeeklyPlans();
      const currentWeek = getCurrentWeekStart();
      const currentPlan = plans.find(p => p.semaine === currentWeek);
      setWeeklyPlan(currentPlan || null);

      const lists = await LocalStorage.getShoppingLists();
      const currentList = lists.find(l => l.semaine === currentWeek);
      setShoppingList(currentList || null);
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = recipes;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => 
          ing.nom.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.categorie === selectedCategory);
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedCategory]);

  const handleSaveRecipe = async (recipe: Recipe) => {
    await LocalStorage.addRecipe(recipe);
    const updatedRecipes = await LocalStorage.getRecipes();
    setRecipes(updatedRecipes);
    setShowRecipeForm(false);
    setEditingRecipe(null);
    
    toast({
      title: recipe.id === editingRecipe?.id ? "Recette modifiée" : "Recette créée",
      description: `${recipe.titre} a été ${recipe.id === editingRecipe?.id ? 'modifiée' : 'créée'} avec succès.`,
    });
  };

  const handleDeleteRecipe = async (recipe: Recipe) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${recipe.titre}" ?`)) {
      await LocalStorage.deleteRecipe(recipe.id);
      const updatedRecipes = await LocalStorage.getRecipes();
      setRecipes(updatedRecipes);
      setSelectedRecipe(null);
      
      toast({
        title: "Recette supprimée",
        description: `${recipe.titre} a été supprimée avec succès.`,
      });
    }
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    await LocalStorage.addRecipe(updatedRecipe);
    const updatedRecipes = await LocalStorage.getRecipes();
    setRecipes(updatedRecipes);
    
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const handlePlanChange = async (plan: WeeklyPlan) => {
    await LocalStorage.saveWeeklyPlan(plan);
    setWeeklyPlan(plan);
    generateShoppingList(plan);
  };

  const handleAddMeal = (day: string, mealType: string) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowRecipeSelector(true);
  };

  const handleSelectRecipeForPlan = async (recipe: Recipe) => {
    const currentWeek = getCurrentWeekStart();
    const plan = weeklyPlan || {
      semaine: currentWeek,
      personnes: 4,
      recettesParJour: {}
    };

    const dayPlan = plan.recettesParJour[selectedDay] || {};
    const mealRecipes = dayPlan[selectedMealType as keyof typeof dayPlan] || [];

    plan.recettesParJour[selectedDay] = {
      ...dayPlan,
      [selectedMealType]: [...mealRecipes, recipe.titre]
    };

    await handlePlanChange(plan);
    setShowRecipeSelector(false);
    
    toast({
      title: "Repas ajouté",
      description: `${recipe.titre} a été ajouté au planning.`,
    });
  };

  const generateShoppingList = async (plan: WeeklyPlan) => {
    const allIngredients: any[] = [];

    Object.values(plan.recettesParJour).forEach(dayPlan => {
      Object.values(dayPlan).forEach(mealRecipes => {
        if (Array.isArray(mealRecipes)) {
          mealRecipes.forEach(recipeTitle => {
            const recipe = recipes.find(r => r.titre === recipeTitle);
            if (recipe) {
              recipe.ingredients.forEach(ingredient => {
                const existingIndex = allIngredients.findIndex(
                  ing => ing.nom === ingredient.nom && ing.unite === ingredient.unite
                );

                if (existingIndex >= 0) {
                  allIngredients[existingIndex].quantite += ingredient.quantite;
                  if (!allIngredients[existingIndex].recettes.includes(recipe.titre)) {
                    allIngredients[existingIndex].recettes.push(recipe.titre);
                  }
                } else {
                  allIngredients.push({
                    ...ingredient,
                    recettes: [recipe.titre]
                  });
                }
              });
            }
          });
        }
      });
    });

    const newList: ShoppingList = {
      semaine: plan.semaine,
      ingredients: allIngredients,
      generatedAt: new Date().toISOString()
    };

    await LocalStorage.saveShoppingList(newList);
    setShoppingList(newList);
  };

  const toggleIngredientAvailable = async (index: number) => {
    if (!shoppingList) return;

    const updatedList = { ...shoppingList };
    updatedList.ingredients[index].disponible = !updatedList.ingredients[index].disponible;

    await LocalStorage.saveShoppingList(updatedList);
    setShoppingList(updatedList);
  };

  const renderRecipes = () => (
    <>
      <Header
        title="Mes Recettes"
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category === 'all' ? 'Toutes' : category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Aucune recette ne correspond à vos critères.'
                : 'Aucune recette disponible.'}
            </p>
          </div>
        )}
      </div>

      <Button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setShowRecipeForm(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </>
  );

  const renderPlanning = () => (
    <>
      <Header title="Planning des repas" />
      <div className="p-4">
        <WeeklyPlanner
          plan={weeklyPlan}
          recipes={recipes}
          onPlanChange={handlePlanChange}
          onAddMeal={handleAddMeal}
        />
      </div>
    </>
  );

  const renderShopping = () => (
    <>
      <Header title="Liste de courses" />
      <div className="p-4 space-y-6">
        {shoppingList && shoppingList.ingredients.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Liste pour la semaine du {new Date(shoppingList.semaine).toLocaleDateString('fr-FR')}
                </CardTitle>
              </CardHeader>
            </Card>

            {Object.entries(
              shoppingList.ingredients.reduce((acc, ingredient) => {
                if (!acc[ingredient.type]) acc[ingredient.type] = [];
                acc[ingredient.type].push(ingredient);
                return acc;
              }, {} as Record<string, any[]>)
            ).map(([type, ingredients]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="text-base">{type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={`${ingredient.nom}-${index}`}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        ingredient.disponible ? 'bg-green-100 dark:bg-green-900/20 line-through text-muted-foreground' : 'bg-muted'
                      }`}
                      onClick={() => toggleIngredientAvailable(
                        shoppingList.ingredients.findIndex(ing => 
                          ing.nom === ingredient.nom && ing.unite === ingredient.unite
                        )
                      )}
                    >
                      <div>
                        <span className="font-medium">{ingredient.nom}</span>
                        <div className="text-sm text-muted-foreground">
                          {ingredient.quantite} {ingredient.unite}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {ingredient.recettes.map((recette: string) => (
                            <Badge key={recette} variant="outline" className="text-xs">
                              {recette}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Aucune liste de courses générée. Planifiez vos repas pour créer automatiquement votre liste.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <Header title="Profil" />
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{recipes.length}</div>
                <div className="text-sm text-muted-foreground">Recettes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {recipes.filter(r => r.favorite).length}
                </div>
                <div className="text-sm text-muted-foreground">Favoris</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>À propos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Mes Recettes - Application de gestion de recettes et planification de repas.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderContent = () => {
    if (selectedRecipe && !editingRecipe && !showRecipeForm) {
      return (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
          onEdit={() => {
            setEditingRecipe(selectedRecipe);
            setSelectedRecipe(null);
          }}
          onDelete={() => handleDeleteRecipe(selectedRecipe)}
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe)}
        />
      );
    }

    if (showRecipeForm || editingRecipe) {
      return (
        <div className="p-4">
          <RecipeForm
            recipe={editingRecipe || undefined}
            onSave={handleSaveRecipe}
            onCancel={() => {
              setShowRecipeForm(false);
              setEditingRecipe(null);
            }}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'recipes':
        return renderRecipes();
      case 'planning':
        return renderPlanning();
      case 'shopping':
        return renderShopping();
      case 'profile':
        return renderProfile();
      default:
        return renderRecipes();
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background pb-16">
        {renderContent()}
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Recipe Selector Dialog */}
        <Dialog open={showRecipeSelector} onOpenChange={setShowRecipeSelector}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Choisir une recette</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipes.map(recipe => (
                <Button
                  key={recipe.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleSelectRecipeForPlan(recipe)}
                >
                  <div className="text-left">
                    <div className="font-medium">{recipe.titre}</div>
                    <div className="text-sm text-muted-foreground">
                      {recipe.categorie} • {recipe.nombrePersonnes} personnes
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default Index;
