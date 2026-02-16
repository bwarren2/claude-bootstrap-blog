import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const fontPath = path.resolve("public/fonts/Inter-Bold.ttf");
const fontData = fs.readFileSync(fontPath);

const statusColors: Record<string, string> = {
  complete: "#10b981",
  "in-progress": "#f59e0b",
  abandoned: "#ef4444",
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: Awaited<ReturnType<typeof getCollection>>[number] };
  const { title, description, status, techStack } = project.data as {
    title: string;
    description: string;
    status: string;
    techStack: string[];
  };

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          padding: "60px",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "20px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            backgroundColor: statusColors[status] || "#6d28d9",
                            color: "white",
                            padding: "4px 16px",
                            borderRadius: "9999px",
                            fontSize: "20px",
                            fontWeight: "bold",
                          },
                          children: status.charAt(0).toUpperCase() + status.slice(1),
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "52px",
                      fontWeight: "bold",
                      color: "#f1f5f9",
                      lineHeight: 1.2,
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#94a3b8",
                      lineHeight: 1.4,
                    },
                    children: description.length > 120 ? description.slice(0, 120) + "..." : description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", gap: "8px", flexWrap: "wrap" },
                    children: techStack.slice(0, 5).map((tech: string) => ({
                      type: "div",
                      props: {
                        style: {
                          backgroundColor: "rgba(109, 40, 217, 0.2)",
                          color: "#8b5cf6",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        },
                        children: tech,
                      },
                    })),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: "20px", color: "#64748b" },
                    children: ">_ Project Journal",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
