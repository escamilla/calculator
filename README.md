Chipmunk Core
=============
[日本語 (Japanese)](README.jp.md)

Chipmunk is a Lisp-like programming language that I made for fun. This package contains the implementation of the Chipmunk interpreter. To run Chipmunk programs, check out the [chipmunk-cli](https://github.com/escamilla/chipmunk-cli) package.

Example Program
---------------
```
(do
  (def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

  (print-line (map factorial (range 10))))

[ (1 1 2 6 24 120 720 5040 40320 362880) ]
```

Resources
---------
- [List of Chipmunk Functions](docs/functions.md)
