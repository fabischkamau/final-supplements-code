import { END, START, StateGraph } from "@langchain/langgraph";
import { graphState } from "./agentstate.server";
import {
  cypher,
  generate,
  gradeDocuments,
  decideToGenerate,
  vector,
  shouldContinue,
  guardRail,
  guardRailAnswer,
  noAnswerFound,
} from "./tools/nodes.server";

const workflow = new StateGraph({
  channels: graphState,
})
  // Define the nodes
  .addNode("guardRail", guardRail)
  .addNode("guardRailAnswer", guardRailAnswer)
  .addNode("cypher", cypher)
  .addNode("vector", vector)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("noAnswerFound", noAnswerFound)
  .addNode("generate", generate);

// Build graph
workflow.addEdge(START, "guardRail");
workflow.addConditionalEdges("guardRail", shouldContinue, {
  cypher: "cypher",
  guardRailAnswer: "guardRailAnswer",
});
workflow.addEdge("guardRailAnswer", "generate");
workflow.addEdge("cypher", "gradeDocuments");
workflow.addConditionalEdges("gradeDocuments", decideToGenerate, {
  vector: "vector",
  noAnswerFound: "noAnswerFound",
  generate: "generate",
});
workflow.addEdge("vector", "gradeDocuments");
workflow.addEdge("noAnswerFound", "generate");
workflow.addEdge("generate", END);

// Compile
const app = workflow.compile();

export async function call(question: string, sessionId?: string) {
  return await app.invoke({
    question,
    sessionId: sessionId,
  });
}
