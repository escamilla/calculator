import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import dummyIOHandler from "./io/dummyIOHandler";
import IOHandler from "./io/IOHandler";
import SquirrelBoolean from "./nodes/SquirrelBoolean";
import SquirrelList from "./nodes/SquirrelList";
import SquirrelNil from "./nodes/SquirrelNil";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";
import SquirrelNumber from "./nodes/SquirrelNumber";
import SquirrelString from "./nodes/SquirrelString";
import Parser from "./Parser";
import Tokenizer from "./Tokenizer";
import toString from "./utils/toString";

const replEnv: Environment = new Environment();

type SquirrelCallable = (args: SquirrelNode[], ioHandler: IOHandler) => SquirrelNode;

function defineSquirrelFunction(name: string, callable: SquirrelCallable): void {
  replEnv.set(name, {
    type: SquirrelNodeType.FUNCTION,
    callable,
    isUserDefined: false,
    name,
  });
}

defineSquirrelFunction("+",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value + y.value };
  },
);

defineSquirrelFunction("-",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value - y.value };
  },
);

defineSquirrelFunction("*",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value * y.value };
  },
);

defineSquirrelFunction("/",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value / y.value };
  },
);

defineSquirrelFunction("%",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value % y.value };
  },
);

defineSquirrelFunction("pow",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: Math.pow(x.value, y.value) };
  },
);

defineSquirrelFunction("=",
  (args: SquirrelNode[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value === y.value };
  },
);

defineSquirrelFunction("<",
  (args: SquirrelNode[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value < y.value };
  },
);

defineSquirrelFunction(">",
  (args: SquirrelNode[]): SquirrelNode => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value > y.value };
  },
);

defineSquirrelFunction("list",
  (args: SquirrelNode[]): SquirrelList => {
    return { type: SquirrelNodeType.LIST, items: args };
  },
);

defineSquirrelFunction("length",
  (args: SquirrelNode[]): SquirrelNumber => {
    const arg: SquirrelNode = args[0];
    if (arg.type === SquirrelNodeType.LIST) {
      return { type: SquirrelNodeType.NUMBER, value: arg.items.length };
    } else if (arg.type === SquirrelNodeType.STRING) {
      return { type: SquirrelNodeType.NUMBER, value: arg.value.length };
    } else {
      throw new Error("length() takes a list or string");
    }
  },
);

defineSquirrelFunction("nth",
  (args: SquirrelNode[]): SquirrelNode => {
    const arg: SquirrelNode = args[0];
    const index: SquirrelNumber = args[1] as SquirrelNumber;

    if (arg.type === SquirrelNodeType.LIST) {
      return arg.items[index.value];
    } else if (arg.type === SquirrelNodeType.STRING) {
      return { type: SquirrelNodeType.STRING, value: arg.value.charAt(index.value) };
    } else {
      throw new Error("nth() takes a list or string");
    }
  },
);

defineSquirrelFunction("slice",
  (args: SquirrelNode[]): SquirrelList => {
    const list: SquirrelList = args[0] as SquirrelList;
    const start: SquirrelNumber = args[1] as SquirrelNumber;
    const end: SquirrelNumber = args[2] as SquirrelNumber;
    return { type: SquirrelNodeType.LIST, items: list.items.slice(start.value, end.value) };
  },
);

defineSquirrelFunction("join",
  (args: SquirrelNode[]): SquirrelList => {
    const list1: SquirrelList = args[0] as SquirrelList;
    const list2: SquirrelList = args[1] as SquirrelList;
    return { type: SquirrelNodeType.LIST, items: list1.items.concat(list2.items) };
  },
);

defineSquirrelFunction("concat",
  (args: SquirrelNode[]): SquirrelString => {
    const castedArgs: SquirrelString[] = args.map((arg: SquirrelNode) => arg as SquirrelString);
    const strings: string[] = castedArgs.map((arg: SquirrelString) => arg.value);
    return { type: SquirrelNodeType.STRING, value: strings.join("") };
  },
);

defineSquirrelFunction("to-string",
  (args: SquirrelNode[]): SquirrelString => {
    return { type: SquirrelNodeType.STRING, value: toString(args[0]) };
  },
);

defineSquirrelFunction("print",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNil => {
    const message: string = toString(args[0], true);
    ioHandler.print(message);
    return { type: SquirrelNodeType.NIL };
  },
);

defineSquirrelFunction("print-line",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNil => {
    if (args.length === 0) {
      ioHandler.printLine();
    } else {
      const message: string = toString(args[0], true);
      ioHandler.printLine(message);
    }
    return { type: SquirrelNodeType.NIL };
  },
);

defineSquirrelFunction("parse-string",
  (args: SquirrelNode[]): SquirrelNode => {
    const input: SquirrelString = args[0] as SquirrelString;
    const tokenizer: Tokenizer = new Tokenizer(input.value);
    const parser: Parser = new Parser(tokenizer.tokenize());
    return parser.parse();
  },
);

defineSquirrelFunction("read-file",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelString => {
    const path: string = (args[0] as SquirrelString).value;
    const contents: string = ioHandler.readFile(path);
    return { type: SquirrelNodeType.STRING, value: contents };
  },
);

defineSquirrelFunction("read-line",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelString => {
    const prompt: string = (args[0] as SquirrelString).value;
    const line: string = ioHandler.readLine(prompt);
    return { type: SquirrelNodeType.STRING, value: line };
  },
);

defineSquirrelFunction("do",
  (args: SquirrelNode[]): SquirrelNode => {
    return args[args.length - 1];
  },
);

defineSquirrelFunction("eval",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNode => {
    return evaluate(args[0], replEnv, ioHandler);
  },
);

replEnv.set("nil", { type: SquirrelNodeType.NIL });
replEnv.set("true", { type: SquirrelNodeType.BOOLEAN, value: true });
replEnv.set("false", { type: SquirrelNodeType.BOOLEAN, value: false });

const inputs: string[] = [
  // logic functions
  `(def not (lambda (x) (if x false true)))`,
  `(def and (lambda (x y) (if x y false)))`,
  `(def or (lambda (x y) (if x true y)))`,
  `(def != (lambda (x y) (not (= x y))))`,
  `(def <= (lambda (x y) (or (< x y) (= x y))))`,
  `(def >= (lambda (x y) (or (> x y) (= x y))))`,
  // math functions
  `(def even? (lambda (x) (= 0 (% x 2))))`,
  `(def odd? (lambda (x) (= 1 (% x 2))))`,
  `(def abs (lambda (x)
     (if (< x 0) (- 0 x) x)))`,
  `(def factorial (lambda (x) (if (= x 0) 1 (* x (factorial (- x 1))))))`,
  // list functions
  `(def empty? (lambda (collection)
     (= 0 (length collection))))`,
  `(def head (lambda (collection)
     (nth collection 0)))`,
  `(def tail (lambda (collection)
     (slice collection 1 (+ (length collection) 1))))`,
  `(def range (lambda (x)
     (if (<= x 0)
       '()
       (join (range (- x 1))
             (list (- x 1))))))`,
  `(def map (lambda (function collection)
     (if (empty? collection)
       '()
       (join (list (function (head collection)))
             (map function (tail collection))))))`,
  `(def filter (lambda (predicate collection)
     (if (empty? collection)
       '()
       (join (if (predicate (head collection))
               (list (head collection))
               '())
             (filter predicate (tail collection))))))`,
  `(def any? (lambda (predicate collection)
     (if (empty? collection)
       false
       (if (predicate (head collection))
         true
         (any? predicate (tail collection))))))`,
  `(def every? (lambda (predicate collection)
     (if (empty? collection)
       false
       (if (predicate (head collection))
         true
         (every? predicate (tail collection))))))`,
  `(def reduce (lambda (function value collection)
     (if (empty? collection)
       value
       (reduce function
               (function value (head collection))
               (tail collection)))))`,
  `(def sum (lambda (collection)
     (reduce + 0 collection)))`,
  `(def product (lambda (collection)
     (reduce * 1 collection)))`,
  `(def contains? (lambda (collection value)
     (if (empty? collection)
       false
       (if (= (head collection) value)
         true
         (contains? (tail collection) value)))))`,
  `(def reverse (lambda (collection)
     (if (empty? collection)
       collection
       (join (reverse (tail collection))
             (list (head collection))))))`,
  `(def find (lambda (predicate collection)
     (if (empty? collection)
       nil
       (do (def value (head collection))
                 (if (predicate value)
                   value
                   (find predicate (tail collection)))))))`,
];

inputs.forEach((input: string) => {
  interpret(input, replEnv, dummyIOHandler);
});

export default replEnv;
