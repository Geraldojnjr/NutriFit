
import { useNavigate, useParams } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import MainLayout from "@/components/layout/MainLayout";
import RecipeForm from "@/components/RecipeForm";
import { Recipe } from "@/types/recipe";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipeById, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const recipeData = getRecipeById(id);
      if (recipeData) {
        setRecipe(recipeData);
      } else {
        toast.error("Receita não encontrada");
        navigate("/");
      }
    }
  }, [id, getRecipeById, navigate]);

  const handleUpdateRecipe = async (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => {
    if (id) {
      try {
        setIsSubmitting(true);
        await updateRecipe(id, recipeData);
        toast.success("Receita atualizada com sucesso!");
        navigate(`/recipe/${id}`);
      } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        toast.error("Erro ao atualizar receita. Tente novamente.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!recipe) {
    return (
      <MainLayout>
        <div className="p-4 flex items-center justify-center min-h-[300px]">
          <p>Carregando receita...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(`/recipe/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Receita</h1>
        </div>
        <RecipeForm initialData={recipe} onSubmit={handleUpdateRecipe} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
};

export default EditRecipePage;
