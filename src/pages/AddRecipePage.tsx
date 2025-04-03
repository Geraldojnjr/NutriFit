
import { useNavigate } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import MainLayout from "@/components/layout/MainLayout";
import RecipeForm from "@/components/RecipeForm";
import { Recipe } from "@/types/recipe";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AddRecipePage = () => {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRecipe = async (recipeData: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsSubmitting(true);
      await addRecipe(recipeData);
      toast.success("Receita adicionada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);
      toast.error("Erro ao adicionar receita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Adicionar Nova Receita</h1>
        </div>
        <RecipeForm onSubmit={handleAddRecipe} isSubmitting={isSubmitting} />
      </div>
    </MainLayout>
  );
};

export default AddRecipePage;
