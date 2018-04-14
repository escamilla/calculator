import { compileChipmunkFileToJavaScript } from "./codegen";

process.argv.slice(2).forEach((path: string) => {
  compileChipmunkFileToJavaScript(path);
});
