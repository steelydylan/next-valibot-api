import defaltConfig from "./config";
import { createProgram } from "./createProgram";
import { emitModulesShim } from "./emitModulesShim";
import { mapFileInfo } from "./mapFileInfo";
import fs from "fs";
import type { Config } from "./types";

export async function main(config?: Config) {
  const { appDir, baseDir, distDir, moduleNameSpace } = Object.assign(
    {},
    defaltConfig,
    config
  );
  const pkg = {
    name: moduleNameSpace,
    version: "1.0.0",
    types: "index.d.ts",
  };
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  if (!fs.existsSync(distDir + "/package.json")) {
    fs.writeFileSync(`${distDir}/package.json`, JSON.stringify(pkg, null, 2));
  }
  const apiDir = appDir + "/api";
  const program = createProgram(baseDir);
  const fileInfos = program
    .getRootFileNames()
    .filter((fileName) => fileName.match(apiDir))
    .map(mapFileInfo(distDir, appDir, program));
  emitModulesShim(fileInfos, moduleNameSpace, distDir);
}
