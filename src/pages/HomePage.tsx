
import { useRecipes } from "@/context/RecipeContext";
import MainLayout from "@/components/layout/MainLayout";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";

const HomePage = () => {
  const { recipes, loading } = useRecipes();

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <div className="sticky top-0 z-10 bg-background pb-4 pt-2">
          <h1 className="text-2xl font-bold mb-4">NutriFit</h1>
          <SearchBar />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Carregando receitas...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Nenhuma receita ainda</h3>
            <p className="text-muted-foreground mb-4">
              Adicione sua primeira receita para começar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
