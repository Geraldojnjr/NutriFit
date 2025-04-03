import { useNavigate, useParams } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Edit, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipeById, deleteRecipe } = useRecipes();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const recipeData = getRecipeById(id);
      if (recipeData) {
        setRecipe(recipeData);
      } else {
        navigate("/");
      }
    }
  }, [id, getRecipeById, navigate]);

  const handleDelete = async () => {
    if (id) {
      try {
        setIsDeleting(true);
        await deleteRecipe(id);
        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir receita:", error);
        setIsDeleting(false);
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
      <div className="pb-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background p-4 border-b">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold truncate flex-1">{recipe.name}</h1>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/edit/${id}`)}
              >
                <Edit className="h-5 w-5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Receita</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir "{recipe.name}"? Esta aperação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Recipe Image */}
        {recipe.imageUrl && (
          <div className="relative h-48 w-full md:h-64">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Nutrition Section */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Informações Nutricionais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center bg-muted p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Calorias</span>
                  <span className="text-xl font-semibold">{recipe.nutrition.calories}</span>
                  <span className="text-xs text-muted-foreground">kcal</span>
                </div>
                <div className="flex flex-col items-center bg-muted p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Proteínas</span>
                  <span className="text-xl font-semibold">{recipe.nutrition.protein}</span>
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
                <div className="flex flex-col items-center bg-muted p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Carboidratos</span>
                  <span className="text-xl font-semibold">{recipe.nutrition.carbs}</span>
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
                <div className="flex flex-col items-center bg-muted p-3 rounded-md">
                  <span className="text-sm text-muted-foreground">Gorduras</span>
                  <span className="text-xl font-semibold">{recipe.nutrition.fat}</span>
                  <span className="text-xs text-muted-foreground">g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients Section */}
          <div>
            <h3 className="font-semibold mb-3">Ingredientes</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-2"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Steps Section */}
          <div>
            <h3 className="font-semibold mb-3">Modo de Preparo</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm font-medium mr-3 shrink-0">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Video Section */}
          {recipe.videoUrl && (
            <div>
              <h3 className="font-semibold mb-3">Video Tutorial</h3>
              <Button variant="outline" className="w-full" asChild>
                <a href={recipe.videoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Assistir Video
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RecipeDetailPage;
