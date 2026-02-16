export interface Technique {
  id: string;
  label: string;
  description: string;
}

export const techniques: Technique[] = [
  {
    id: "plan-mode",
    label: "Plan Mode",
    description:
      "Using Claude's plan mode to design implementation before coding",
  },
  {
    id: "subagents",
    label: "Subagents",
    description: "Delegating subtasks to specialized subagents",
  },
  {
    id: "memory-files",
    label: "Memory Files",
    description: "Using CLAUDE.md and memory files for persistent context",
  },
  {
    id: "hooks",
    label: "Hooks",
    description: "Shell commands that execute in response to Claude events",
  },
  {
    id: "iterative-refinement",
    label: "Iterative Refinement",
    description: "Multiple rounds of feedback to improve output quality",
  },
  {
    id: "test-driven",
    label: "Test-Driven",
    description: "Writing tests first, then implementing with Claude",
  },
  {
    id: "code-review",
    label: "Code Review",
    description: "Using Claude to review and improve existing code",
  },
  {
    id: "scaffold-then-fill",
    label: "Scaffold Then Fill",
    description: "Having Claude create structure first, then fill in details",
  },
  {
    id: "context-priming",
    label: "Context Priming",
    description: "Providing extensive context before making requests",
  },
  {
    id: "constraint-prompting",
    label: "Constraint Prompting",
    description: "Setting explicit constraints and boundaries for output",
  },
  {
    id: "decomposition",
    label: "Decomposition",
    description: "Breaking complex tasks into smaller, manageable pieces",
  },
  {
    id: "example-driven",
    label: "Example-Driven",
    description: "Providing examples of desired output format and style",
  },
];

export function getTechnique(id: string): Technique | undefined {
  return techniques.find((t) => t.id === id);
}

export function getTechniqueLabel(id: string): string {
  return getTechnique(id)?.label ?? id;
}
