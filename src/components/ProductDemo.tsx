"use client";

import ProductDetail from "./ProductDetail";

const ProductDemo = () => {
  // Sample data for the Renault Clio Engine
  const renaultClioEngine = {
    id: "renault-clio-engine-001",
    title:
      "2019 Renault Clio Engine Petrol 1.2 H5F Turbo X98 09/13-10/19 340598",
    price: 3200,
    stockNumber: "00009074",
    model: "CLIO",
    year: 2019,
    make: "RENAULT",
    description: "PETROL, 1.2, H5F, TURBO, X98, 09/13-10/19",
    tagNumber: "340598",
    odometer: "67390 Kms",
    images: [
      "/engine-1.jpg", // Main engine image
      "/engine-2.jpg", // Alternative angle
      "/engine-3.jpg", // Detail shot
    ],
  };

  return <ProductDetail {...renaultClioEngine} />;
};

export default ProductDemo;

