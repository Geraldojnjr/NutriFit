
export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Comment {
  id: string;
  recipeId: string;
  text: string;
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  videoUrl?: string;
  nutrition: Nutrition;
  createdAt: number;
  updatedAt: number;
  comments?: Comment[];
  avgRating?: number;
}