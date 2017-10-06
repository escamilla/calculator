Arithmetic Functions
====================

add(x: number, y: number): number
---------------------------------
Returns the sum of `x` and `y`.
```
(add 1 2) [ 3 ]
```

sub(x: number, y: number): number
---------------------------------
Returns the difference of `x` and `y`.
```
(sub 3 2) [ 1 ]
```

mul(x: number, y: number): number
---------------------------------
Returns the product of `x` and `y`.
```
(mul 2 3) [ 6 ]
```

div(x: number, y: number): number
---------------------------------
Returns the quotient of `x` and `y`.
```
(div 6 3) [ 2 ]
```

mod(x: number, y: number): number
---------------------------------
Returns the remainder after division of `x` and `y`.
```
(mod 5 2) [ 1 ]
```

pow(x: number, y: number): number
---------------------------------
Returns `x` raised to the power of `y`.
```
(pow 2 3) [ 8 ]
```

Comparison Functions
====================

eq(x: number, y: number): number
--------------------------------
Returns `0` if `x` equals `y`. Otherwise, returns `1`.
```
(eq (add 1 2) 3) [ 0 ]
```

lt(x: number, y: number): number
--------------------------------
Returns `0` if `x` is less than `y`. Otherwise, returns `1`.
```
(lt 1 2) [ 0 ]
```

gt(x: number, y: number): number
--------------------------------
Returns `0` if `x` is greater than `y`. Otherwise, returns `1`.
```
(gt 1 2) [ 1 ]
```

List Functions
==============

list(...any): any[]
-------------------
Returns a list containing the arguments as elements.
```
(list a b c) [ (a b c) ]
```

length(list: any[]): number
---------------------------
Returns the number of elements in `list`.
```
(len '(a b c)) [ 3 ]
```

nth(list: any[], n: number): any
--------------------------------
Returns the `n`th element of `list`.
```
(nth '(a b c) 2) [ b ]
```

slice(list: any[], begin: number, end: number): any[]
-----------------------------------------------------
Returns a slice of `list` from index `begin` up to but not including index `end`. Indices are zero-based.
```
(slice '(a b c d e) 1 4) [ (b c d) ]
```

concat(list1: any[], list2: any[]): any[]
-----------------------------------------
Returns the result of concatenating `list1` and `list2`.
```
(concat '(a b c) '(1 2 3)) [ (a b c 1 2 3) ]
```

Other Functions
===============

sequence(...any): any
---------------------
Returns the value of the last expression in a sequence of expressions. Useful for grouping expressions together.
```
(sequence
  (let pi 3.14)
  pi) [ 3.14 ]
```

print(expr: any): any
---------------------
Prints and returns the value of `expr`.
```
(print "Hello, World!\n") [ "Hello, World!\n" ]
```
