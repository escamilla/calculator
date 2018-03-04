# Math Functions

## (+ x y)
Returns the sum of `x` and `y`.
```
(+ 1 2) [ 3 ]
```

## (- x y)
Returns the difference of `x` and `y`.
```
(- 3 2) [ 1 ]
```

## (* x y)
Returns the product of `x` and `y`.
```
(* 2 3) [ 6 ]
```

## (/ x y)
Returns the quotient of `x` and `y`.
```
(/ 6 3) [ 2 ]
(/ 22 7) [ 3.142857142857143 ]
```

## (% x y)
Returns the remainder after division of `x` and `y`.
```
(% 5 2) [ 1 ]
```

## (pow x y)
Returns `x` raised to the power of `y`.
```
(pow 2 3) [ 8 ]
```

# Comparison Functions

## (= x y)
Returns `true` if `x` equals `y`, `false` if not.
```
(= (+ 1 2) 3) [ true ]
(= (+ 2 2) 5) [ false ]
```

## (< x y)
Returns `true` if `x` is less than `y`, `false` if not.
```
(< 2 3) [ true ]
(< 2 1) [ false ]
```

## (> x y)
Returns `true` if `x` is greater than `y`, `false` if not.
```
(> 2 1) [ true ]
(> 2 3) [ false ]
```

# List Functions

## (list items...)
Creates a new list containing the items.
```
(list 1 2 3) [ (1 2 3) ]
```

## (length lst)
Returns the number of elements in `lst`.
```
(length '(a b c)) [ 3 ]
```

## (nth lst n)
Returns the `nth` element of `lst`. Indexing is zero-based.
```
(nth '(a b c) 2) [ c ]
```

## (slice lst begin end)
Returns a slice of `lst` from index `begin` up to but not including index `end`. Indices are zero-based.
```
(slice '(a b c d e) 1 4) [ (b c d) ]
```

## (join lst1 lst2)
Concatenates the two lists.
```
(join '(a b c) '(1 2 3)) [ (a b c 1 2 3) ]
```

# String Functions

## (length string)
Returns the number of characters in the string.
```
(length "hello") [ 5 ]
```

## (nth string n)
Returns the `nth` character of the string. Indexing is zero-based.
```
(nth "hello" 1) [ "e" ]
```

## (concat string1 string2)
Returns the result of concatenating the two strings.
```
(concat "good" "bye") [ "goodbye" ]
```

# I/O Functions

## (print value)
Prints and then returns the value.
```
(print "Hello, World!\n")
```

## (parse-string string)
Parses the string as Squirrel source code and returns the resulting Squirrel data type.
```
(eval (parse-string "(+ 1 2)")) [ 3 ]
```

## (read-file path)
Returns the contents of the file as a string.

## (read-line prompt)
Displays the prompt and returns a line entered by the user.

# Other Functions

## (do expr...)
Evaluates multiple expressions in order and returns the value of the last one.
```
(do
  (def pi 3.14)
  pi) [ 3.14 ]
```
