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
# run a Squirrel shell
npm start

# run a Squirrel program
npm start examples/life.sq
```

Resources
---------
- [List of Core Functions](docs/core-functions.md)
