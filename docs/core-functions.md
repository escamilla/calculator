# Arithmetic Functions

## (add x:number y:number): number
Returns the sum of `x` and `y`.
```
(add 1 2) [ 3 ]
```

## (sub x:number y:number): number
Returns the difference of `x` and `y`.
```
(sub 3 2) [ 1 ]
```

## (mul x:number y:number): number
Returns the product of `x` and `y`.
```
(mul 2 3) [ 6 ]
```

## (div x:number y:number): number
Returns the quotient of `x` and `y`.
```
(div 6 3) [ 2 ]
```

## (mod x:number y:number): number
Returns the remainder after division of `x` and `y`.
```
(mod 5 2) [ 1 ]
```

## (pow x:number y:number): number
Returns `x` raised to the power of `y`.
```
(pow 2 3) [ 8 ]
```

Comparison Functions
====================

## (eq x:number y:number): boolean
Returns `true` if `x` equals `y`. Otherwise, returns `false`.
```
(eq (add 1 2) 3) [ true ]
```

## (lt x:number y:number): boolean
Returns `true` if `x` is less than `y`. Otherwise, returns `false`.
```
(lt 1 2) [ true ]
```

## (gt x:number y:number): boolean
Returns `true` if `x` is greater than `y`. Otherwise, returns `false`.
```
(gt 1 2) [ false ]
```

List Functions
==============

## (list ...:any): list
Returns a list containing the arguments as elements.
```
(list a b c) [ (a b c) ]
```

## (length lst:list): number
Returns the number of elements in `lst`.
```
(len '(a b c)) [ 3 ]
```

## (nth lst:list n:number): any
Returns the `n`th element of `lst`.
```
(nth '(a b c) 2) [ b ]
```

## (slice lst:list begin:number end:number): list
Returns a slice of `lst` from index `begin` up to but not including index `end`. Indices are zero-based.
```
(slice '(a b c d e) 1 4) [ (b c d) ]
```

## (concat lst1:list lst2:list): list
Returns the result of concatenating `lst1` and `lst2`.
```
(concat '(a b c) '(1 2 3)) [ (a b c 1 2 3) ]
```

Other Functions
===============

## (sequence ...:any): any
Returns the value of the last expression in a sequence of expressions. Useful for grouping expressions together.
```
(sequence
  (let pi 3.14)
  pi) [ 3.14 ]
```

## (print expr:any): any
Prints and returns the value of `expr`.
```
(print "Hello, World!\n") [ "Hello, World!\n" ]
```
