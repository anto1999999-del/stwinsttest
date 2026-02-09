import { z } from "zod";

// Base product schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).default(0),
});

// Base review schema
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100),
  comment: z.string().min(1).max(1000),
  verified: z.boolean().default(false),
  helpful: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for review query parameters
export const ReviewQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(["createdAt", "rating", "helpful"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Schema for marking review as helpful
export const MarkHelpfulSchema = z.object({
  reviewId: z.string().uuid(),
  helpful: z.boolean(),
});

// Type exports
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewQuery = z.infer<typeof ReviewQuerySchema>;
export type MarkHelpful = z.infer<typeof MarkHelpfulSchema>;
