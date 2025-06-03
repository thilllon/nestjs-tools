import { ConfigurableModuleBuilder } from "@nestjs/common";
import { PubnubConfig } from "pubnub";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<PubnubConfig>().build();

export const getOptionsToken = (alias = "") => {
	return MODULE_OPTIONS_TOKEN.toString() + alias;
};
