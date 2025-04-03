
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Recipe } from "../types/recipe";
import { toast } from "sonner";
import { dbClient } from "@/integrations/database/client";
import { dbConfig } from "@/integrations/database/config";

interface RecipeContextProps {
  recipes: Recipe[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredRecipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipeContext = createContext<RecipeContextProps | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar receitas do banco de dados ao montar o componente
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await dbClient.getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error(`Falha ao carregar receitas (${dbConfig.type}):`, error);
        toast.error("Falha ao carregar receitas");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filtrar receitas baseado no termo de busca
  const filteredRecipes = recipes.filter((recipe) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Verificar se o nome contém o termo de busca
    const nameMatch = recipe.name.toLowerCase().includes(searchTermLower);
    
    // Verificar se algum ingrediente contém o termo de busca
    const ingredientMatch = recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTermLower)
    );
    
    return nameMatch || ingredientMatch;
  });

  // Adicionar uma nova receita
  const addRecipe = async (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newRecipe = await dbClient.addRecipe(recipe);
      setRecipes((prev) => [newRecipe, ...prev]);
      toast.success("Receita adicionada com sucesso");
    } catch (error) {
      console.error(`Erro ao adicionar receita (${dbConfig.type}):`, error);
      toast.error("Falha ao adicionar receita");
      throw error;
    }
  };

  // Atualizar uma receita existente
  const updateRecipe = async (id: string, updatedRecipe: Partial<Recipe>) => {
    try {
      await dbClient.updateRecipe(id, updatedRecipe);
      
      // Atualizar o estado local
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === id
            ? { ...recipe, ...updatedRecipe, updatedAt: Date.now() }
            : recipe
        )
      );
      
      toast.success("Receita atualizada com sucesso");
    } catch (error) {
      console.error(`Erro ao atualizar receita (${dbConfig.type}):`, error);
      toast.error("Falha ao atualizar receita");
      throw error;
    }
  };

  // Excluir uma receita
  const deleteRecipe = async (id: string) => {
    try {
      await dbClient.deleteRecipe(id);
      
      // Atualizar o estado local
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      
      toast.success("Receita excluída com sucesso");
    } catch (error) {
      console.error(`Erro ao excluir receita (${dbConfig.type}):`, error);
      toast.error("Falha ao excluir receita");
      throw error;
    }
  };

  // Obter uma receita pelo ID
  const getRecipeById = (id: string) => {
    return recipes.find((recipe) => recipe.id === id);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        searchTerm,
        setSearchTerm,
        filteredRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipes deve ser usado dentro de um RecipeProvider");
  }
  return context;
};
