export const productQueries = {
  all: () => ["products"],
  byId: (productId: string) => [...productQueries.all(), productId],
};
