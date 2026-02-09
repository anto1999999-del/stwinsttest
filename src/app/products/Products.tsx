import { Product } from "@/features/products/api/types";
import ProductCard from "@/features/products/components/ProductCard";
import React from "react";

// Component migrated from legacy Pages Router location (src/pages/products/ui/Products.tsx)
const Products: React.FC = () => {
  return (
    <div>
      {mockProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;

// Temporary mock data (replace with real data fetching)
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Product 1",
    description: "Description for Product 1",
    price: 100,
    categoryId: "category-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: "https://via.placeholder.com/150",
    stock: 10,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Product 2",
    description: "Description for Product 2",
    price: 200,
    categoryId: "category-2",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: "https://via.placeholder.com/150",
    stock: 5,
    rating: 4.0,
  },
  {
    id: "3",
    name: "Product 3",
    description: "Description for Product 3",
    price: 300,
    categoryId: "category-3",
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: "https://via.placeholder.com/150",
    stock: 0,
    rating: 3.5,
  },
];
