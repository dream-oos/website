import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string(),
  year: z.number().int(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  cover: z.string().optional(),
  order: z.number().optional(),
});

export type PostData = z.infer<typeof blogSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type PostEntry = { id: string; data: PostData };
export type ProjectEntry = { id: string; data: ProjectData };
