interface IOHandler {
  print: (message: string) => void;
  printLine: (message?: string) => void;
  readLine: (prompt: string) => string;
  readFile: (path: string) => string;
}

export default IOHandler;
