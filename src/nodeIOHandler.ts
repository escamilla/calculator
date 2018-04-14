import * as fs from "fs";
import * as readlineSync from "readline-sync";

import { IOHandler } from "chipmunk-core";

const nodeIOHandler: IOHandler = {
  print(message: string): void {
    process.stdout.write(message);
  },
  printLine(message?: string): void {
    if (message === undefined) {
      process.stdout.write("\n");
    } else {
      process.stdout.write(message + "\n");
    }
  },
  readLine(prompt: string): string {
    const line: string = readlineSync.question(prompt);
    return line;
  },
  readFile(path: string): string {
    const contents: string = fs.readFileSync(path).toString();
    return contents;
  },
};

export default nodeIOHandler;
