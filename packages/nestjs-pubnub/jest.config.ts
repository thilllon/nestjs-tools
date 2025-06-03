import type { Config } from "jest";

const config: Config = {
	displayName: "nestjs-pubnub",
	// detectLeaks: true,
	// detectOpenHandles: true,
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../../coverage/libs/nestjs-pubnub",
};

export default config;
