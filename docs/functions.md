# Chipmunk Functions

## Table of Contents

* [Arithmetic Functions](#arithmetic-functions)
* [Comparison Functions](#comparison-functions)
* [List Functions](#list-functions)
* [String Functions](#string-functions)
* [I/O Functions](#i-o-functions)
* [Other Functions](#other-functions)

## Arithmetic Functions

### + (addition)

`(+ x y)`

Returns the sum of `x` and `y`.
```
(+ 1 2) [ => 3 ]
```

### - (subtraction)

`(- x y)`

Subtracts `y` from `x` and returns the result.
```
(- 3 2) [ => 1 ]
```

### * (multiplication)

`(* x y)`

Returns the product of `x` and `y`.
```
(* 2 3) [ => 6 ]
```

### / (division)

`(/ x y)`

Returns the quotient of `x` and `y`.
```
(/ 6 3)  [ => 2 ]
(/ 22 7) [ => 3.142857142857143 ]
```

### % (remainder)

`(% x y)`

Divides `x` by `y` and returns the remainder.
```
(% 5 2)  [ => 1 ]
(% -5 2) [ => -1 ]
```

### pow

`(pow x y)`

Returns the result of raising `x` to the power of `y`.
```
(pow 2 3) [ => 8 ]
```

# Comparison Functions

### = (equality)

`(= x y)`

Returns `true` if `x` equals `y`, otherwise `false`.
```
(= 1 1) [ => true ]
(= 1 2) [ => false ]
```

### < (less than)

`(< x y)`

Returns `true` if `x` is less than `y`, otherwise `false`.
```
(< 2 1) [ => false ]
(< 2 2) [ => false ]
(< 2 3) [ => true ]
```

### > (greater than)

`(> x y)`

Returns `true` if `x` is greater than `y`, otherwise `false`.
```
(> 2 1) [ => true ]
(> 2 2) [ => false ]
(> 2 3) [ => false ]
```

## List Functions

### list

`(list items...)`

Returns a new list containing the items.
```
(list 1 2 3) [ => (1 2 3) ]
```

### length

`(length lst)`

Returns the number of items in `lst`.
```
(length '(a b c)) [ => 3 ]
```

### nth

`(nth lst n)`

Returns the `nth` item of `lst`. Indexing is zero-based.
```
(nth '(a b c) 2) [ => c ]
```

### slice

`(slice lst begin end)`

Returns a slice of `lst` from index `begin` up to but not including index `end`. Indices are zero-based.
```
(slice '(a b c d e) 1 4) [ => (b c d) ]
```

### join

`(join lst1 lst2)`

Returns a new list containing the items of `lst1` followed by the items of `lst2`.
```
(join '(a b c) '(1 2 3)) [ => (a b c 1 2 3) ]
```

## String Functions

### length

`(length string)`

Returns the number of characters in the string.
```
(length "hello") [ => 5 ]
```

### nth

`(nth string n)`

Returns the `nth` character of the string. Indexing is zero-based.
```
(nth "hello" 1) [ => "e" ]
```

### concat

`(concat string1 string2)`

Returns the result of concatenating the two strings.
```
(concat "good" "bye") [ "goodbye" ]
```

### to-string

`(to-string value)`

Returns a string representation of the value that will produce the value when entered into the shell.
```
(to-string true)           [ => "true" ]
(to-string false)          [ => "false" ]
(to-string (lambda (x) x)) [ => "(lambda (x) x)" ]
(to-string '(1 2 3))       [ => "(1 2 3)" ]
(to-string nil)            [ => "nil" ]
(to-string 3)              [ => "3" ]
(to-string 3.14)           [ => "3.14" ]
(to-string "hello")        [ => "\"hello\"" ]
(to-string "hello\nworld") [ => "\"hello\\nworld\"" ]
(to-string "\"hello\"")    [ => "\"\\\"hello\\\"\"" ]
(to-string "\\hello\\")    [ => "\"\\\\hello\\\\\"" ]
(to-string 'x)             [ => "x" ]
```

### parse-integer

`(parse-integer string)`

Converts the string to an integer.
```
(parse-integer "3") [ => 3 ]
```

### parse-float

`(parse-float string)`

Converts the string to a floating-point number.
```
(parse-float "3.14") [ => 3.14 ]
```

## I/O Functions

## print

`(print value)`

Prints the value to stdout and returns `nil`.
```
(print "Hello, World!\n")
```

## print-line

`(print-line value)`

Prints the value to stdout followed by a newline and returns `nil`.
```
(print-line "Hello, World!")
```

### read-line

`(read-line prompt)`

Displays the prompt and returns a line entered by the user.

### read-file

`(read-file path)`

Returns the contents of the file as a string.

## Other Functions

## do

`(do expression...)`

Groups multiple expressions into a single expression. The expressions are evaluated and the value of the last one is returned.
```
(do
  (def pi 3.14)
  (* pi 2)) [ => 6.28 ]
```

### parse-string

`(parse-string string)`

Parses the string as a Chipmunk program and returns the resulting Chipmunk expression.
```
(parse-string "(+ 1 2)") [ => (+ 1 2) ]
```

### eval

`(eval expression)`

Evaluates the expression. Useful for evaluating a Chipmunk expression parsed by the `parse-string` function.
```
(eval (parse-string "(+ 1 2)")) [ => 3 ]
```
