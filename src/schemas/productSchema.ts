import { z } from 'zod';

// Zod schema for a single product
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

// Zod schema for the full products response
export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductsResponseSchemaType = z.infer<typeof ProductsResponseSchema>;
