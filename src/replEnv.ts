import { namespace } from "./core";
import Environment from "./Environment";
import evaluate from "./evaluate";
import interpret from "./interpret";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelType from "./types/SquirrelType";

const replEnv: Environment = new Environment();

replEnv.set("eval", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    return evaluate(args[0], replEnv);
  },
));

replEnv.set("true", new SquirrelBoolean(true));
replEnv.set("false", new SquirrelBoolean(false));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  replEnv.set(name, fn);
});

interpret(`(let load-file (lambda (path) (eval (parse-string (concat "(sequence " (read-file path) ")")))))`, replEnv);

const inputs: string[] = [
  // logic functions
  `(let not (lambda (x) (if x false true)))`,
  `(let and (lambda (x y) (if x y false)))`,
  `(let or (lambda (x y) (if x true y)))`,
  `(let le (lambda (x y) (or (lt x y) (eq x y))))`,
  `(let ge (lambda (x y) (or (gt x y) (eq x y))))`,
  // math functions
  `(let is-even (lambda (x) (eq 0 (mod x 2))))`,
  `(let is-odd (lambda (x) (eq 1 (mod x 2))))`,
  `(let factorial (lambda (x) (if (eq x 0) 1 (mul x (factorial (sub x 1))))))`,
  // list functions
  `(let is-empty (lambda (array)
     (eq 0 (length array))))`,
  `(let head (lambda (array)
     (nth array 0)))`,
  `(let tail (lambda (array)
     (slice array 1 (add (length array) 1))))`,
  `(let range (lambda (x)
     (if (le x 0)
       '()
       (join (range (sub x 1))
             (list (sub x 1))))))`,
  `(let map (lambda (array function)
     (if (is-empty array)
       '()
       (join (list (function (head array)))
             (map (tail array) function)))))`,
  `(let filter (lambda (array function)
     (if (is-empty array)
       '()
       (join (if (function (head array))
               (list (head array))
               '())
             (filter (tail array) function)))))`,
  `(let some (lambda (array function)
     (if (is-empty array)
       false
       (if (function (head array))
         true
         (some (tail array) function)))))`,
  `(let every (lambda (array function)
     (if (is-empty array)
       false
       (if (function (head array))
         true
         (every (tail array) function)))))`,
  `(let reduce (lambda (array function accumulator)
     (if (is-empty array)
       accumulator
       (reduce (tail array)
               function
               (function accumulator (head array))))))`,
  `(let sum (lambda (array)
     (reduce array add 0)))`,
  `(let product (lambda (array)
     (reduce array mul 1)))`,
  `(let includes (lambda (array value)
     (if (is-empty array)
       false
       (if (eq (head array) value)
         true
         (includes (tail array) value)))))`,
  `(let reverse (lambda (array)
     (if (is-empty array)
       '()
       (join (reverse (tail array))
             (list (head array))))))`,
  `(let find (lambda (array function)
     (if (is-empty array)
       '()
       (sequence (let value (head array))
                 (if (function value)
                   value
                   (find (tail array) function))))))`,
];

inputs.forEach((input: string) => {
  interpret(input, replEnv);
});

export default replEnv;
