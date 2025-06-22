import { Recipe, WeeklyPlan, ShoppingList } from '@/types/recipe';

const STORAGE_KEYS = {
  RECIPES: 'mes-recettes-recipes',
  WEEKLY_PLANS: 'mes-recettes-weekly-plans',
  SHOPPING_LISTS: 'mes-recettes-shopping-lists',
  SETTINGS: 'mes-recettes-settings'
};

const recipesContext = import.meta.glob('../recipes/*.json', { eager: true });

function getAllDefaultRecipes(): Recipe[] {
  return Object.values(recipesContext).map((mod: any) => mod.default ?? mod) as Recipe[];
}

export class LocalStorage {
  static async getRecipes(): Promise<Recipe[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des recettes:', error);
      return [];
    }
  }

  static async saveRecipes(recipes: Recipe[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des recettes:', error);
    }
  }

  static async addRecipe(recipe: Recipe): Promise<void> {
    const recipes = await this.getRecipes();
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);
    
    if (existingIndex >= 0) {
      recipes[existingIndex] = { ...recipe, updatedAt: new Date().toISOString() };
    } else {
      recipes.push(recipe);
    }
    
    await this.saveRecipes(recipes);
  }

  static async deleteRecipe(id: string): Promise<void> {
    const recipes = await this.getRecipes();
    const filteredRecipes = recipes.filter(r => r.id !== id);
    await this.saveRecipes(filteredRecipes);
  }

  static async getWeeklyPlans(): Promise<WeeklyPlan[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_PLANS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des plannings:', error);
      return [];
    }
  }

  static async saveWeeklyPlan(plan: WeeklyPlan): Promise<void> {
    try {
      const plans = await this.getWeeklyPlans();
      const existingIndex = plans.findIndex(p => p.semaine === plan.semaine);
      
      if (existingIndex >= 0) {
        plans[existingIndex] = plan;
      } else {
        plans.push(plan);
      }
      
      localStorage.setItem(STORAGE_KEYS.WEEKLY_PLANS, JSON.stringify(plans));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du planning:', error);
    }
  }

  static async getShoppingLists(): Promise<ShoppingList[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des listes de courses:', error);
      return [];
    }
  }

  static async saveShoppingList(list: ShoppingList): Promise<void> {
    try {
      const lists = await this.getShoppingLists();
      const existingIndex = lists.findIndex(l => l.semaine === list.semaine);
      
      if (existingIndex >= 0) {
        lists[existingIndex] = list;
      } else {
        lists.push(list);
      }
      
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(lists));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la liste de courses:', error);
    }
  }

  static initializeDefaultData(): void {
    const existingRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
    if (!existingRecipes) {
      // Charge toutes les recettes du dossier recipes automatiquement
      const defaultRecipes: Recipe[] = getAllDefaultRecipes();
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(defaultRecipes));
    }
  }
}
