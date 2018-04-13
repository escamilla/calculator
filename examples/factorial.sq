[ print the factorial of a number]
(do
  (def factorial (lambda (x)
    (if (= x 0)
      1
      (* x (factorial (- x 1))))))
  (def x (nth argv 0))
  (print-line (concat (to-string x) (concat "! = " (to-string (factorial x))))))
