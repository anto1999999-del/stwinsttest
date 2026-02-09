export interface Part {
  id: string;
  title: string;
  price: number;
  year: number;
  model: string | null; // Allow model to be nullable
  category: string;
  image: string;
  inventoryId?: string;
}
