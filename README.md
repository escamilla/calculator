# Chipmunk
Chipmunk is an interpreted dialect of Lisp with partial support for compiling to JavaScript. Chipmunk is a hobby language with the goal of achieving self-hosting.

## Sample
```
(do
  (def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))

  (print-line (map factorial (range 10))))

; prints "[1 1 2 6 24 120 720 5040 40320 362880]"
```

## Usage
```
# start a Chipmunk REPL
deno run src/index.ts

# run a Chipmunk program
deno run --allow-read src/index.ts examples/game-of-life.ch

# compile a Chipmunk program to JavaScript with a source map (not all Chipmunk functions are supported)
deno run --allow-read --allow-write src/compile.ts examples/game-of-life.ch

# run the compiled JavaScript
deno run examples/game-of-life.js
```

## Resources
- [List of Chipmunk Functions](docs/functions.md)
- [Source Map Visualization](https://sokra.github.io/source-map-visualization/)
