import { call } from "./index.server";

describe("GenAi Test", () => {
  it("should call Generative AI", async () => {
    const res = await call(
      "List supplements that can help with hair growth",
      "a86267e8-bf01-464f-9053-fa6564b8ff85"
    );
    expect(res).toBeDefined();
    console.log("---ANSWER---");
    console.log(res.generation);
  });
});
