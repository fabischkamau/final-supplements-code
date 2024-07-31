import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { GraphState } from "../agentstate.server";
import { initRetrievalChain } from "./vector.server";
import { llm } from "../llm.server";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputToolsParser } from "langchain/output_parsers";
import { saveHistory } from "./history.server";
// Data model (create via a LangChain tool)
const zodScore = z.object({
  binaryScore: z.enum(["yes", "no"]).describe("Relevance score 'yes' or 'no'"),
});
class Grade extends StructuredTool<typeof zodScore> {
  name = "grade";
  description =
    "Grade the relevance of the retrieved documents to the question. Either 'yes' or 'no'.";
  schema = zodScore;
  async _call(input: z.infer<(typeof this)["schema"]>) {
    return JSON.stringify(input);
  }
}
export const gradeTool = new Grade();

export async function cypher(state: GraphState) {
  console.log("---CYPHER RETRIEVER---");
  console.log(state);
  const documents = (await initRetrievalChain()).invoke({
    message: state.question,
  });
  console.log("---CYPHER DOCUMENTS---");
  console.log(await documents);
  return {
    documents: documents,
    tools: "cypher",
  };
}
export async function vector(state: GraphState) {
  console.log("---VECTOR RETRIEVER---");
  console.log(state);
  const documents = (await initRetrievalChain()).invoke({
    message: state.question,
  });
  console.log("---VECTOR DOCUMENTS---");
  console.log(await documents);
  return {
    documents: documents,
    tools: "vector",
  };
}

export async function generate(state: GraphState) {
  console.log("---GENERATE ANSWER---");
  await saveHistory(state.sessionId, state.question, state.documents);
  return {
    generation: state?.documents,
  };
}

/**
 * Determines whether the retrieved documents are relevant to the question.
 *
 * @param {GraphState} state The current state of the graph.
 * @param {RunnableConfig | undefined} config The configuration object for tracing.
 * @returns {Promise<GraphState>} The new state object.
 */
export async function gradeDocuments(state: GraphState) {
  console.log("---CHECK RELEVANCE DOCUMENTS---");

  const parser = new JsonOutputToolsParser();

  // LLM with tool and enforce invocation
  const llmWithTool = llm.bindTools([gradeTool], {
    tool_choice: { type: "function", function: { name: gradeTool.name } },
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a grader assessing relevance of a retrieved document to a user question.
  Here is the retrieved document:
  
  {context}
  
  Here is the user question: {question}

  If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.`
  );

  // Chain
  const chain = prompt.pipe(llmWithTool).pipe(parser);

  const grade = await chain.invoke({
    context: state.documents,
    question: state.question,
  });

  const { args } = grade[0];
  if (args.binaryScore === "yes") {
    return {
      grade: "yes",
    };
  }
  return {
    grade: "no",
  };
}

export async function guardRailAnswer(state: GraphState) {
  console.log("---GUARDRAIL ANSWER---");
  return {
    documents:
      "The question you asked is beyond the scope of my domain, Please try again and ask something about Nutritional Supplements.",
  };
}
export async function noAnswerFound(state: GraphState) {
  console.log("---GUARDRAIL ANSWER---");
  return {
    documents:
      "The question you asked is beyond the scope of my domain, Please try again and ask something about Nutritional Supplements.",
  };
}

export async function decideToGenerate(state: GraphState) {
  console.log("---CONTINUE TO NEXT TOOL OR GENERATE---");
  if (state.grade === "no" && state.tools === "cypher") {
    console.log("yes");
    return "vector";
  }

  if (state.grade === "no" && state.tools === "vector") {
    console.log("yes");
    return "generate";
  }
  if (state.grade === "yes") {
    console.log("no");
    return "generate";
  }
  console.log("no");
  return "noAnswerFound";
}

export async function guardRail(state: GraphState) {
  console.log("---CHECK IF QUESTION IS IN DOMAIN---");

  const parser = new JsonOutputToolsParser();

  // LLM with tool and enforce invocation
  const llmWithTool = llm.bindTools([gradeTool], {
    tool_choice: { type: "function", function: { name: gradeTool.name } },
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `You are a grader assessing relevance of a user question is in relation to the domain of Nutritional Suppplements.
  Follow the rules below to come to your conclusion: is the retrieved document:
   * Check if the question relates to listing, showing or searching Ingredients, Categories, Brands or General Supplement or Products
   * Check if the question relates to the description of a supplement or product.
   * Check if the question is in the domain of the listed above instructions.
  Here is the user question: {question}

  If the question is about supplements or products or ingredients or categories or brands of a product or supplements, grade it as relevant.
  Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.`
  );

  // Chain
  const chain = prompt.pipe(llmWithTool).pipe(parser);

  const grade = await chain.invoke({
    context: state.documents,
    question: state.question,
  });

  const { args } = grade[0];
  if (args.binaryScore === "yes") {
    return {
      continue: "yes",
    };
  }

  return {
    continue: "no",
  };
}

export async function shouldContinue(state: GraphState) {
  console.log("---CONTINUE TO NEXT TOOL---");
  if (state.continue === "yes") {
    console.log("yes");
    return "cypher";
  }
  console.log("no");
  return "guardRailAnswer";
}
