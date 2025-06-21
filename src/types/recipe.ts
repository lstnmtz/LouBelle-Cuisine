
export interface Ingredient {
  nom: string;
  quantite: number;
  unite: string;
  type: string;
  disponible?: boolean;
}

export interface MacroNutriments {
  proteines: number;
  lipides: number;
  glucides: number;
}

export interface Recipe {
  id: string;
  titre: string;
  image?: string;
  nombrePersonnes: number;
  categorie: string;
  caloriesParPersonne?: number;
  macronutrimentsParPersonne?: MacroNutriments;
  tempsPreparation: number;
  tempsCuisson: number;
  ingredients: Ingredient[];
  instructions: string[];
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlan {
  semaine: string;
  personnes: number;
  recettesParJour: {
    [day: string]: {
      petitDejeuner?: string[];
      dejeuner?: string[];
      diner?: string[];
      collation?: string[];
    };
  };
}

export interface ShoppingList {
  semaine: string;
  ingredients: (Ingredient & { recettes: string[] })[];
  generatedAt: string;
}
