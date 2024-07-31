import { PromptTemplate } from "@langchain/core/prompts";

const template = `

## Here are some supplements for you: *Edit this part to suit the user question*

### HMB for Lean Muscle Support - 1,000 MG (90 Tablets)

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/2247724_01?$OP_PLP$" alt="HMB Image 1" style="width: 30%; max-width: 200px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/1654177_01?$OP_PLP$" alt="HMB Image 2" style="width: 30%; max-width: 200px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/1991298_01?$OP_PLP$" alt="HMB Image 3" style="width: 30%; max-width: 200px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/2247724_01?$OP_PLP$" alt="HMB Image 4" style="width: 30%; max-width: 200px;">
</div>

- **Price:** $24
- **Form:** Tablet
- **Size:** 90 Tablets
- **Serving Size:** 90
- **Brand:** HMB
- **Contains ingredients like:** Calcium β-Hydroxy β-Methylbutyrate (HMB), Calcium, and more.

[View Details](https://www.vitaminshoppe.com/p/resveratrol-1000-mg-60-veggie-capsules/4r-1079)

### One Daily Men's Sport Multivitamin (60 Tablets)

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/2247724_01?$OP_PLP$" alt="Men's Sport Multivitamin Image 1" style="width: 30%; max-width: 200px; height: 150px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/1654177_01?$OP_PLP$" alt="Men's Sport Multivitamin Image 2" style="width: 30%; max-width: 200px; height: 150px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/1991298_01?$OP_PLP$" alt="Men's Sport Multivitamin Image 3" style="width: 30%; max-width: 200px; height: 150px;">
  <img src="https://s7media.vitaminshoppe.com/is/image/VitaminShoppe/2247724_01?$OP_PLP$" alt="Men's Sport Multivitamin Image 4" style="width: 30%; max-width: 200px; height: 150px;">
</div>

- **Price:** $24
- **Form:** Tablet
- **Size:** 90 Tablets
- **Serving Size:** 90
- **Brand:** HMB
- **Contains ingredients like:** Calcium β-Hydroxy β-Methylbutyrate (HMB), Calcium, and more.

[View Details](https://www.vitaminshoppe.com/p/resveratrol-1000-mg-60-veggie-capsules/4r-1079)

These products offer different benefits to support your health and wellness goals. Refer to the details of each supplement to see if they align with your specific needs.


`;

const qaTemplate = `You are an assistant for question-answering recommending Nutritionals Supplements that a user should buy from the relevant supplements that are in the context.\n
    Do not doubt the the context. Use the retrieved in context to answer the question.\n
    The information part contains the provided information that you must use to construct an answer.\n
    The provided information is authoritative, you must never doubt it or try to use your internal knowledge to correct it.\n
    Make the answer sound as a response to the question. Do not mention that you based the result on the given information.\n
    
    If you don't know the answer, just say that you don't know.\n
    If context is empty, just say that you don't know the answer.\n
    Do not use your pre-trained knowledge to answer.Do not fall back to your pre-trained knowledge to answer. \n
    Always list atleast three to five products or supplements from the information.\n
    Pick random products or supplements from the information and return them in the format below.\n
    Avoid listing products with very close or similar names.
    You are to format your answer based on the template provided.
      * Add extra information from the context to the template to make it more informative.
      * Avoid Items with very similar names.
      * List the necessary ingredients for the product.

    Template:
    ${template}

  
    Follow this example when generating answers.
    If the provided information is empty, say that you don't know the answer.

    Question:
    {question}

    {context}

    Answer:`;

export const qaPrompt = PromptTemplate.fromTemplate(qaTemplate);
