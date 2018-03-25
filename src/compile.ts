import { compileSquirrelFileToJavaScript } from "./codegen";

process.argv.slice(2).forEach((path: string) => {
  compileSquirrelFileToJavaScript(path);
});
