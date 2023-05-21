import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    // If entries is not provided, will be automatically inferred from package.json
    entries: [
        // default
        "./src/index",
    ],
    // Generates .d.ts declaration file
    declaration: true,
    clean: true,
});
