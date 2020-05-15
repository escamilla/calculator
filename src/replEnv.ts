import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import dummyIOHandler from "./io/dummyIOHandler";
import IOHandler from "./io/IOHandler";
import Parser from "./Parser";
import Tokenizer from "./Tokenizer";
import {
  ChipmunkBoolean,
  ChipmunkList,
  ChipmunkNil,
  ChipmunkNodeType,
  ChipmunkNumber,
  ChipmunkString,
  ChipmunkType,
} from "./types";
import toString from "./utils/toString";

const replEnv: Environment = new Environment();

type ChipmunkCallable = (args: ChipmunkType[], ioHandler: IOHandler) => ChipmunkType;

function defineChipmunkFunction(name: string, callable: ChipmunkCallable): void {
  replEnv.set(name, {
    type: ChipmunkNodeType.Function,
    callable,
    isUserDefined: false,
    name,
  });
}

defineChipmunkFunction("+",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: x.value + y.value };
  },
);

defineChipmunkFunction("-",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: x.value - y.value };
  },
);

defineChipmunkFunction("*",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: x.value * y.value };
  },
);

defineChipmunkFunction("/",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: x.value / y.value };
  },
);

defineChipmunkFunction("%",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: x.value % y.value };
  },
);

defineChipmunkFunction("pow",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Number, value: Math.pow(x.value, y.value) };
  },
);

defineChipmunkFunction("=",
  (args: ChipmunkType[]): ChipmunkBoolean => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Boolean, value: x.value === y.value };
  },
);

defineChipmunkFunction("<",
  (args: ChipmunkType[]): ChipmunkBoolean => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Boolean, value: x.value < y.value };
  },
);

defineChipmunkFunction(">",
  (args: ChipmunkType[]): ChipmunkType => {
    const x: ChipmunkNumber = args[0] as ChipmunkNumber;
    const y: ChipmunkNumber = args[1] as ChipmunkNumber;
    return { type: ChipmunkNodeType.Boolean, value: x.value > y.value };
  },
);

defineChipmunkFunction("list",
  (args: ChipmunkType[]): ChipmunkList => {
    return { type: ChipmunkNodeType.List, items: args };
  },
);

defineChipmunkFunction("length",
  (args: ChipmunkType[]): ChipmunkNumber => {
    const arg: ChipmunkType = args[0];
    if (arg.type === ChipmunkNodeType.List) {
      return { type: ChipmunkNodeType.Number, value: arg.items.length };
    } else if (arg.type === ChipmunkNodeType.String) {
      return { type: ChipmunkNodeType.Number, value: arg.value.length };
    } else {
      throw new Error("length() takes a list or string");
    }
  },
);

defineChipmunkFunction("nth",
  (args: ChipmunkType[]): ChipmunkType => {
    const arg: ChipmunkType = args[0];
    const index: ChipmunkNumber = args[1] as ChipmunkNumber;

    if (arg.type === ChipmunkNodeType.List) {
      return arg.items[index.value];
    } else if (arg.type === ChipmunkNodeType.String) {
      return { type: ChipmunkNodeType.String, value: arg.value.charAt(index.value) };
    } else {
      throw new Error("nth() takes a list or string");
    }
  },
);

defineChipmunkFunction("slice",
  (args: ChipmunkType[]): ChipmunkList => {
    const list: ChipmunkList = args[0] as ChipmunkList;
    const start: ChipmunkNumber = args[1] as ChipmunkNumber;
    const end: ChipmunkNumber = args[2] as ChipmunkNumber;
    return { type: ChipmunkNodeType.List, items: list.items.slice(start.value, end.value) };
  },
);

defineChipmunkFunction("join",
  (args: ChipmunkType[]): ChipmunkList => {
    const list1: ChipmunkList = args[0] as ChipmunkList;
    const list2: ChipmunkList = args[1] as ChipmunkList;
    return { type: ChipmunkNodeType.List, items: list1.items.concat(list2.items) };
  },
);

defineChipmunkFunction("concat",
  (args: ChipmunkType[]): ChipmunkString => {
    const castedArgs: ChipmunkString[] = args.map((arg: ChipmunkType): ChipmunkString => arg as ChipmunkString);
    const strings: string[] = castedArgs.map((arg: ChipmunkString): string => arg.value);
    return { type: ChipmunkNodeType.String, value: strings.join("") };
  },
);

defineChipmunkFunction("to-string",
  (args: ChipmunkType[]): ChipmunkString => {
    return { type: ChipmunkNodeType.String, value: toString(args[0]) };
  },
);

defineChipmunkFunction("parse-integer",
  (args: ChipmunkType[]): ChipmunkType => {
    const arg: ChipmunkString = args[0] as ChipmunkString;
    return { type: ChipmunkNodeType.Number, value: parseInt(arg.value, 10) };
  },
);

defineChipmunkFunction("parse-float",
  (args: ChipmunkType[]): ChipmunkType => {
    const arg: ChipmunkString = args[0] as ChipmunkString;
    return { type: ChipmunkNodeType.Number, value: parseFloat(arg.value) };
  },
);

defineChipmunkFunction("print",
  (args: ChipmunkType[], ioHandler: IOHandler): ChipmunkNil => {
    const message: string = toString(args[0], true);
    ioHandler.print(message);
    return { type: ChipmunkNodeType.Nil };
  },
);

defineChipmunkFunction("print-line",
  (args: ChipmunkType[], ioHandler: IOHandler): ChipmunkNil => {
    if (args.length === 0) {
      ioHandler.printLine();
    } else {
      const message: string = toString(args[0], true);
      ioHandler.printLine(message);
    }
    return { type: ChipmunkNodeType.Nil };
  },
);

defineChipmunkFunction("read-line",
  (args: ChipmunkType[], ioHandler: IOHandler): ChipmunkString => {
    const prompt: string = (args[0] as ChipmunkString).value;
    const line: string = ioHandler.readLine(prompt);
    return { type: ChipmunkNodeType.String, value: line };
  },
);

defineChipmunkFunction("read-file",
  (args: ChipmunkType[], ioHandler: IOHandler): ChipmunkString => {
    const path: string = (args[0] as ChipmunkString).value;
    const contents: string = ioHandler.readFile(path);
    return { type: ChipmunkNodeType.String, value: contents };
  },
);

defineChipmunkFunction("do",
  (args: ChipmunkType[]): ChipmunkType => {
    return args[args.length - 1];
  },
);

defineChipmunkFunction("parse-string",
  (args: ChipmunkType[]): ChipmunkType => {
    const input: ChipmunkString = args[0] as ChipmunkString;
    const tokenizer: Tokenizer = new Tokenizer(input.value);
    const parser: Parser = new Parser(tokenizer.tokenize());
    return parser.parse();
  },
);

defineChipmunkFunction("eval",
  (args: ChipmunkType[], ioHandler: IOHandler): ChipmunkType => {
    return evaluate(args[0], replEnv, ioHandler);
  },
);

replEnv.set("nil", { type: ChipmunkNodeType.Nil });
replEnv.set("true", { type: ChipmunkNodeType.Boolean, value: true });
replEnv.set("false", { type: ChipmunkNodeType.Boolean, value: false });

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

inputs.forEach((input: string): void => {
  interpret(input, replEnv, dummyIOHandler);
});

export default replEnv;
