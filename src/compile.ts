import { compileChipmunkFileToJavaScript } from "./codegen.ts";

Deno.args.forEach((path: string) => {
  compileChipmunkFileToJavaScript(path);
});
