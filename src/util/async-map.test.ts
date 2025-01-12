import { asyncMap } from "./async-map";

describe("asyncMap", () => {
  it("should map an array using an async callback", async () => {
    const input = [1, 2, 3];
    const callback = async (x: number) => x * 2;
    const result = await asyncMap(input, callback);
    expect(result).toEqual([2, 4, 6]);
  });

  it("should return an empty array when the input is empty", async () => {
    const result = await asyncMap([], async () => 1);
    expect(result).toEqual([]);
  });

  it("should correctly handle errors in the callback", async () => {
    const input = [1, 2, 3];
    const callback = async (x: number) => {
      if (x === 2) {
        throw new Error("error");
      }
      return x * 2;
    };

    try {
      await asyncMap(input, callback);
    } catch (error: any) {
      expect(error.message).toEqual("error");
    }
  });
});
