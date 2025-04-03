
export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
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
}
