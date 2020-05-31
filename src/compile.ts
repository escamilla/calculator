import { compileChipmunkFileToJavaScript } from "./codegen.ts";

for (const path of Deno.args) {
  compileChipmunkFileToJavaScript(path);
}
