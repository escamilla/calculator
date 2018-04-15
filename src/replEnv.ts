import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import dummyIOHandler from "./io/dummyIOHandler";
import IOHandler from "./io/IOHandler";
import ChipmunkBoolean from "./nodes/ChipmunkBoolean";
import ChipmunkList from "./nodes/ChipmunkList";
import ChipmunkNil from "./nodes/ChipmunkNil";
import ChipmunkNode from "./nodes/ChipmunkNode";
import ChipmunkNodeType from "./nodes/ChipmunkNodeType";
import ChipmunkNumber from "./nodes/ChipmunkNumber";
import ChipmunkString from "./nodes/ChipmunkString";
import Parser from "./Parser";
import Tokenizer from "./Tokenizer";
import toString from "./utils/toString";

const replEnv: Environment = new Environment();

type ChipmunkCallable = (args: ChipmunkNode[], ioHandler: IOHandler) => ChipmunkNode;

function defineChipmunkFunction(name: string, callable: ChipmunkCallable): void {
  replEnv.set(name, {
    type: ChipmunkNodeType.FUNCTION,
    callable,
    isUserDefined: false,
    name,
  });
}

defineChipmunkFunction("+",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: x.value + y.value };
  },
);

defineChipmunkFunction("-",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: x.value - y.value };
  },
);

defineChipmunkFunction("*",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: x.value * y.value };
  },
);

defineChipmunkFunction("/",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: x.value / y.value };
  },
);

defineChipmunkFunction("%",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: x.value % y.value };
  },
);

defineChipmunkFunction("pow",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.NUMBER, value: Math.pow(x.value, y.value) };
  },
);

defineChipmunkFunction("=",
  (args: ChipmunkNode[]): ChipmunkBoolean => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.BOOLEAN, value: x.value === y.value };
  },
);

defineChipmunkFunction("<",
  (args: ChipmunkNode[]): ChipmunkBoolean => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.BOOLEAN, value: x.value < y.value };
  },
);

defineChipmunkFunction(">",
  (args: ChipmunkNode[]): ChipmunkNode => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.BOOLEAN, value: x.value > y.value };
  },
);

defineChipmunkFunction("list",
  (args: ChipmunkNode[]): ChipmunkList => {
    return { type: ChipmunkNodeType.LIST, items: args };
  },
);

defineChipmunkFunction("length",
  (args: ChipmunkNode[]): ChipmunkNumber => {
    const arg: ChipmunkNode = args[0];
    if (arg.type === ChipmunkNodeType.LIST) {
      return { type: ChipmunkNodeType.NUMBER, value: arg.items.length };
    } else if (arg.type === ChipmunkNodeType.STRING) {
      return { type: ChipmunkNodeType.NUMBER, value: arg.value.length };
    } else {
      throw new Error("length() takes a list or string");
    }
  },
);

defineChipmunkFunction("nth",
  (args: ChipmunkNode[]): ChipmunkNode => {
    const arg: ChipmunkNode = args[0];
    const index: ChipmunkNumber = args[1] as ChipmunkNumber;

    if (arg.type === ChipmunkNodeType.LIST) {
      return arg.items[index.value];
    } else if (arg.type === ChipmunkNodeType.STRING) {
      return { type: ChipmunkNodeType.STRING, value: arg.value.charAt(index.value) };
    } else {
      throw new Error("nth() takes a list or string");
    }
  },
);

defineChipmunkFunction("slice",
  (args: ChipmunkNode[]): ChipmunkList => {
    const list: ChipmunkList = args[0] as ChipmunkList;
    const start: ChipmunkNumber = args[1] as ChipmunkNumber;
    const end: ChipmunkNumber = args[2] as ChipmunkNumber;
    return { type: ChipmunkNodeType.LIST, items: list.items.slice(start.value, end.value) };
  },
);

defineChipmunkFunction("join",
  (args: ChipmunkNode[]): ChipmunkList => {
    const list1: ChipmunkList = args[0] as ChipmunkList;
    const list2: ChipmunkList = args[1] as ChipmunkList;
    return { type: ChipmunkNodeType.LIST, items: list1.items.concat(list2.items) };
  },
);

defineChipmunkFunction("concat",
  (args: ChipmunkNode[]): ChipmunkString => {
    const castedArgs: ChipmunkString[] = args.map((arg: ChipmunkNode) => arg as ChipmunkString);
    const strings: string[] = castedArgs.map((arg: ChipmunkString) => arg.value);
    return { type: ChipmunkNodeType.STRING, value: strings.join("") };
  },
);

defineChipmunkFunction("to-string",
  (args: ChipmunkNode[]): ChipmunkString => {
    return { type: ChipmunkNodeType.STRING, value: toString(args[0]) };
  },
);

defineChipmunkFunction("parse-integer",
  (args: ChipmunkNode[]): ChipmunkNode => {
    const arg: ChipmunkString = args[0] as ChipmunkString;
    return { type: ChipmunkNodeType.NUMBER, value: parseInt(arg.value, 10) };
  },
);

defineChipmunkFunction("parse-float",
  (args: ChipmunkNode[]): ChipmunkNode => {
    const arg: ChipmunkString = args[0] as ChipmunkString;
    return { type: ChipmunkNodeType.NUMBER, value: parseFloat(arg.value) };
  },
);

defineChipmunkFunction("print",
  (args: ChipmunkNode[], ioHandler: IOHandler): ChipmunkNil => {
    const message: string = toString(args[0], true);
    ioHandler.print(message);
    return { type: ChipmunkNodeType.NIL };
  },
);

defineChipmunkFunction("print-line",
  (args: ChipmunkNode[], ioHandler: IOHandler): ChipmunkNil => {
    if (args.length === 0) {
      ioHandler.printLine();
    } else {
      const message: string = toString(args[0], true);
      ioHandler.printLine(message);
    }
    return { type: ChipmunkNodeType.NIL };
  },
);

defineChipmunkFunction("read-line",
  (args: ChipmunkNode[], ioHandler: IOHandler): ChipmunkString => {
    const prompt: string = (args[0] as ChipmunkString).value;
    const line: string = ioHandler.readLine(prompt);
    return { type: ChipmunkNodeType.STRING, value: line };
  },
);

defineChipmunkFunction("read-file",
  (args: ChipmunkNode[], ioHandler: IOHandler): ChipmunkString => {
    const path: string = (args[0] as ChipmunkString).value;
    const contents: string = ioHandler.readFile(path);
    return { type: ChipmunkNodeType.STRING, value: contents };
  },
);

defineChipmunkFunction("do",
  (args: ChipmunkNode[]): ChipmunkNode => {
    return args[args.length - 1];
  },
);

defineChipmunkFunction("parse-string",
  (args: ChipmunkNode[]): ChipmunkNode => {
    const input: ChipmunkString = args[0] as ChipmunkString;
    const tokenizer: Tokenizer = new Tokenizer(input.value);
    const parser: Parser = new Parser(tokenizer.tokenize());
    return parser.parse();
  },
);

defineChipmunkFunction("eval",
  (args: ChipmunkNode[], ioHandler: IOHandler): ChipmunkNode => {
    return evaluate(args[0], replEnv, ioHandler);
  },
);

replEnv.set("nil", { type: ChipmunkNodeType.NIL });
replEnv.set("true", { type: ChipmunkNodeType.BOOLEAN, value: true });
replEnv.set("false", { type: ChipmunkNodeType.BOOLEAN, value: false });

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
