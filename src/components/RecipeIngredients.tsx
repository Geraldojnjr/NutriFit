
import { Badge } from "@/components/ui/badge";

interface RecipeIngredientsProps {
  ingredients: string[];
  categories?: string[];
}

export const RecipeIngredients = ({ ingredients, categories }: RecipeIngredientsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Ingredientes</h3>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-2"></span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;