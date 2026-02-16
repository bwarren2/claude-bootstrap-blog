import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const projects = await getCollection("projects", ({ data }) => !data.draft);

  return rss({
    title: "Project Journal",
    description:
      "Documenting AI-assisted development projects built with Claude Code.",
    site: context.site!,
    items: projects
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map((project) => ({
        title: project.data.title,
        pubDate: project.data.pubDate,
        description: project.data.description,
        link: `/projects/${project.id}/`,
      })),
  });
}
