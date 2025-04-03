
import { useState, useEffect } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

// Predefined categories for recipes
const RECIPE_CATEGORIES = [
  "Todos",
  "Entrada",
  "Prato Principal",
  "Sobremesa",
  "Bebida",
  "Café da Manhã",
  "Almoço",
  "Jantar",
  "Lanche",
  "Vegetariano",
  "Vegano",
  "Sem Glúten",
  "Sem Lactose",
  "Fitness",
  "Low Carb",
  "Carne",
  "Frutos do Mar",
  "Sopa",
  "Salada",
  "Outro"
];

interface CategoryFilterProps {
  onCategoryChange: (categories: string[] | null) => void;
}

const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const handleAddCategory = () => {
    if (currentCategory && currentCategory !== "Todos" && !selectedCategories.includes(currentCategory)) {
      const newCategories = [...selectedCategories, currentCategory];
      setSelectedCategories(newCategories);
      onCategoryChange(newCategories.length > 0 ? newCategories : null);
      setCurrentCategory("");
    } else if (currentCategory === "Todos") {
      setSelectedCategories([]);
      onCategoryChange(null);
      setCurrentCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    onCategoryChange(newCategories.length > 0 ? newCategories : null);
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
    onCategoryChange(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category-filter">Filtrar por Categoria</Label>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs flex items-center gap-1">
              {category}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => handleRemoveCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6" 
            onClick={clearAllCategories}
          >
            Limpar todos
          </Button>
        </div>
      )}
      
      <div className="flex gap-2">
        <Select value={currentCategory} onValueChange={setCurrentCategory}>
          <SelectTrigger id="category-filter" className="bg-muted flex-1">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {RECIPE_CATEGORIES.slice(1).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddCategory}
          disabled={!currentCategory}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilter;