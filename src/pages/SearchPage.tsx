
import { useRecipes } from "@/context/RecipeContext";
import MainLayout from "@/components/layout/MainLayout";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";

const SearchPage = () => {
  const { filteredRecipes, searchTerm } = useRecipes();

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <div className="sticky top-0 z-10 bg-background pb-4 pt-2">
          <h1 className="text-2xl font-bold mb-4">Buscar Receitas</h1>
          <SearchBar autoFocus />
        </div>

        {searchTerm && (
          <p className="text-sm text-muted-foreground">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? "resultado" : "resultados"} encontrados para "{searchTerm}"
          </p>
        )}

        {!searchTerm ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
            <p className="text-muted-foreground">
              Digite um termo para buscar receitas ou ingredientes
            </p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Nenhuma receita encontrada</h3>
            <p className="text-muted-foreground">
              Tente um termo de busca diferente
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
