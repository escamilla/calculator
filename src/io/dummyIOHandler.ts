import IOHandler from "./IOHandler.ts";

const dummyIOHandler: IOHandler = {
  print(): void {
    throw new Error("not implemented");
  },
  printLine(): void {
    throw new Error("not implemented");
  },
  readLine(): string {
    throw new Error("not implemented");
  },
  readFile(): string {
    throw new Error("not implemented");
  },
};

export default dummyIOHandler;
