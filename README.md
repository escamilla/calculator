Chipmunk CLI
============
Chipmunk is a Lisp-like programming language that I made for fun. This package provides a CLI for running Chipmunk programs and for running a Chipmunk REPL. For the language implementation and documentation, see the [chipmunk-core](https://github.com/escamilla/chipmunk-core) package.

Sample
------
```
(def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

(print-line (map factorial (range 10)))

[ prints "(1 1 2 6 24 120 720 5040 40320 362880)" ]
```

Usage
-----
```
# start a Chipmunk REPL
npm start

# run a Chipmunk program
npm start examples/game-of-life.ch
```
