Squirrel Core
=============
Squirrel is a dialect of Lisp that I made for fun. This module (squirrel-core) only contains the implementation of the Squirrel language. To run Squirrel programs, see the [squirrel-cli](https://github.com/escamilla/squirrel-cli) module.

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

Resources
---------
- [List of Core Functions](docs/core-functions.md)
