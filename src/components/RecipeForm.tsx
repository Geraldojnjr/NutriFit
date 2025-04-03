import { useState } from "react";
import { Recipe, Nutrition } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">) => void;
  isSubmitting?: boolean;
}

const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

const RecipeForm = ({ initialData, onSubmit, isSubmitting = false }: RecipeFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""]);
  const [steps, setSteps] = useState<string[]>(initialData?.steps || [""]);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [nutrition, setNutrition] = useState<Nutrition>(initialData?.nutrition || emptyNutrition);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };

  const handleNutritionChange = (key: keyof Nutrition, value: string) => {
    let processedValue = value.replace(',', '.');
    const numValue = processedValue === "" ? 0 : Number(processedValue);
    
    setNutrition({
      ...nutrition,
      [key]: numValue,
    });
  };

  const handleAddCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter((i) => i.trim() !== "");
    const filteredSteps = steps.filter((s) => s.trim() !== "");

    onSubmit({
      name,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      nutrition,
      categories: categories.length > 0 ? categories : undefined,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      toast.error("Por favor, selecione apenas arquivos de imagem (JPG, PNG ou GIF)");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      console.log('Sending upload request to:', "/api/upload");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log('Upload response status:', response.status);
      const responseText = await response.text();
      console.log('Upload response text:', responseText);

      if (!response.ok) {
        throw new Error(`Upload failed: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Upload successful, received URL:', data.url);
      
      if (!data.url) {
        throw new Error('No URL received from server');
      }
      
      setImageUrl(data.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erro ao fazer upload da imagem");
      setImageUrl(""); // Clear the image URL on error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Receita</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome da receita"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem da Receita</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>
          {imageUrl && (
            <div className="relative w-20 h-20">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => setImageUrl("")}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
        </p>
      </div>

      <div className="space-y-2">
         <Label>Categorias</Label>
         <div className="flex flex-wrap gap-1 mb-2">
           {categories.map((cat, index) => (
             <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
               {cat}
               <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 className="h-4 w-4 p-0"
                 onClick={() => handleRemoveCategory(cat)}
               >
                 <X className="h-3 w-3" />
               </Button>
             </Badge>
           ))}
         </div>
         <div className="flex gap-2">
           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
             <SelectTrigger className="flex-1">
               <SelectValue placeholder="Selecione uma categoria" />
             </SelectTrigger>
             <SelectContent>
               {RECIPE_CATEGORIES.filter(cat => !categories.includes(cat)).map((cat) => (
                 <SelectItem key={cat} value={cat}>
                   {cat}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Button 
             type="button" 
             variant="outline" 
             onClick={handleAddCategory}
             disabled={!selectedCategory}
           >
             <Plus className="h-4 w-4" />
             Adicionar
           </Button>
         </div>
       </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Ingredientes</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddIngredient}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Ingrediente
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingrediente ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => handleRemoveIngredient(index)}
                disabled={ingredients.length <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Modo de Preparo</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddStep}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Passo
          </Button>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder={`Passo ${index + 1}`}
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 mt-1"
                onClick={() => handleRemoveStep(index)}
                disabled={steps.length <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Informações Nutricionais</Label>
        <Card>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias (kcal)</Label>
              <Input
                id="calories"
                type="text"
                value={nutrition.calories || ""}
                onChange={(e) => handleNutritionChange("calories", e.target.value)}
                placeholder="Calorias"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Proteínas (g)</Label>
              <Input
                id="protein"
                type="text"
                value={nutrition.protein || ""}
                onChange={(e) => handleNutritionChange("protein", e.target.value)}
                placeholder="Proteínas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carboidratos (g)</Label>
              <Input
                id="carbs"
                type="text"
                value={nutrition.carbs || ""}
                onChange={(e) => handleNutritionChange("carbs", e.target.value)}
                placeholder="Carboidratos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Gorduras (g)</Label>
              <Input
                id="fat"
                type="text"
                value={nutrition.fat || ""}
                onChange={(e) => handleNutritionChange("fat", e.target.value)}
                placeholder="Gorduras"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="videoUrl">URL do Vídeo (opcional)</Label>
        <Input
          id="videoUrl"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Digite a URL do vídeo"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting 
          ? "Salvando..." 
          : initialData 
            ? "Atualizar Receita" 
            : "Adicionar Receita"}
      </Button>
    </form>
  );
};

export default RecipeForm;
