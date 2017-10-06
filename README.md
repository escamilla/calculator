Squirrel.ts
===========
A TypeScript rewrite (with several changes) of [Squirrel](https://github.com/escamilla/squirrel), an expression-oriented programming language I originally wrote in C#.

Sample
------
```
[ program that defines a function,
  invokes it, and prints the result ]
(sequence
  (let factorial
    (lambda (x)
      (if (eq x 0)
        1
        (mul x (factorial (sub x 1))))))
  (print (factorial 10)))
```

Usage
-----
```
# run the Squirrel REPL
npm run eval

# run a Squirrel program and display the results
npm run eval <path>

# use the `-v | --verbose` flag to show more details including the parse tree
npm run eval -- -v <path>

# run the included implementation of Conway's Game of Life
npm run eval examples/functions.sq
```

Resources
---------
- [List of Core Functions](docs/core-functions.md)
