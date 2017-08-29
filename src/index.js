function and(a, b) {return a && b}

var not = (x) => !x

function isArray(arr) { return Array.isArray(arr) }

function isAtom(a) { return not(isArray(a)) }

function cons(a, b) { return [a, b] }

// I must be sure a consCell never contains more than 2 items - it's dumber than JS
function car(consCell) { return cons(consCell[0], consCell[1])[0] }
var first = car
function cdr(consCell) { return cons(consCell[0], consCell[1])[1] }
var second = cdr

function isEqual(a, b) { return a === b }

// (cond ((true 1))) ;; => 1
function cond(condBody) {
  var firstClause = first(first(condBody))
  if (firstClause) {
    return second(first(condBody))
  }
  var secondClause = first(second(condBody))
  if (secondClause) {
    return second(second(condBody))
  }
}

console.assert(cons(1, 2))

console.assert(car(cons(1, 3)))

console.assert(cdr(cdr(cons(1, cons(1, 3)))))

console.assert(isEqual((car(cons(1, 3))),
                       (car(cons(1, 3)))))

console.assert(
  isEqual("ja!",
          cond(cons(cons(true, "ja!")))))

/*
 * (cond
 *   ((nil 0)
 *    (t 1))) ;;=> 1
 * */
console.assert(
  isEqual(
    cond(cons(cons(false, 0),
              cons(true, 1))),
    1))
