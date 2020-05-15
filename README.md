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
deno run src/index.ts

# run a Chipmunk program
deno run --allow-read src/index.ts examples/game-of-life.ch

# compile a Chipmunk program to JavaScript with a source map (not all Chipmunk functions are supported)
deno run --allow-read --allow-write src/compile.ts examples/fibonacci-sequence.ch
```

## Resources
- [List of Chipmunk Functions](docs/functions.md)
- [Source Map Visualization](https://sokra.github.io/source-map-visualization/)
