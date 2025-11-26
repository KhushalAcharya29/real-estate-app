import { createRequire } from "module";
const require = createRequire(import.meta.url);

try {
  const { createTscAlias } = require("tsc-alias");
  const path = require("path");

  const project = path.resolve("tsconfig.json");
  console.log("🛠 Running tsc-alias programmatically...");
  await createTscAlias({ project });
  console.log("✅ tsc-alias completed successfully");
} catch (err) {
  console.error("⚠️ Failed to run tsc-alias fix:", err);
}
