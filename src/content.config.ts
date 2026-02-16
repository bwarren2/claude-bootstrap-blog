import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    status: z.enum(["complete", "in-progress", "abandoned"]),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    ambitionRating: z.number().min(1).max(5),

    // Links
    repoUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    transcriptUrls: z.array(z.string().url()).default([]),

    // Categorization
    techStack: z.array(z.string()).default([]),
    projectType: z.string().optional(),
    claudeTechniques: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    // Claude-specific
    promptSnippets: z
      .array(
        z.object({
          prompt: z.string(),
          context: z.string().optional(),
          effectiveness: z.enum(["high", "medium", "low"]),
          notes: z.string().optional(),
        }),
      )
      .default([]),
    costTracking: z
      .object({
        inputTokens: z.number().optional(),
        outputTokens: z.number().optional(),
        totalCost: z.number().optional(),
        sessions: z.number().optional(),
      })
      .optional(),
    lessonsLearned: z
      .object({
        whatWorked: z.array(z.string()).default([]),
        whatDidnt: z.array(z.string()).default([]),
        whatIdDoDifferently: z.array(z.string()).default([]),
      })
      .optional(),

    // Display
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    readingOrder: z.number().optional(),
  }),
});

export const collections = { projects };
