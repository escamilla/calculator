Squirrel CLI
============
Squirrel is a dialect of Lisp that I made for fun. This module (squirrel-cli) provides a CLI for running Squirrel programs and for running a Squirrel REPL. For the language implementation and documentation, see the [squirrel-core](https://github.com/escamilla/squirrel-core) module.

Sample
------
```
(def factorial
  (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

(print-line (map factorial (range 10)))

[ -> (1 1 2 6 24 120 720 5040 40320 362880) ]
```

Usage
-----
```
# start a Squirrel REPL
npm start

# run a Squirrel program
npm start examples/life.sq
```
