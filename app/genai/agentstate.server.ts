import { StateGraphArgs } from "@langchain/langgraph";

/**
 * Represents the state of our graph.
 */
export type GraphState = {
  documents: string;
  question: string;
  rephrased: string;
  history?: any;
  tools: string;
  grade: string;
  continue: string;
  sessionId: string;
  generation?: string;
};

export const graphState: StateGraphArgs<GraphState>["channels"] = {
  documents: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  question: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  rephrased: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  history: {
    value: (left?: string, right?: string) => (right ? right : left),
    default: () => undefined,
  },
  tools: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  grade: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  continue: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  sessionId: {
    value: (left?: string, right?: string) => (right ? right : left || ""),
    default: () => "",
  },
  generation: {
    value: (left?: string, right?: string) => (right ? right : left),
    default: () => undefined,
  },
};
