import coreFunctions from "./coreFunctions";
import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import dummyIOHandler from "./io/dummyIOHandler";
import IOHandler from "./io/IOHandler";
import SquirrelFunction from "./nodes/SquirrelFunction";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";

const replEnv: Environment = new Environment();

replEnv.set("eval", {
  type: SquirrelNodeType.FUNCTION,
  callable: (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNode => {
    return evaluate(args[0], replEnv, ioHandler);
  },
  isUserDefined: false,
  name: "eval",
});

replEnv.set("nil", { type: SquirrelNodeType.NIL });
replEnv.set("true", { type: SquirrelNodeType.BOOLEAN, value: true });
replEnv.set("false", { type: SquirrelNodeType.BOOLEAN, value: false });

coreFunctions.forEach((fn: SquirrelFunction) => {
  replEnv.set(fn.name as string, fn);
});

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
