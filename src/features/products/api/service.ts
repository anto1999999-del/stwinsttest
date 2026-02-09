export const productService = {
  async getAllProducts() {
    // some axios or fetch call to get all products
    return [];
  },

  async getProductById({ productId }: { productId: string }) {
    // some axios or fetch call to get a product by ID
    // console.log(`Fetching product with ID: ${productId}`);

    return {};
  },
};
