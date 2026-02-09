"use client";

import SingleProductPage from "./SingleProductPage";

interface Product {
  id: string;
  title: string;
  price: number;
  stock: string;
  model: string;
  year: number;
  stockNumber: string;
  tagNumber: string;
  odometer: number;
  make: string;
  description: string;
  mainImage: string;
  thumbnailImage: string;
  gallery: string[];
  tag: number;
  odo: string;
  desc: string;
  manufacturer: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  inventoryId?: string;
  category: string;
}

const SingleProductDemo = ({ productData }: { productData: Product }) => {
  return <SingleProductPage product={productData} />;
};

export default SingleProductDemo;
