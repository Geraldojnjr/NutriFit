
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Recipe, Comment } from "../types/recipe";
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
  addComment: (recipeId: string, text: string, rating: number) => Promise<void>;
  getComments: (recipeId: string) => Promise<Comment[]>;
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

  const addComment = async (recipeId: string, text: string, rating: number) => {
    try {
      const comment = await dbClient.addComment(recipeId, text, rating);
      
      setRecipes((prev) =>
        prev.map((recipe) => {
          if (recipe.id === recipeId) {
            const comments = recipe.comments || [];
            const newComments = [comment, ...comments];
            const totalRating = newComments.reduce((sum, comment) => sum + comment.rating, 0);
            const avgRating = totalRating / newComments.length;
            
            return {
              ...recipe,
              comments: newComments,
              avgRating
            };
          }
          return recipe;
        })
      );
      
      toast.success("Comentário adicionado com sucesso");
    } catch (error) {
      console.error(`Erro ao adicionar comentário (${dbConfig.type}):`, error);
      toast.error("Falha ao adicionar comentário");
      throw error;
    }
  };

  const getComments = async (recipeId: string) => {
    try {
      const comments = await dbClient.getComments(recipeId);
      
      setRecipes((prev) =>
        prev.map((recipe) => {
          if (recipe.id === recipeId) {
            const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
            const avgRating = comments.length > 0 ? totalRating / comments.length : 0;
            
            return {
              ...recipe,
              comments,
              avgRating
            };
          }
          return recipe;
        })
      );
      
      return comments;
    } catch (error) {
      console.error(`Erro ao carregar comentários (${dbConfig.type}):`, error);
      toast.error("Falha ao carregar comentários");
      return [];
    }
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
        addComment,
        getComments,
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
