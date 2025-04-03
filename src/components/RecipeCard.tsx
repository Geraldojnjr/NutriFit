import { Recipe } from "@/types/recipe";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
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
import { ImageIcon } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { deleteRecipe } = useRecipes();
  const navigate = useNavigate();

  console.log('RecipeCard - Recipe data:', recipe);
  console.log('RecipeCard - Image URL:', recipe.imageUrl);
  console.log('RecipeCard - Full recipe object:', JSON.stringify(recipe, null, 2));

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {recipe.imageUrl ? (
            <img
              alt={recipe.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error("Error loading image:", recipe.imageUrl);
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0E1QTVBNSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNlbSBJbWFnZW08L3RleHQ+PC9zdmc+';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', recipe.imageUrl);
              }}
              loading="lazy"
              src={recipe.imageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
          <h3 className="font-semibold text-lg line-clamp-1">{recipe.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-3 pt-1">
        <div className="flex justify-between mt-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Calorias:</span>
              <span>{recipe.nutrition.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Proteínas:</span>
              <span>{recipe.nutrition.protein}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Carboidratos:</span>
              <span>{recipe.nutrition.carbs}g</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Gordura:</span>
              <span>{recipe.nutrition.fat}g</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/edit/${recipe.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deletar Receita</AlertDialogTitle>
                <AlertDialogDescription>
                  Quer deletar  "{recipe.name}"? A operação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteRecipe(recipe.id)}
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          asChild
        >
          <Link to={`/recipe/${recipe.id}`}>
            Visualizar <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
