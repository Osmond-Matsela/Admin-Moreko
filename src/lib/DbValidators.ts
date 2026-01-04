// lib/DbSchemas.ts
import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  createdAt: z.string().optional(),
});

// Parent schema
export const ParentSchema = z.object({
  id: z.string(),
  name: z.string(),
  contact: z.string(),
  address: z.string().optional(),
  relation: z.string().optional(),
  createdAt: z.string().optional(),
});

// Post schema
export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string().optional(),
});

// Article schema
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  authorId: z.string(),
  createdAt: z.string().optional(),
});

// Array schemas for bulk operations
export const ParentsArraySchema = z.array(ParentSchema);
export const UsersArraySchema = z.array(UserSchema);
export const PostsArraySchema = z.array(PostSchema);
export const ArticlesArraySchema = z.array(ArticleSchema);
