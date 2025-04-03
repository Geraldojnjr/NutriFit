
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    path: "/",
    icon: Home,
    label: "Receitas",
  },
  {
    path: "/search",
    icon: Search,
    label: "Buscar",
  },
  {
    path: "/add",
    icon: PlusCircle,
    label: "Add",
  },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-colors",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
