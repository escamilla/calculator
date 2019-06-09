# Chipmunk
Chipmunk is a toy Lisp-like language

## Example
```
(do
  (def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

  (print-line (map factorial (range 10))))

[ prints "(1 1 2 6 24 120 720 5040 40320 362880)" ]
```

## Usage
```
# start a Chipmunk REPL
npm start

# run a Chipmunk program
npm start examples/game-of-life.ch
```

## Resources
- [List of Chipmunk Functions](docs/functions.md)
