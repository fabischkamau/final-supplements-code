import { GraphCypherQAChain } from "@langchain/community/chains/graph_qa/cypher";
import { initGraph } from "../graph.server";
import { llm } from "../llm.server";
import { PromptTemplate } from "@langchain/core/prompts";
import { qaPrompt } from "./qatemplate.server";

export async function initCypherQAChain() {
  const graph = await initGraph();
  await graph.refreshSchema();
  const cypherTemplate = `Task:Generate Cypher statement to query a graph database.
Instructions:
Use only the provided relationship types and properties in the schema.
Do not use any other relationship types or properties that are not provided.

Schema:
{schema}
Note: Do not include any explanations or apologies in your responses.
Do not respond to any questions that might ask anything else than for you to construct a Cypher statement.
Do not include any text except the generated Cypher statement.
Limit the maximum number of results to 10.
Do not return embedding property.
Include extra information about the nodes that may help an LLM provide a more informative answer, for example the release thumbnails, price, allergens or warnings.

Fine Tuning:

Example Cypher Statements:
    Example Question #1: List some suppliments available.
    Example Cypher:
    \`\`\`
    MATCH (b)<-[:IN_BRAND]-(p:Suppliment:Product)-[:HAS_INGREDIENT]->(i)
    RETURN p.name as product , p.description as description, p.price as price,  p.thumbnails as image, p.allergens as allergens, p.warnings as warnings, p.url as url , p.servingSize as servingSize, p.numberOfServings as numberOfServings, b.name as brand, i.name as ingredient, i.details as ingredientDetails, i.unit as ingredientUnit,i.rdaPercnt as ingredientRdaPercnt, i.amountContained as ingredientAmountContained
    LIMIT 10
    \`\`\`

    Example Question #2: List products or supplements with zinc.
    Example Cypher:
    \`\`\`
    MATCH (i:Ingredient)<-[:HAS_INGREDIENT]-(p:Suppliment:Product)-[:IN_BRAND]-(b)
    WHERE i.name CONTAINS 'Zinc' OR i.description CONTAINS 'Zinc' OR i.description CONTAINS 'zinc'
    RETURN p.name as product , p.description as description, p.price as price,  p.thumbnails as image, p.allergens as allergens, p.warnings as warnings, p.url as url , p.servingSize as servingSize, p.numberOfServings as numberOfServings, b.name as brand, i.name as ingredient, i.details as ingredientDetails, i.unit as ingredientUnit,i.rdaPercnt as ingredientRdaPercnt, i.amountContained as ingredientAmountContained
    LIMIT 10
    \`\`\`
 
    Example Cypher

Question:

The question is:
{question}`;

  const cypherPrompt = new PromptTemplate({
    template: cypherTemplate,
    inputVariables: ["schema", "question"],
  });

  const chain = GraphCypherQAChain.fromLLM({
    graph,
    llm: llm,
    cypherPrompt,
    qaPrompt,
    returnIntermediateSteps: true,
  });
  return chain;
}
