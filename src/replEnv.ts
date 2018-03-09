import { namespace } from "./core";
import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelNil from "./types/SquirrelNil";
import SquirrelType from "./types/SquirrelType";

const replEnv: Environment = new Environment();

replEnv.set("eval", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    return evaluate(args[0], replEnv);
  },
));

replEnv.set("nil", new SquirrelNil());
replEnv.set("true", new SquirrelBoolean(true));
replEnv.set("false", new SquirrelBoolean(false));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  replEnv.set(name, fn);
});

const inputs: string[] = [
  // logic functions
  `(def not (lambda (x) (if x false true)))`,
  `(def and (lambda (x y) (if x y false)))`,
  `(def or (lambda (x y) (if x true y)))`,
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
  // i/o functions
  `(def load-file (lambda (path)
     (eval (parse-string (concat "(do " (read-file path) ")")))))`,
];

inputs.forEach((input: string) => {
  interpret(input, replEnv);
});

export default replEnv;
