import * as blob from "./lib/index";

describe("Index", () => {
	const NUM_EXPORTS = 6;

	test("should return N exports", () => {
		expect(Object.keys(blob)).toHaveLength(NUM_EXPORTS);
	});
});
