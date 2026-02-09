class ProductApiEndpoints {
  private readonly baseUrl = "/products";

  byId = (productId: string) => `${this.baseUrl}/${productId}`;
  byCategory = (categoryId: string) => `${this.baseUrl}/category/${categoryId}`;

  get root() {
    return this.baseUrl;
  }
}

export const productApiEndpoints = new ProductApiEndpoints();
