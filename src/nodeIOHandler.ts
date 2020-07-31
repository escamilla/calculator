import IOHandler from "./io/IOHandler.ts";

const nodeIOHandler: IOHandler = {
  print(message: string): void {
    Deno.stdout.writeSync(new TextEncoder().encode(message));
  },
  printLine(message?: string): void {
    if (message === undefined) {
      Deno.stdout.writeSync(new TextEncoder().encode("\n"));
    } else {
      Deno.stdout.writeSync(new TextEncoder().encode(message + "\n"));
    }
  },
  readLine(prompt: string): string {
    throw new Error("not implemented");
  },
  readFile(path: string): string {
    return Deno.readTextFileSync(path);
  },
};

export default nodeIOHandler;
