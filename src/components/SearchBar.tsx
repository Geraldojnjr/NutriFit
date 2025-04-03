
import { Search } from "lucide-react";
import { useRecipes } from "@/context/RecipeContext";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
  autoFocus?: boolean;
}

const SearchBar = ({ autoFocus = false }: SearchBarProps) => {
  const { searchTerm, setSearchTerm } = useRecipes();
  const location = useLocation();
  const navigate = useNavigate();

  // Clear search when navigating away from search page
  useEffect(() => {
    if (location.pathname !== "/search" && searchTerm && !autoFocus) {
      setSearchTerm("");
    }
  }, [location.pathname, searchTerm, setSearchTerm, autoFocus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Navigate to search page if not already there
    if (location.pathname !== "/search" && e.target.value) {
      navigate("/search");
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Buscar receitas ou ingredientes..."
        className="pl-10 w-full bg-muted"
        value={searchTerm}
        onChange={handleSearch}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default SearchBar;
