import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const projects = await getCollection("projects", ({ data }) => !data.draft);

  const searchIndex = projects.map((project) => ({
    id: project.id,
    title: project.data.title,
    description: project.data.description,
    status: project.data.status,
    difficulty: project.data.difficulty,
    techStack: project.data.techStack,
    tags: project.data.tags,
    claudeTechniques: project.data.claudeTechniques,
    pubDate: project.data.pubDate.toISOString(),
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: { "Content-Type": "application/json" },
  });
};
