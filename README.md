Squirrel
========
An expression-oriented programming language inspired by Lisp

Sample
------
```
[ define a factorial function ]
(do
  (def factorial
    (lambda (x) (if (= x 0) 1 (* x (factorial (- x 1))))))
  (print (factorial 10)))
```

Usage
-----
```
# run a Squirrel shell
npm start

# run a Squirrel program
npm start examples/life.sq
```

Resources
---------
- [List of Core Functions](docs/core-functions.md)
