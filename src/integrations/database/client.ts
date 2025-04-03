import { dbConfig, DatabaseType } from "./config";
import { Recipe } from "@/types/recipe";

// Importamos o cliente do Supabase apenas se estivermos usando o Supabase
let supabase: any = null;
if (dbConfig.type === 'supabase') {
  // Importação dinâmica para evitar erros quando estiver usando MariaDB
  const { supabase: supabaseClient } = require("@/integrations/supabase/client");
  supabase = supabaseClient;
}

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.DOCKER_ENV === 'true' ? 'http://backend:8083/api' : '/api';

// Interface for database operations
export interface DatabaseClient {
  getRecipes: () => Promise<Recipe[]>;
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => Promise<Recipe>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
}

// Supabase implementation
const supabaseClient: DatabaseClient = {
  getRecipes: async () => {
    if (!supabase) {
      console.error("Supabase client is not available");
      return [];
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((recipe: any) => ({
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      imageUrl: recipe.image_url || undefined,
      videoUrl: recipe.video_url || undefined,
      nutrition: {
        calories: Number(recipe.calories) || 0,
        protein: Number(recipe.protein) || 0,
        fat: Number(recipe.fat) || 0,
        carbs: Number(recipe.carbs) || 0
      },
      createdAt: recipe.created_at ? new Date(recipe.created_at).getTime() : Date.now(),
      updatedAt: recipe.updated_at ? new Date(recipe.updated_at).getTime() : Date.now()
    }));
  },

  addRecipe: async (recipe) => {
    if (!supabase) {
      console.error("Supabase client is not available");
      throw new Error("Database client not available");
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert({
        name: recipe.name,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        image_url: recipe.imageUrl,
        video_url: recipe.videoUrl,
        calories: recipe.nutrition.calories,
        protein: recipe.nutrition.protein,
        fat: recipe.nutrition.fat,
        carbs: recipe.nutrition.carbs
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to insert recipe');
    }

    return {
      id: data[0].id,
      name: data[0].name,
      ingredients: data[0].ingredients,
      steps: data[0].steps,
      imageUrl: data[0].image_url || undefined,
      videoUrl: data[0].video_url || undefined,
      nutrition: {
        calories: Number(data[0].calories) || 0,
        protein: Number(data[0].protein) || 0,
        fat: Number(data[0].fat) || 0,
        carbs: Number(data[0].carbs) || 0
      },
      createdAt: data[0].created_at ? new Date(data[0].created_at).getTime() : Date.now(),
      updatedAt: data[0].updated_at ? new Date(data[0].updated_at).getTime() : Date.now()
    };
  },

  updateRecipe: async (id, updatedRecipe) => {
    if (!supabase) {
      console.error("Supabase client is not available");
      throw new Error("Database client not available");
    }

    const supabaseData: any = {};
      
    if (updatedRecipe.name !== undefined) supabaseData.name = updatedRecipe.name;
    if (updatedRecipe.ingredients !== undefined) supabaseData.ingredients = updatedRecipe.ingredients;
    if (updatedRecipe.steps !== undefined) supabaseData.steps = updatedRecipe.steps;
    if (updatedRecipe.imageUrl !== undefined) supabaseData.image_url = updatedRecipe.imageUrl;
    if (updatedRecipe.videoUrl !== undefined) supabaseData.video_url = updatedRecipe.videoUrl;
    
    if (updatedRecipe.nutrition) {
      if (updatedRecipe.nutrition.calories !== undefined) supabaseData.calories = updatedRecipe.nutrition.calories;
      if (updatedRecipe.nutrition.protein !== undefined) supabaseData.protein = updatedRecipe.nutrition.protein;
      if (updatedRecipe.nutrition.fat !== undefined) supabaseData.fat = updatedRecipe.nutrition.fat;
      if (updatedRecipe.nutrition.carbs !== undefined) supabaseData.carbs = updatedRecipe.nutrition.carbs;
    }
    
    supabaseData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('recipes')
      .update(supabaseData)
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  deleteRecipe: async (id) => {
    if (!supabase) {
      console.error("Supabase client is not available");
      throw new Error("Database client not available");
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};

// MariaDB implementation (using REST API)
const mariaDBImplementation: DatabaseClient = {
  getRecipes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching recipes:', err);
      throw err;
    }
  },

  addRecipe: async (recipe) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error('Failed to add recipe');
      }

      return await response.json();
    } catch (err) {
      console.error('Error adding recipe:', err);
      throw err;
    }
  },

  updateRecipe: async (id, recipe) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
      throw err;
    }
  },

  deleteRecipe: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      throw err;
    }
  }
};

// Factory function to get the appropriate client
export const getDatabaseClient = (): DatabaseClient => {
  if (dbConfig.type === 'mariadb') {
    return mariaDBImplementation;
  }
  
  return supabaseClient;
};

export const dbClient = getDatabaseClient();
